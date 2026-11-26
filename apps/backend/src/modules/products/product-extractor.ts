import { ProductImportError, UnsupportedProductUrlError } from './errors.js';
import type { ExtractedProduct, ProductAvailability, ProductExtractor } from './types.js';
import { normalizeProductUrl } from './url.js';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
};

const decodeHtml = (value: string): string =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)));

const parseAttributes = (tag: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    const key = match[1];
    const value = match[2] ?? match[3];
    if (key !== undefined && value !== undefined) attributes[key.toLowerCase()] = decodeHtml(value);
  }
  return attributes;
};

const readMeta = (html: string, key: string): string | undefined => {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if (attributes.property === key || attributes.name === key) return attributes.content;
  }
  return undefined;
};

const jsonLdObjects = (html: string): JsonObject[] => {
  const objects: JsonObject[] = [];
  for (const match of html.matchAll(
    /<script\b[^>]*type\s*=\s*(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      const parsed: unknown = JSON.parse(decodeHtml(match[1] ?? ''));
      const values = Array.isArray(parsed) ? parsed : [parsed];
      for (const value of values) {
        if (isObject(value)) objects.push(value);
      }
    } catch {
      // A malformed block must not hide another valid structured-data block.
    }
  }
  return objects;
};

const hasType = (value: JsonObject, expected: string): boolean => {
  const type = value['@type'];
  return type === expected || (Array.isArray(type) && type.includes(expected));
};

const firstObject = (value: unknown): JsonObject | undefined => {
  if (isObject(value)) return value;
  if (Array.isArray(value)) return value.find(isObject);
  return undefined;
};

const findOffer = (product: JsonObject): JsonObject | undefined => firstObject(product.offers);

const selectProduct = (objects: JsonObject[], sourceUrl: URL): JsonObject | undefined => {
  const products = objects.flatMap(object => {
    if (hasType(object, 'Product')) return [object];
    if (hasType(object, 'ProductGroup') && Array.isArray(object.hasVariant)) {
      return object.hasVariant.filter(isObject);
    }
    if (Array.isArray(object['@graph'])) {
      return object['@graph'].filter(isObject).filter(candidate => hasType(candidate, 'Product'));
    }
    return [];
  });

  const size = sourceUrl.searchParams.get('size');
  if (size !== null) {
    const selected = products.find(product => asString(product.size) === size);
    if (selected) return selected;
  }

  const variant = sourceUrl.searchParams.get('variant');
  if (variant !== null) {
    const selected = products.find(product => {
      const offerUrl = asString(findOffer(product)?.url);
      if (!offerUrl) return false;
      return new URL(offerUrl, sourceUrl).searchParams.get('variant') === variant;
    });
    if (selected) return selected;
  }

  return products[0];
};

const parsePrice = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const normalized = value.replace(/\s/g, '').replace(',', '.');
  const price = Number(normalized);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
};

const parseAvailability = (value: string | undefined): ProductAvailability => {
  const normalized = value
    ?.split('/')
    .pop()
    ?.replace(/[^a-z]/gi, '')
    .toLowerCase();
  if (normalized === 'instock') return 'in_stock';
  if (normalized === 'outofstock' || normalized === 'soldout') return 'out_of_stock';
  return 'unknown';
};

const absoluteImageUrl = (value: string | undefined, sourceUrl: URL): string | undefined => {
  if (!value) return undefined;
  const image = new URL(value, sourceUrl);
  if (image.protocol === 'http:') image.protocol = 'https:';
  return image.toString();
};

export const extractProductFromHtml = (html: string, source: string): ExtractedProduct => {
  const sourceUrl = new URL(source);
  const product = selectProduct(jsonLdObjects(html), sourceUrl);
  const offer = product ? findOffer(product) : undefined;

  const name = asString(product?.name) ?? readMeta(html, 'og:title');
  const productImage = product?.image;
  const imageValue =
    asString(productImage) ??
    (Array.isArray(productImage) ? asString(productImage[0]) : undefined) ??
    readMeta(html, 'og:image:secure_url') ??
    readMeta(html, 'og:image');
  const price = parsePrice(asString(offer?.price) ?? readMeta(html, 'og:price:amount'));
  const currency = asString(offer?.priceCurrency) ?? readMeta(html, 'og:price:currency');
  const availability = parseAvailability(
    asString(offer?.availability) ?? readMeta(html, 'product:availability')
  );
  const imageUrl = absoluteImageUrl(imageValue, sourceUrl);

  if (!name || !imageUrl || price === undefined || !currency) {
    throw new ProductImportError(
      'The page did not expose a complete product name, image, price, and currency'
    );
  }

  return {
    name: decodeHtml(name),
    imageUrl,
    price,
    currency: currency.toUpperCase(),
    availability
  };
};

export class HttpProductExtractor implements ProductExtractor {
  public async extract(sourceUrl: string): Promise<ExtractedProduct> {
    let response: Response;
    try {
      response = await fetch(sourceUrl, {
        headers: {
          accept: 'text/html,application/xhtml+xml',
          'accept-language': 'fr-FR,fr;q=0.9',
          'user-agent': 'CoWish/0.1 product metadata importer'
        },
        signal: AbortSignal.timeout(15_000)
      });
    } catch (error) {
      throw new ProductImportError(
        `Unable to download the product page: ${error instanceof Error ? error.message : 'unknown error'}`
      );
    }

    try {
      normalizeProductUrl(response.url);
    } catch (error) {
      if (error instanceof UnsupportedProductUrlError) {
        throw new ProductImportError('The product page redirected to a non-HTTPS URL');
      }
      throw error;
    }
    if (!response.ok)
      throw new ProductImportError(`The product page returned HTTP ${response.status}`);
    return extractProductFromHtml(await response.text(), sourceUrl);
  }
}
