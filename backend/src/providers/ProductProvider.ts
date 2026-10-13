export type ProductSourceType = 'Catalog' | 'Live' | 'Estimated';

export type ResultSection = 'exact' | 'variants' | 'similar' | 'accessories' | 'best_value';

export interface ProviderListing {
  id: string;
  productId: string;
  websiteId: string;
  websiteName: string;
  country: string;
  countryCode: string;
  price: number;
  currency: string;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  returnDays: number;
  priceHistory: string;
  priceType: 'Catalog' | 'Live price' | 'Estimated';
  sourceName?: string;
  fetchedAt?: string;
  directStoreUrl?: string;
}

export interface ProviderSearchResult {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string | null;
  imageEmoji?: string;
  image?: string;
  description: string;
  basePriceUsd: number;
  totalListingsCount?: number;
  availableCountries?: string[];
  source: ProductSourceType;
  isGenerated?: boolean;
  score?: number;
  liveSource?: string;
  fetchedAt?: string;
  directStoreUrl?: string;
  listings?: ProviderListing[];
  section?: ResultSection;
  badges?: string[];
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
}

export interface ProductProvider {
  readonly name: string;
  search(query: string, country?: string, filters?: SearchFilters): Promise<ProviderSearchResult[]>;
  getById(id: string): Promise<any | null>;
  getRelated(productId: string): Promise<ProviderSearchResult[]>;
}
