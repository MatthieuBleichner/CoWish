import type { Product, ProductAvailability } from '@cowish/shared';

export type { PriceObservation, Product, ProductAvailability } from '@cowish/shared';

export interface ExtractedProduct {
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  availability: ProductAvailability;
}

export interface ProductRefreshResult {
  product: Product;
  priceChanged: boolean;
  previousPrice: number | null;
}

export interface ProductExtractor {
  extract(sourceUrl: string): Promise<ExtractedProduct>;
}

export interface ProductRepository {
  list(): Promise<Product[]>;
  findById(id: string): Promise<Product | undefined>;
  findBySourceUrl(sourceUrl: string): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
}
