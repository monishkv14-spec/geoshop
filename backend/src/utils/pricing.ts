/**
 * GeoShop Pure Pricing, Quality Index, and Currency Utilities
 * Deterministic, unit-tested calculations for multi-currency conversion,
 * Quality Index (0-100) transparent factors, and relative Price Pulse tiers.
 */

export const EXCHANGE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  INR: 83.5,
  GBP: 0.79,
  EUR: 0.92,
  JPY: 155.0,
  AUD: 1.52,
  AED: 3.67,
  BRL: 5.15,
  CAD: 1.36,
  SGD: 1.34,
  KRW: 1330,
};

export type PriceTier = 'cheapest' | 'mid' | 'expensive';

export interface PriceTierInfo {
  tier: PriceTier;
  color: string; // hex code for 3D Globe pin pulse
  relativeDifferencePercent: number; // % difference from global cheapest
}

export interface QualityIndexBreakdown {
  score: number; // 0 - 100
  ratingComponent: number; // 0 - 40
  reviewVolumeComponent: number; // 0 - 30
  sellerTrustComponent: number; // 0 - 30
  hasHassleFreeReturn: boolean;
  returnPolicyDays: number;
  hasPriceGougingRisk: boolean;
  bestTimeToBuyHint: 'Historical low - buy now' | 'Good time to buy' | 'Price is high - consider waiting';
}

export interface PriceHistoryPoint {
  day: number;
  price: number;
}

/**
 * Converts any supported local currency amount to USD
 */
export function convertToUsd(amount: number, currency: string): number {
  if (amount < 0) return 0;
  const rate = EXCHANGE_RATES_TO_USD[currency.toUpperCase()] || 1.0;
  return Number((amount / rate).toFixed(2));
}

/**
 * Converts USD amount to a target local currency
 */
export function convertFromUsd(amountUsd: number, targetCurrency: string): number {
  if (amountUsd < 0) return 0;
  const rate = EXCHANGE_RATES_TO_USD[targetCurrency.toUpperCase()] || 1.0;
  return Math.round(amountUsd * rate);
}

/**
 * Calculates Quality Index (0 - 100) with full transparency factors:
 * - Rating (40% weight): rating/5 * 40
 * - Review volume (30% weight, log-scaled): log10(reviews+1)/log10(50000) * 30
 * - Seller trust (30% weight): trustScore/5 * 30
 * - Return policy & price-gouging checks
 */
export function calculateQualityIndex(
  rating: number,
  reviewCount: number,
  trustScore: number,
  returnDays: number = 30,
  priceHistoryJson?: string,
  currentPrice?: number
): QualityIndexBreakdown {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const clampedTrust = Math.max(0, Math.min(5, trustScore));
  const safeReviews = Math.max(0, reviewCount);

  // 1. Rating component: 40%
  const ratingComponent = Number(((clampedRating / 5) * 40).toFixed(1));

  // 2. Review volume component: 30% log-scaled (benchmark 50,000 reviews = 30 pts)
  const maxBenchmarkLog = Math.log10(50000);
  const currentLog = Math.log10(safeReviews + 1);
  const reviewVolumeComponent = Number((Math.min(30, (currentLog / maxBenchmarkLog) * 30)).toFixed(1));

  // 3. Seller trust component: 30%
  const sellerTrustComponent = Number(((clampedTrust / 5) * 30).toFixed(1));

  const totalRaw = Math.round(ratingComponent + reviewVolumeComponent + sellerTrustComponent);
  const score = Math.max(0, Math.min(100, totalRaw));

  // 4. Return policy flag
  const hasHassleFreeReturn = returnDays >= 14;

  // 5. Price history analysis & price-gouging risk
  let hasPriceGougingRisk = false;
  let bestTimeToBuyHint: QualityIndexBreakdown['bestTimeToBuyHint'] = 'Good time to buy';

  if (priceHistoryJson && currentPrice !== undefined) {
    try {
      const history: PriceHistoryPoint[] = JSON.parse(priceHistoryJson);
      if (Array.isArray(history) && history.length > 0) {
        const prices = history.map((h) => h.price).filter((p) => typeof p === 'number' && p > 0);
        if (prices.length > 0) {
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          const minHistory = Math.min(...prices);

          // If current price is > 20% above historical average, flag gouging risk
          if (currentPrice > avgPrice * 1.2) {
            hasPriceGougingRisk = true;
            bestTimeToBuyHint = 'Price is high - consider waiting';
          } else if (currentPrice <= minHistory * 1.03) {
            bestTimeToBuyHint = 'Historical low - buy now';
          }
        }
      }
    } catch {
      // Gracefully ignore parse errors
    }
  }

  return {
    score,
    ratingComponent,
    reviewVolumeComponent,
    sellerTrustComponent,
    hasHassleFreeReturn,
    returnPolicyDays: returnDays,
    hasPriceGougingRisk,
    bestTimeToBuyHint,
  };
}

/**
 * Calculates Price Pulse tiers for a set of country prices (normalized to USD).
 * Green = cheapest (lowest price up to +10%)
 * Amber = mid (+10% to +30% above lowest)
 * Red = expensive (> +30% above lowest)
 */
export function calculatePriceTier(priceUsd: number, minUsd: number): PriceTierInfo {
  if (minUsd <= 0 || priceUsd <= 0) {
    return { tier: 'cheapest', color: '#22c55e', relativeDifferencePercent: 0 };
  }

  const diffPercent = ((priceUsd - minUsd) / minUsd) * 100;
  const roundedDiff = Number(diffPercent.toFixed(1));

  if (roundedDiff <= 10) {
    return {
      tier: 'cheapest',
      color: '#22c55e', // Green
      relativeDifferencePercent: roundedDiff,
    };
  }

  if (roundedDiff <= 30) {
    return {
      tier: 'mid',
      color: '#f59e0b', // Amber
      relativeDifferencePercent: roundedDiff,
    };
  }

  return {
    tier: 'expensive',
    color: '#ef4444', // Red
    relativeDifferencePercent: roundedDiff,
  };
}

/**
 * Calculates Deal Arc savings percentage between two locations
 * Positive value indicates how much cheaper target is compared to source.
 */
export function calculateDealSavingsPercent(sourcePriceUsd: number, targetPriceUsd: number): number {
  if (sourcePriceUsd <= 0 || targetPriceUsd >= sourcePriceUsd) return 0;
  const savings = ((sourcePriceUsd - targetPriceUsd) / sourcePriceUsd) * 100;
  return Number(savings.toFixed(1));
}
