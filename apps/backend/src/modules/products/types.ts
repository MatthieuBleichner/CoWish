export interface ExtractedProduct {
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
}

export interface PriceObservation {
  price: number;
  currency: string;
  checkedAt: string;
}

export interface Product extends ExtractedProduct {
  id: string;
  sourceUrl: string;
  createdAt: string;
  lastCheckedAt: string;
  priceHistory: PriceObservation[];
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
