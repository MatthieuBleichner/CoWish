import { getJson, postJson } from '../../../api/client';
import { queryOptions } from '@tanstack/react-query';
import type { PriceObservation, Product } from '@cowish/shared';

const isString = (value: unknown): value is string => typeof value === 'string';

const isPriceObservation = (value: unknown): value is PriceObservation => {
  if (!value || typeof value !== 'object') return false;
  const observation = value as Record<string, unknown>;
  return (
    typeof observation.price === 'number' &&
    isString(observation.currency) &&
    isString(observation.checkedAt)
  );
};

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== 'object') return false;
  const product = value as Record<string, unknown>;
  return (
    isString(product.id) &&
    isString(product.name) &&
    isString(product.imageUrl) &&
    typeof product.price === 'number' &&
    isString(product.currency) &&
    (product.availability === 'in_stock' ||
      product.availability === 'out_of_stock' ||
      product.availability === 'unknown') &&
    isString(product.sourceUrl) &&
    isString(product.createdAt) &&
    isString(product.lastCheckedAt) &&
    Array.isArray(product.priceHistory) &&
    product.priceHistory.every(isPriceObservation)
  );
};

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const body = await getJson('/api/products', signal);
  if (!body || typeof body !== 'object') throw new Error('Invalid products response');
  const products = (body as Record<string, unknown>).products;
  if (!Array.isArray(products) || !products.every(isProduct)) {
    throw new Error('Invalid products response');
  }
  return products;
}

export async function importProduct(url: string): Promise<Product> {
  const body = await postJson('/api/products/import', { url });
  if (!body || typeof body !== 'object') throw new Error('Invalid product import response');
  const product = (body as Record<string, unknown>).product;
  if (!isProduct(product)) throw new Error('Invalid product import response');
  return product;
}

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: ({ signal }) => fetchProducts(signal)
  });
