export type ProductAvailability = 'in_stock' | 'out_of_stock' | 'unknown';

export interface PriceObservation {
  price: number;
  currency: string;
  checkedAt: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  currency: string;
  availability: ProductAvailability;
  sourceUrl: string;
  createdAt: string;
  lastCheckedAt: string;
  priceHistory: PriceObservation[];
}
