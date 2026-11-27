import { randomUUID } from 'node:crypto';

import { ProductNotFoundError } from './errors.js';
import { FileProductRepository } from './file-product-repository.js';
import { HttpProductExtractor } from './product-extractor.js';
import type {
  Product,
  ProductExtractor,
  ProductRefreshResult,
  ProductRepository
} from './types.js';
import { normalizeProductUrl } from './url.js';

export type ProductRefreshOutcome =
  | { status: 'fulfilled'; value: ProductRefreshResult }
  | { status: 'rejected'; productId: string; reason: unknown };

export class ProductService {
  public constructor(
    private readonly repository: ProductRepository,
    private readonly extractor: ProductExtractor,
    private readonly now: () => Date = () => new Date(),
    private readonly createId: () => string = randomUUID
  ) {}

  public list(): Promise<Product[]> {
    return this.repository.list();
  }

  public async import(sourceUrl: string): Promise<ProductRefreshResult> {
    const normalizedUrl = normalizeProductUrl(sourceUrl);
    const existing = await this.repository.findBySourceUrl(normalizedUrl);
    if (existing) return this.refreshProduct(existing);

    const extracted = await this.extractor.extract(normalizedUrl);
    const checkedAt = this.now().toISOString();
    const product: Product = {
      id: this.createId(),
      sourceUrl: normalizedUrl,
      ...extracted,
      createdAt: checkedAt,
      lastCheckedAt: checkedAt,
      priceHistory: [{ price: extracted.price, currency: extracted.currency, checkedAt }]
    };
    await this.repository.save(product);
    return { product, priceChanged: false, previousPrice: null };
  }

  public async refresh(id: string): Promise<ProductRefreshResult> {
    const product = await this.repository.findById(id);
    if (!product) throw new ProductNotFoundError('Product not found');
    return this.refreshProduct(product);
  }

  public async refreshAll(): Promise<ProductRefreshOutcome[]> {
    const products = await this.repository.list();
    const results = await Promise.allSettled(products.map(product => this.refreshProduct(product)));

    return results.map((result, index) =>
      result.status === 'fulfilled'
        ? result
        : {
            status: result.status,
            productId: products[index]?.id ?? 'unknown',
            reason: result.reason
          }
    );
  }

  private async refreshProduct(product: Product): Promise<ProductRefreshResult> {
    const extracted = await this.extractor.extract(product.sourceUrl);
    const previousPrice = product.price;
    const checkedAt = this.now().toISOString();
    const updated: Product = {
      ...product,
      ...extracted,
      lastCheckedAt: checkedAt,
      priceHistory: [
        ...product.priceHistory,
        { price: extracted.price, currency: extracted.currency, checkedAt }
      ]
    };
    await this.repository.save(updated);
    return {
      product: updated,
      priceChanged: previousPrice !== extracted.price || product.currency !== extracted.currency,
      previousPrice
    };
  }
}

export const productService = new ProductService(
  new FileProductRepository(process.env.PRODUCT_STORE_PATH ?? 'data/products.json'),
  new HttpProductExtractor()
);
