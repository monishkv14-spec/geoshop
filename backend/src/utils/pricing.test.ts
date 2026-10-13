import { describe, it, expect } from 'vitest';
import {
  convertToUsd,
  convertFromUsd,
  calculateQualityIndex,
  calculatePriceTier,
  calculateDealSavingsPercent,
  EXCHANGE_RATES_TO_USD,
} from './pricing.js';

describe('Pricing Utilities: Currency Conversion', () => {
  it('converts local currencies to USD accurately', () => {
    expect(convertToUsd(8350, 'INR')).toBe(100);
    expect(convertToUsd(100, 'USD')).toBe(100);
    expect(convertToUsd(79, 'GBP')).toBe(100);
    expect(convertToUsd(92, 'EUR')).toBe(100);
    expect(convertToUsd(15500, 'JPY')).toBe(100);
  });

  it('converts USD to target local currencies accurately', () => {
    expect(convertFromUsd(100, 'INR')).toBe(8350);
    expect(convertFromUsd(100, 'EUR')).toBe(92);
    expect(convertFromUsd(100, 'GBP')).toBe(79);
  });

  it('handles negative or invalid values gracefully', () => {
    expect(convertToUsd(-50, 'INR')).toBe(0);
    expect(convertFromUsd(-10, 'USD')).toBe(0);
  });
});

describe('Quality Index (0-100) with Transparent Factors', () => {
  it('calculates perfect 100 for top tier rating, volume, and trust', () => {
    const result = calculateQualityIndex(5.0, 50000, 5.0, 30);
    expect(result.score).toBe(100);
    expect(result.ratingComponent).toBe(40);
    expect(result.reviewVolumeComponent).toBe(30);
    expect(result.sellerTrustComponent).toBe(30);
    expect(result.hasHassleFreeReturn).toBe(true);
  });

  it('correctly weighs rating at 40%, review volume log scale, and trust at 30%', () => {
    const result = calculateQualityIndex(4.5, 5000, 4.0, 14);
    // Rating: (4.5/5)*40 = 36
    expect(result.ratingComponent).toBe(36);
    // Trust: (4.0/5)*30 = 24
    expect(result.sellerTrustComponent).toBe(24);
    // Review volume log component should be between 20 and 26 for 5,000 reviews
    expect(result.reviewVolumeComponent).toBeGreaterThan(20);
    expect(result.reviewVolumeComponent).toBeLessThan(26);
    expect(result.hasHassleFreeReturn).toBe(true);
  });

  it('flags price gouging when price is significantly above historical average', () => {
    const priceHistory = JSON.stringify([
      { day: 1, price: 100 },
      { day: 15, price: 105 },
      { day: 30, price: 102 },
    ]);
    const normalResult = calculateQualityIndex(4.5, 1000, 4.5, 30, priceHistory, 102);
    expect(normalResult.hasPriceGougingRisk).toBe(false);

    const gougedResult = calculateQualityIndex(4.5, 1000, 4.5, 30, priceHistory, 150);
    expect(gougedResult.hasPriceGougingRisk).toBe(true);
    expect(gougedResult.bestTimeToBuyHint).toBe('Price is high - consider waiting');
  });

  it('identifies historical low prices for best time to buy', () => {
    const priceHistory = JSON.stringify([
      { day: 1, price: 120 },
      { day: 15, price: 110 },
      { day: 30, price: 95 },
    ]);
    const lowResult = calculateQualityIndex(4.8, 2000, 4.8, 30, priceHistory, 95);
    expect(lowResult.bestTimeToBuyHint).toBe('Historical low - buy now');
  });
});

describe('Price Pulse Tiers and Deal Savings Arcs', () => {
  it('correctly categorizes green (cheapest) for prices within 10% of min', () => {
    const res = calculatePriceTier(105, 100);
    expect(res.tier).toBe('cheapest');
    expect(res.color).toBe('#22c55e');
    expect(res.relativeDifferencePercent).toBe(5);
  });

  it('correctly categorizes amber (mid) for prices between 10% and 30% above min', () => {
    const res = calculatePriceTier(120, 100);
    expect(res.tier).toBe('mid');
    expect(res.color).toBe('#f59e0b');
    expect(res.relativeDifferencePercent).toBe(20);
  });

  it('correctly categorizes red (expensive) for prices > 30% above min', () => {
    const res = calculatePriceTier(145, 100);
    expect(res.tier).toBe('expensive');
    expect(res.color).toBe('#ef4444');
    expect(res.relativeDifferencePercent).toBe(45);
  });

  it('calculates deal savings percentage accurately between two prices', () => {
    const savings = calculateDealSavingsPercent(1200, 960);
    // (1200 - 960) / 1200 = 240 / 1200 = 20%
    expect(savings).toBe(20);

    const noSavings = calculateDealSavingsPercent(900, 1000);
    expect(noSavings).toBe(0);
  });
});
