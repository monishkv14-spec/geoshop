export type PriceTier = 'cheapest' | 'mid' | 'expensive';

export interface Location {
  id: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  currency: string;
  atmosphereColor: string;
  storeCount?: number;
  websites?: ShoppingWebsite[];
  // Compatibility fields
  country?: string;
  flag?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  currencySymbol?: string;
  backgroundMood?: string;
  description?: string;
}

export interface ShoppingWebsite {
  id: string;
  name: string;
  locationId: string;
  country?: string;
  countryCode?: string;
  currency?: string;
  baseSearchUrl: string;
  trustScore: number;
  domain?: string;
  logo?: string;
  isLocal?: boolean;
}

export interface QualityIndexBreakdown {
  score: number;
  ratingComponent: number;
  reviewVolumeComponent: number;
  sellerTrustComponent: number;
  hasHassleFreeReturn: boolean;
  returnPolicyDays: number;
  hasPriceGougingRisk: boolean;
  bestTimeToBuyHint: 'Historical low - buy now' | 'Good time to buy' | 'Price is high - consider waiting';
}

export interface QualityFactors {
  totalQualityScore: number;
  breakdown: {
    customerRatingScore: string;
    reviewVolumeScore: string;
    sellerReliability: string;
    returnPolicyDays: string;
    priceConsistency: string;
  };
}

export interface PriceHistoryPoint {
  date?: string;
  day?: number;
  price: number;
}

export interface ProductListing {
  id: string;
  listingId?: string;
  productId: string;
  productName: string;
  productEmoji?: string;
  productImage?: string;
  brand?: string;
  model?: string;
  websiteId: string;
  websiteName: string;
  websiteDomain?: string;
  websiteLogo?: string;
  isLocalStore?: boolean;
  sellerTrustScore?: number;
  trustScore?: number;
  locationId: string;
  country: string;
  countryCode: string;
  price: number;
  originalPrice?: number;
  currency: string;
  currencySymbol?: string;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockStatus?: string;
  deliveryEst?: string;
  returnDays?: number;
  qualityScore?: number;
  qualityIndex?: QualityIndexBreakdown;
  qualityFactors?: QualityFactors;
  priceHistory?: PriceHistoryPoint[];
  directStoreUrl?: string;
  originalProductUrl?: string;
  availability?: boolean;
  lastUpdated?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  model?: string;
  category: string;
  imageEmoji: string;
  image?: string;
  description: string;
  specs?: Record<string, string>;
  basePriceUsd?: number;
  minUsdPrice?: number;
  totalListingsCount: number;
  availableCountries: string[];
  listings?: any[];
}

export interface GlobeMarker {
  locationId: string;
  country: string;
  code: string;
  lat: number;
  lon: number;
  latitude?: number;
  longitude?: number;
  flag?: string;
  region?: string;
  currency: string;
  currencySymbol?: string;
  atmosphereColor: string;
  backgroundMood?: string;
  storeCount: number;
  storesCount?: number;
  lowestPrice: number;
  lowestUsdPrice: number;
  minPrice?: number;
  maxPrice?: number;
  priceTier?: PriceTier;
  pulseColor?: string;
  relativeDifferencePercent?: number;
  websites?: string[];
  stores?: string[];
  inStock: boolean;
  availabilityStatus?: 'Available' | 'Highly Available' | 'Limited' | 'Loading';
}

export interface AIAnalysisResult {
  queryIntent: string;
  detectedBrand: string;
  detectedCategory: string;
  confidenceScore: number;
  globalMerchantsScanned: number;
  matchingLocationsCount: number;
  scannedPlatforms: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  searchedAt: string;
  product?: {
    id: string;
    name: string;
    imageEmoji?: string;
    image?: string;
    category: string;
  } | null;
  location?: {
    id: string;
    name: string;
    code: string;
    flag?: string;
  } | null;
}

export interface SavedItem {
  id: string;
  savedAt: string;
  listingId: string;
  product: {
    id: string;
    name: string;
    brand: string;
    category: string;
    imageEmoji: string;
  };
  website: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
  };
  price: number;
  currency: string;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  directStoreUrl: string;
}
