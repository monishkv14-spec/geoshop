import { PrismaClient } from '@prisma/client';
import { generateCatalogProducts } from '../data/catalogGenerator.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

// ── Exchange rates: 1 USD = X local currency ────────────────────────────────
const CURRENCY_RATES: Record<string, number> = {
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

// ── Regional price index (import tax / local pricing multiplier) ────────────
const COUNTRY_PRICE_INDEX: Record<string, number> = {
  IN: 0.95,
  US: 1.0,
  GB: 1.08,
  DE: 1.06,
  FR: 1.07,
  JP: 0.98,
  AU: 1.12,
  AE: 1.02,
  BR: 1.18,
  CA: 1.04,
  SG: 1.05,
  KR: 0.96,
};

// ── Currency symbols ────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', INR: '₹', GBP: '£', EUR: '€', JPY: '¥',
  AUD: 'A$', AED: 'د.إ', BRL: 'R$', CAD: 'C$', SGD: 'S$', KRW: '₩',
};

// ── Category mapping for store→product fit ─────────────────────────────────
function storeMatchesProduct(storeCategories: string, productCategory: string): boolean {
  const cats = storeCategories.toLowerCase();
  if (cats.includes('general')) return true;
  const pc = productCategory.toLowerCase();
  // Map product categories to store category tags
  const mapping: Record<string, string[]> = {
    'accessories': ['electronics', 'mobile'],
    'audio': ['electronics'],
    'cables': ['electronics'],
    'peripherals': ['electronics'],
    'storage': ['electronics'],
    'wearables': ['electronics'],
    'gaming': ['electronics', 'gaming'],
    'cameras': ['electronics'],
    'appliances': ['electronics', 'home'],
    'computers': ['electronics'],
    'smartphones': ['electronics', 'mobile'],
    'footwear': ['fashion'],
    'fashion': ['fashion'],
    'stationery': ['general', 'office'],
    'fitness': ['sports'],
    'kitchen': ['home'],
    'lighting': ['home'],
    'tools': ['home'],
    'automotive': ['general'],
    'pet supplies': ['general'],
    'grocery': ['grocery'],
    'beauty': ['beauty', 'general'],
    'personal care': ['beauty', 'general'],
  };
  const productTags = mapping[pc] || ['general'];
  return productTags.some(tag => cats.includes(tag));
}

// ── 30-day price history with seeded variation ─────────────────────────────
function generatePriceHistory(currentPrice: number, seed: number): string {
  const history: { date: string; price: number }[] = [];
  const now = new Date();
  let rng = pseudoRandom(seed);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    let price = currentPrice;
    if (i > 0) {
      const variationFactor = 1 + ((Math.sin(i * 0.7) * 0.04) + (rng() * 0.03 - 0.015));
      price = Math.round(currentPrice * variationFactor * 100) / 100;
    }
    history.push({ date: dateStr, price });
  }
  return JSON.stringify(history);
}

// ── Deterministic PRNG ─────────────────────────────────────────────────────
function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  SINGLE SOURCE OF TRUTH: 12 Countries
// ═══════════════════════════════════════════════════════════════════════════
const COUNTRIES = [
  { name: 'India',                 code: 'IN',  isoA3: 'IND', lat: 20.5937,  lon: 78.9629,   currency: 'INR', flag: '🇮🇳', atmosphereColor: '#ff9933' },
  { name: 'United States',        code: 'US',  isoA3: 'USA', lat: 37.0902,  lon: -95.7129,  currency: 'USD', flag: '🇺🇸', atmosphereColor: '#00d2ff' },
  { name: 'United Kingdom',       code: 'GB',  isoA3: 'GBR', lat: 55.3781,  lon: -3.436,    currency: 'GBP', flag: '🇬🇧', atmosphereColor: '#6366f1' },
  { name: 'Germany',              code: 'DE',  isoA3: 'DEU', lat: 51.1657,  lon: 10.4515,   currency: 'EUR', flag: '🇩🇪', atmosphereColor: '#22c55e' },
  { name: 'France',               code: 'FR',  isoA3: 'FRA', lat: 46.6034,  lon: 1.8883,    currency: 'EUR', flag: '🇫🇷', atmosphereColor: '#a855f7' },
  { name: 'Japan',                code: 'JP',  isoA3: 'JPN', lat: 36.2048,  lon: 138.2529,  currency: 'JPY', flag: '🇯🇵', atmosphereColor: '#ff4d4d' },
  { name: 'Australia',            code: 'AU',  isoA3: 'AUS', lat: -25.2744, lon: 133.7751,  currency: 'AUD', flag: '🇦🇺', atmosphereColor: '#eab308' },
  { name: 'United Arab Emirates', code: 'AE',  isoA3: 'ARE', lat: 23.4241,  lon: 53.8478,   currency: 'AED', flag: '🇦🇪', atmosphereColor: '#f97316' },
  { name: 'Brazil',               code: 'BR',  isoA3: 'BRA', lat: -14.235,  lon: -51.9253,  currency: 'BRL', flag: '🇧🇷', atmosphereColor: '#10b981' },
  { name: 'Canada',               code: 'CA',  isoA3: 'CAN', lat: 56.1304,  lon: -106.3468, currency: 'CAD', flag: '🇨🇦', atmosphereColor: '#ef4444' },
  { name: 'Singapore',            code: 'SG',  isoA3: 'SGP', lat: 1.3521,   lon: 103.8198,  currency: 'SGD', flag: '🇸🇬', atmosphereColor: '#ec4899' },
  { name: 'South Korea',          code: 'KR',  isoA3: 'KOR', lat: 35.9078,  lon: 127.7669,  currency: 'KRW', flag: '🇰🇷', atmosphereColor: '#3b82f6' },
];

// ═══════════════════════════════════════════════════════════════════════════
//  72 STORES (6 per country, real merchants, real search URLs)
// ═══════════════════════════════════════════════════════════════════════════
interface StoreData {
  name: string;
  countryCode: string;         // ISO-2
  baseSearchUrl: string;
  trustScore: number;          // 0-100
  categories: string;
  deliveryDays: number;
  returnDays: number;
  logoInitial: string;
  logoColor: string;
}

const STORES: StoreData[] = [
  // ── India ─────────────────────────────────────────────────────────────────
  { name: 'Amazon India',      countryCode: 'IN', baseSearchUrl: 'https://www.amazon.in/s?k={query}',                              trustScore: 95, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 3,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Flipkart',          countryCode: 'IN', baseSearchUrl: 'https://www.flipkart.com/search?q={query}',                      trustScore: 93, categories: 'electronics,fashion,home,general',         deliveryDays: 3,  returnDays: 30, logoInitial: 'F', logoColor: '#2874f0' },
  { name: 'Meesho',            countryCode: 'IN', baseSearchUrl: 'https://www.meesho.com/search?q={query}',                        trustScore: 84, categories: 'electronics,fashion,home,general',         deliveryDays: 4,  returnDays: 7,   logoInitial: 'M', logoColor: '#f43397' },
  { name: 'Croma',             countryCode: 'IN', baseSearchUrl: 'https://www.croma.com/searchB?q={query}',                        trustScore: 85, categories: 'electronics',                              deliveryDays: 5,  returnDays: 14, logoInitial: 'C', logoColor: '#00a651' },
  { name: 'Reliance Digital',  countryCode: 'IN', baseSearchUrl: 'https://www.reliancedigital.in/search?q={query}',                trustScore: 86, categories: 'electronics',                              deliveryDays: 4,  returnDays: 14, logoInitial: 'R', logoColor: '#003da5' },
  { name: 'Vijay Sales',       countryCode: 'IN', baseSearchUrl: 'https://www.vijaysales.com/search/{query}',                      trustScore: 80, categories: 'electronics',                              deliveryDays: 5,  returnDays: 14, logoInitial: 'V', logoColor: '#e31837' },
  { name: 'Tata CLiQ',         countryCode: 'IN', baseSearchUrl: 'https://www.tatacliq.com/search/?searchCategory=all&text={query}', trustScore: 82, categories: 'electronics,fashion,home,general',       deliveryDays: 5,  returnDays: 30, logoInitial: 'T', logoColor: '#6d28d9' },

  // ── United States ─────────────────────────────────────────────────────────
  { name: 'Amazon US',        countryCode: 'US', baseSearchUrl: 'https://www.amazon.com/s?k={query}',                               trustScore: 96, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Best Buy',         countryCode: 'US', baseSearchUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st={query}',            trustScore: 92, categories: 'electronics',                              deliveryDays: 3,  returnDays: 15, logoInitial: 'B', logoColor: '#0046be' },
  { name: 'Walmart',          countryCode: 'US', baseSearchUrl: 'https://www.walmart.com/search?q={query}',                          trustScore: 94, categories: 'electronics,home,grocery,general',         deliveryDays: 2,  returnDays: 30, logoInitial: 'W', logoColor: '#0071dc' },
  { name: 'Target',           countryCode: 'US', baseSearchUrl: 'https://www.target.com/s?searchTerm={query}',                       trustScore: 90, categories: 'electronics,home,fashion,general',         deliveryDays: 3,  returnDays: 30, logoInitial: 'T', logoColor: '#cc0000' },
  { name: 'B&H Photo',        countryCode: 'US', baseSearchUrl: 'https://www.bhphotovideo.com/c/search?Ntt={query}',                 trustScore: 93, categories: 'electronics',                              deliveryDays: 3,  returnDays: 30, logoInitial: 'B', logoColor: '#000000' },
  { name: 'Newegg',           countryCode: 'US', baseSearchUrl: 'https://www.newegg.com/p/pl?d={query}',                             trustScore: 88, categories: 'electronics',                              deliveryDays: 4,  returnDays: 30, logoInitial: 'N', logoColor: '#f68b1e' },

  // ── United Kingdom ────────────────────────────────────────────────────────
  { name: 'Amazon UK',        countryCode: 'GB', baseSearchUrl: 'https://www.amazon.co.uk/s?k={query}',                              trustScore: 95, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Currys',           countryCode: 'GB', baseSearchUrl: 'https://www.currys.co.uk/search/{query}',                           trustScore: 88, categories: 'electronics',                              deliveryDays: 3,  returnDays: 21, logoInitial: 'C', logoColor: '#1a0dab' },
  { name: 'Argos',            countryCode: 'GB', baseSearchUrl: 'https://www.argos.co.uk/search/{query}/',                           trustScore: 86, categories: 'electronics,home,general',                 deliveryDays: 3,  returnDays: 30, logoInitial: 'A', logoColor: '#e31837' },
  { name: 'John Lewis',       countryCode: 'GB', baseSearchUrl: 'https://www.johnlewis.com/search?search-term={query}',              trustScore: 91, categories: 'electronics,home,fashion',                 deliveryDays: 3,  returnDays: 35, logoInitial: 'J', logoColor: '#003d29' },
  { name: 'AO.com',           countryCode: 'GB', baseSearchUrl: 'https://ao.com/search/{query}',                                     trustScore: 84, categories: 'electronics,home',                         deliveryDays: 2,  returnDays: 14, logoInitial: 'A', logoColor: '#00b2ff' },
  { name: 'Very',             countryCode: 'GB', baseSearchUrl: 'https://www.very.co.uk/search/{query}',                             trustScore: 82, categories: 'electronics,fashion,home,general',         deliveryDays: 4,  returnDays: 28, logoInitial: 'V', logoColor: '#d60270' },

  // ── Germany ───────────────────────────────────────────────────────────────
  { name: 'Amazon.de',        countryCode: 'DE', baseSearchUrl: 'https://www.amazon.de/s?k={query}',                                 trustScore: 95, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'MediaMarkt',       countryCode: 'DE', baseSearchUrl: 'https://www.mediamarkt.de/de/search.html?query={query}',            trustScore: 90, categories: 'electronics',                              deliveryDays: 3,  returnDays: 14, logoInitial: 'M', logoColor: '#df0000' },
  { name: 'Saturn',           countryCode: 'DE', baseSearchUrl: 'https://www.saturn.de/de/search.html?query={query}',                trustScore: 88, categories: 'electronics',                              deliveryDays: 3,  returnDays: 14, logoInitial: 'S', logoColor: '#ff7600' },
  { name: 'Otto',             countryCode: 'DE', baseSearchUrl: 'https://www.otto.de/suche/{query}/',                                trustScore: 85, categories: 'electronics,fashion,home,general',         deliveryDays: 4,  returnDays: 30, logoInitial: 'O', logoColor: '#c41230' },
  { name: 'Cyberport',        countryCode: 'DE', baseSearchUrl: 'https://www.cyberport.de/?q={query}',                               trustScore: 83, categories: 'electronics',                              deliveryDays: 4,  returnDays: 14, logoInitial: 'C', logoColor: '#0068b4' },
  { name: 'Notebooksbilliger', countryCode: 'DE', baseSearchUrl: 'https://www.notebooksbilliger.de/search?q={query}',                trustScore: 84, categories: 'electronics',                              deliveryDays: 3,  returnDays: 14, logoInitial: 'N', logoColor: '#f07000' },

  // ── France ────────────────────────────────────────────────────────────────
  { name: 'Amazon.fr',        countryCode: 'FR', baseSearchUrl: 'https://www.amazon.fr/s?k={query}',                                 trustScore: 95, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Fnac',             countryCode: 'FR', baseSearchUrl: 'https://www.fnac.com/SearchResult/ResultList.aspx?Search={query}',   trustScore: 89, categories: 'electronics,general',                     deliveryDays: 3,  returnDays: 15, logoInitial: 'F', logoColor: '#e1a400' },
  { name: 'Darty',            countryCode: 'FR', baseSearchUrl: 'https://www.darty.com/nav/recherche?text={query}',                   trustScore: 86, categories: 'electronics,home',                        deliveryDays: 3,  returnDays: 15, logoInitial: 'D', logoColor: '#d40000' },
  { name: 'Boulanger',        countryCode: 'FR', baseSearchUrl: 'https://www.boulanger.com/resultats?tr={query}',                    trustScore: 84, categories: 'electronics,home',                        deliveryDays: 4,  returnDays: 15, logoInitial: 'B', logoColor: '#0055a5' },
  { name: 'Cdiscount',        countryCode: 'FR', baseSearchUrl: 'https://www.cdiscount.com/search/10/{query}.html',                  trustScore: 82, categories: 'electronics,home,fashion,general',         deliveryDays: 4,  returnDays: 14, logoInitial: 'C', logoColor: '#0564c1' },
  { name: 'LDLC',             countryCode: 'FR', baseSearchUrl: 'https://www.ldlc.com/recherche/{query}/',                           trustScore: 85, categories: 'electronics',                              deliveryDays: 4,  returnDays: 14, logoInitial: 'L', logoColor: '#f7a600' },

  // ── Japan ─────────────────────────────────────────────────────────────────
  { name: 'Amazon Japan',     countryCode: 'JP', baseSearchUrl: 'https://www.amazon.co.jp/s?k={query}',                              trustScore: 95, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Rakuten Ichiba',   countryCode: 'JP', baseSearchUrl: 'https://search.rakuten.co.jp/search/mall/{query}/',                 trustScore: 92, categories: 'electronics,fashion,home,general',         deliveryDays: 3,  returnDays: 14, logoInitial: 'R', logoColor: '#bf0000' },
  { name: 'Yodobashi Camera', countryCode: 'JP', baseSearchUrl: 'https://www.yodobashi.com/?word={query}',                           trustScore: 90, categories: 'electronics',                              deliveryDays: 2,  returnDays: 14, logoInitial: 'Y', logoColor: '#c81d25' },
  { name: 'Bic Camera',       countryCode: 'JP', baseSearchUrl: 'https://www.biccamera.com/bc/category/?q={query}',                  trustScore: 88, categories: 'electronics',                              deliveryDays: 3,  returnDays: 14, logoInitial: 'B', logoColor: '#ec6800' },
  { name: 'Yahoo! Shopping',  countryCode: 'JP', baseSearchUrl: 'https://shopping.yahoo.co.jp/search?p={query}',                     trustScore: 86, categories: 'electronics,fashion,home,general',         deliveryDays: 4,  returnDays: 14, logoInitial: 'Y', logoColor: '#ff0033' },
  { name: 'Edion',            countryCode: 'JP', baseSearchUrl: 'https://www.edion.com/search?q={query}',                            trustScore: 82, categories: 'electronics',                              deliveryDays: 4,  returnDays: 14, logoInitial: 'E', logoColor: '#0058a6' },

  // ── Australia ─────────────────────────────────────────────────────────────
  { name: 'Amazon AU',        countryCode: 'AU', baseSearchUrl: 'https://www.amazon.com.au/s?k={query}',                             trustScore: 93, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 3,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'JB Hi-Fi',         countryCode: 'AU', baseSearchUrl: 'https://www.jbhifi.com.au/search?query={query}',                    trustScore: 91, categories: 'electronics',                              deliveryDays: 3,  returnDays: 30, logoInitial: 'J', logoColor: '#000000' },
  { name: 'Harvey Norman',    countryCode: 'AU', baseSearchUrl: 'https://www.harveynorman.com.au/search?q={query}',                  trustScore: 87, categories: 'electronics,home',                        deliveryDays: 4,  returnDays: 14, logoInitial: 'H', logoColor: '#ffd100' },
  { name: 'The Good Guys',    countryCode: 'AU', baseSearchUrl: 'https://www.thegoodguys.com.au/SearchDisplay?searchTerm={query}',    trustScore: 86, categories: 'electronics,home',                        deliveryDays: 4,  returnDays: 14, logoInitial: 'G', logoColor: '#e4002b' },
  { name: 'Officeworks',      countryCode: 'AU', baseSearchUrl: 'https://www.officeworks.com.au/shop/officeworks/search?q={query}',   trustScore: 84, categories: 'electronics,general,office',               deliveryDays: 4,  returnDays: 30, logoInitial: 'O', logoColor: '#0055a4' },
  { name: 'eBay Australia',   countryCode: 'AU', baseSearchUrl: 'https://www.ebay.com.au/sch/i.html?_nkw={query}',                   trustScore: 85, categories: 'electronics,fashion,home,general',         deliveryDays: 5,  returnDays: 30, logoInitial: 'e', logoColor: '#e53238' },

  // ── United Arab Emirates ──────────────────────────────────────────────────
  { name: 'Amazon.ae',        countryCode: 'AE', baseSearchUrl: 'https://www.amazon.ae/s?k={query}',                                 trustScore: 94, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Noon',             countryCode: 'AE', baseSearchUrl: 'https://www.noon.com/uae-en/search/?q={query}',                     trustScore: 90, categories: 'electronics,fashion,home,general',         deliveryDays: 2,  returnDays: 15, logoInitial: 'N', logoColor: '#feee00' },
  { name: 'Sharaf DG',        countryCode: 'AE', baseSearchUrl: 'https://uae.sharafdg.com/search/?q={query}',                        trustScore: 86, categories: 'electronics',                              deliveryDays: 3,  returnDays: 14, logoInitial: 'S', logoColor: '#c71d24' },
  { name: 'Jumbo Electronics', countryCode: 'AE', baseSearchUrl: 'https://www.jumbo.ae/search?q={query}',                            trustScore: 82, categories: 'electronics',                              deliveryDays: 3,  returnDays: 14, logoInitial: 'J', logoColor: '#ed1c24' },
  { name: 'Emax',             countryCode: 'AE', baseSearchUrl: 'https://www.emaxme.com/catalogsearch/result/?q={query}',            trustScore: 80, categories: 'electronics',                              deliveryDays: 4,  returnDays: 14, logoInitial: 'E', logoColor: '#0080c9' },
  { name: 'Lulu Hypermarket', countryCode: 'AE', baseSearchUrl: 'https://www.luluhypermarket.com/en-ae/search?q={query}',            trustScore: 78, categories: 'home,grocery,general',                     deliveryDays: 3,  returnDays: 7,  logoInitial: 'L', logoColor: '#005a33' },

  // ── Brazil ────────────────────────────────────────────────────────────────
  { name: 'Amazon Brasil',     countryCode: 'BR', baseSearchUrl: 'https://www.amazon.com.br/s?k={query}',                            trustScore: 92, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 3,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Mercado Livre',     countryCode: 'BR', baseSearchUrl: 'https://lista.mercadolivre.com.br/{query}',                        trustScore: 90, categories: 'electronics,fashion,home,general',         deliveryDays: 4,  returnDays: 30, logoInitial: 'M', logoColor: '#ffe600' },
  { name: 'Magazine Luiza',    countryCode: 'BR', baseSearchUrl: 'https://www.magazineluiza.com.br/busca/{query}/',                   trustScore: 87, categories: 'electronics,home,general',                deliveryDays: 4,  returnDays: 30, logoInitial: 'M', logoColor: '#0087d0' },
  { name: 'Casas Bahia',       countryCode: 'BR', baseSearchUrl: 'https://www.casasbahia.com.br/busca/{query}',                      trustScore: 84, categories: 'electronics,home',                        deliveryDays: 5,  returnDays: 30, logoInitial: 'C', logoColor: '#003473' },
  { name: 'Americanas',        countryCode: 'BR', baseSearchUrl: 'https://www.americanas.com.br/busca/{query}',                      trustScore: 83, categories: 'electronics,fashion,home,general',         deliveryDays: 5,  returnDays: 30, logoInitial: 'A', logoColor: '#ed1b2c' },
  { name: 'Fast Shop',         countryCode: 'BR', baseSearchUrl: 'https://www.fastshop.com.br/web/s/{query}',                        trustScore: 80, categories: 'electronics',                              deliveryDays: 5,  returnDays: 14, logoInitial: 'F', logoColor: '#0070c0' },

  // ── Canada ────────────────────────────────────────────────────────────────
  { name: 'Amazon.ca',        countryCode: 'CA', baseSearchUrl: 'https://www.amazon.ca/s?k={query}',                                 trustScore: 95, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Best Buy Canada',  countryCode: 'CA', baseSearchUrl: 'https://www.bestbuy.ca/en-ca/search?search={query}',                trustScore: 91, categories: 'electronics',                              deliveryDays: 3,  returnDays: 30, logoInitial: 'B', logoColor: '#0046be' },
  { name: 'Walmart Canada',   countryCode: 'CA', baseSearchUrl: 'https://www.walmart.ca/search?q={query}',                           trustScore: 93, categories: 'electronics,home,grocery,general',         deliveryDays: 3,  returnDays: 30, logoInitial: 'W', logoColor: '#0071dc' },
  { name: 'Canadian Tire',    countryCode: 'CA', baseSearchUrl: 'https://www.canadiantire.ca/en/search-results.html?q={query}',      trustScore: 85, categories: 'electronics,home,general',                 deliveryDays: 4,  returnDays: 30, logoInitial: 'C', logoColor: '#d71920' },
  { name: 'Staples Canada',   countryCode: 'CA', baseSearchUrl: 'https://www.staples.ca/search?query={query}',                       trustScore: 82, categories: 'electronics,office,general',               deliveryDays: 4,  returnDays: 30, logoInitial: 'S', logoColor: '#cc0000' },
  { name: 'Memory Express',   countryCode: 'CA', baseSearchUrl: 'https://www.memoryexpress.com/Search/Products?Search={query}',      trustScore: 84, categories: 'electronics',                              deliveryDays: 4,  returnDays: 15, logoInitial: 'M', logoColor: '#1a4380' },

  // ── Singapore ─────────────────────────────────────────────────────────────
  { name: 'Shopee SG',        countryCode: 'SG', baseSearchUrl: 'https://shopee.sg/search?keyword={query}',                          trustScore: 88, categories: 'electronics,fashion,home,general',         deliveryDays: 3,  returnDays: 15, logoInitial: 'S', logoColor: '#ee4d2d' },
  { name: 'Lazada SG',        countryCode: 'SG', baseSearchUrl: 'https://www.lazada.sg/catalog/?q={query}',                          trustScore: 86, categories: 'electronics,fashion,home,general',         deliveryDays: 3,  returnDays: 15, logoInitial: 'L', logoColor: '#0f146d' },
  { name: 'Amazon.sg',        countryCode: 'SG', baseSearchUrl: 'https://www.amazon.sg/s?k={query}',                                 trustScore: 92, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 2,  returnDays: 30, logoInitial: 'A', logoColor: '#ff9900' },
  { name: 'Challenger',       countryCode: 'SG', baseSearchUrl: 'https://www.challenger.sg/search?q={query}',                        trustScore: 85, categories: 'electronics',                              deliveryDays: 3,  returnDays: 7,  logoInitial: 'C', logoColor: '#003d7f' },
  { name: 'Courts',           countryCode: 'SG', baseSearchUrl: 'https://www.courts.com.sg/search?q={query}',                        trustScore: 82, categories: 'electronics,home',                        deliveryDays: 4,  returnDays: 14, logoInitial: 'C', logoColor: '#e31937' },
  { name: 'Gain City',        countryCode: 'SG', baseSearchUrl: 'https://www.gaincity.com/search/{query}',                           trustScore: 80, categories: 'electronics,home',                        deliveryDays: 4,  returnDays: 14, logoInitial: 'G', logoColor: '#ed1c24' },

  // ── South Korea ───────────────────────────────────────────────────────────
  { name: 'Coupang',          countryCode: 'KR', baseSearchUrl: 'https://www.coupang.com/np/search?q={query}',                       trustScore: 94, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 1,  returnDays: 30, logoInitial: 'C', logoColor: '#ae001c' },
  { name: 'Gmarket',          countryCode: 'KR', baseSearchUrl: 'https://browse.gmarket.co.kr/search?keyword={query}',               trustScore: 88, categories: 'electronics,fashion,home,general',         deliveryDays: 3,  returnDays: 14, logoInitial: 'G', logoColor: '#009b4d' },
  { name: '11st',             countryCode: 'KR', baseSearchUrl: 'https://search.11st.co.kr/Search.tmall?kwd={query}',                trustScore: 86, categories: 'electronics,fashion,home,general',         deliveryDays: 3,  returnDays: 14, logoInitial: '1', logoColor: '#ff0038' },
  { name: 'SSG.com',          countryCode: 'KR', baseSearchUrl: 'https://www.ssg.com/search.ssg?target=all&query={query}',           trustScore: 84, categories: 'electronics,fashion,home,grocery,general', deliveryDays: 3,  returnDays: 14, logoInitial: 'S', logoColor: '#ff5252' },
  { name: 'Lotte ON',         countryCode: 'KR', baseSearchUrl: 'https://www.lotteon.com/search/search/search.ecn?render=search&platform=pc&q={query}', trustScore: 83, categories: 'electronics,fashion,home,general', deliveryDays: 3,  returnDays: 14, logoInitial: 'L', logoColor: '#e60012' },
  { name: 'Interpark',        countryCode: 'KR', baseSearchUrl: 'https://shopping.interpark.com/search?q={query}',                   trustScore: 80, categories: 'electronics,fashion,general',              deliveryDays: 4,  returnDays: 14, logoInitial: 'I', logoColor: '#1a6dff' },
];

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN SEED
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  const startTime = Date.now();
  console.log('🌱 Starting GeoShop 12-country + 72-store seeding...');

  // Clean existing tables
  await prisma.savedItem.deleteMany({});
  await prisma.searchHistory.deleteMany({});
  await prisma.productCache.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.website.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.product.deleteMany({});

  // ── 1. Insert 12 countries ────────────────────────────────────────────────
  const locationsMap: Record<string, { id: string; currency: string; name: string; code: string }> = {};
  for (const c of COUNTRIES) {
    const loc = await prisma.location.create({
      data: {
        name: c.name,
        code: c.code,
        lat: c.lat,
        lon: c.lon,
        currency: c.currency,
        currencySymbol: CURRENCY_SYMBOLS[c.currency] || c.currency,
        flag: c.flag,
        atmosphereColor: c.atmosphereColor,
      },
    });
    locationsMap[c.code] = { id: loc.id, currency: c.currency, name: c.name, code: c.code };
  }
  console.log(`🌍 Seeded ${Object.keys(locationsMap).length} countries`);

  // ── 2. Insert 72 stores ───────────────────────────────────────────────────
  interface WebsiteRow { id: string; countryCode: string; name: string; baseSearchUrl: string; currency: string; categories: string; trustScore: number }
  const websitesList: WebsiteRow[] = [];
  for (const s of STORES) {
    const loc = locationsMap[s.countryCode];
    if (!loc) { console.warn(`⚠ Unknown country code ${s.countryCode} for store ${s.name}`); continue; }
    const created = await prisma.website.create({
      data: {
        name: s.name,
        locationId: loc.id,
        baseSearchUrl: s.baseSearchUrl,
        trustScore: s.trustScore,
        categories: s.categories,
        deliveryDays: s.deliveryDays,
        returnDays: s.returnDays,
        logoInitial: s.logoInitial,
        logoColor: s.logoColor,
      },
    });
    websitesList.push({
      id: created.id,
      countryCode: s.countryCode,
      name: s.name,
      baseSearchUrl: s.baseSearchUrl,
      currency: loc.currency,
      categories: s.categories,
      trustScore: s.trustScore,
    });
  }
  console.log(`🛍️  Seeded ${websitesList.length} stores`);

  // Group websites by country
  const websitesByCountry: Record<string, WebsiteRow[]> = {};
  for (const w of websitesList) {
    if (!websitesByCountry[w.countryCode]) websitesByCountry[w.countryCode] = [];
    websitesByCountry[w.countryCode].push(w);
  }
  const countryCodes = Object.keys(websitesByCountry);

  // ── 3. Generate product catalog ──────────────────────────────────────────
  console.log('📦 Generating product catalog...');
  const catalogRaw = generateCatalogProducts();
  // Select top 200 core/flagship products for optimal production database performance on Railway
  const catalogSelected = catalogRaw.slice(0, 200);
  console.log(`✅ ${catalogSelected.length} products selected for database seeding.`);

  // ── 4. Generate listings with category-fit logic ─────────────────────────
  const productRows: any[] = [];
  const listingRows: any[] = [];

  for (let idx = 0; idx < catalogSelected.length; idx++) {
    const p = catalogSelected[idx];
    const productId = crypto.randomUUID();
    const rand = pseudoRandom(idx + 101);

    productRows.push({
      id: productId,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      tags: p.tags,
      aliases: p.aliases,
      imageEmoji: p.imageEmoji,
      description: p.description,
      source: 'Catalog',
      isGenerated: false,
    });

    // Flagships, electronics, and catalog staples appear in all 12 countries so globe & compare always have complete coverage
    const isGlobalStaple = /iphone|phone|laptop|macbook|galaxy|ipad|sony|dell|thinkpad|pixel|switch|playstation|xbox|airpods|watch|tv|camera|shoe|sneaker|headphone/i.test(p.name) || idx < 300;
    const selectedCountries = isGlobalStaple
      ? countryCodes
      : [
          'US', 'IN', 'GB', 'DE', 'FR', 'JP', // Anchor markets always present
          ...countryCodes.filter(c => !['US', 'IN', 'GB', 'DE', 'FR', 'JP'].includes(c)).slice(0, 4 + Math.floor(rand() * 3)),
        ];

    for (const cCode of selectedCountries) {
      const countryWebsites = websitesByCountry[cCode] || [];

      // Filter stores by category fit
      let eligibleStores = countryWebsites.filter(w => storeMatchesProduct(w.categories, p.category));
      // If fewer than 5 eligible, supplement with other country stores so all countries offer 5+ stores
      if (eligibleStores.length < 5) {
        const otherStores = countryWebsites.filter(w => !eligibleStores.includes(w));
        eligibleStores = [...eligibleStores, ...otherStores];
      }
      // Ensure 5 to 6 stores are used
      const storeCount = Math.min(eligibleStores.length, 5 + Math.floor(rand() * 2));
      const storesToUse = eligibleStores.slice(0, Math.max(5, storeCount));

      // A few individual stores are out of stock (5%)
      for (const website of storesToUse) {
        const priceIndex = COUNTRY_PRICE_INDEX[cCode] ?? 1.0;
        const exchangeRate = CURRENCY_RATES[website.currency] ?? 1.0;

        // Store variance: marketplaces (-2% to +3%), premium retailers (+0% to +8%)
        const isMarketplace = website.trustScore >= 90;
        const storeVariance = isMarketplace
          ? 0.98 + rand() * 0.05   // -2% to +3%
          : 1.00 + rand() * 0.08;  // +0% to +8%

        const localPrice = Math.round(p.baseUsd * priceIndex * storeVariance * exchangeRate * 100) / 100;

        const rating = Math.round((4.0 + rand() * 0.95) * 10) / 10;
        const reviewCount = Math.floor(50 + rand() * 5000);
        const inStock = rand() > 0.05; // 95% in stock
        const returnDays = rand() > 0.3 ? 30 : 14;
        const priceHistory = generatePriceHistory(localPrice, idx * 1000 + cCode.charCodeAt(0));
        const directUrl = website.baseSearchUrl.replace('{query}', encodeURIComponent(p.name));

        listingRows.push({
          id: crypto.randomUUID(),
          productId,
          websiteId: website.id,
          price: localPrice,
          currency: website.currency,
          rating,
          reviewCount,
          inStock,
          returnDays,
          priceHistory,
          priceType: 'Catalog',
          sourceName: 'Catalog',
          directUrl,
        });
      }
    }
  }

  // ── 5. Bulk insert ───────────────────────────────────────────────────────
  console.log(`💾 Inserting ${productRows.length} products...`);
  for (let i = 0; i < productRows.length; i += 250) {
    await prisma.product.createMany({ data: productRows.slice(i, i + 250) });
  }

  console.log(`💾 Inserting ${listingRows.length} listings...`);
  for (let i = 0; i < listingRows.length; i += 500) {
    await prisma.listing.createMany({ data: listingRows.slice(i, i + 500) });
  }

  const durationSec = Math.round((Date.now() - startTime) / 100) / 10;
  console.log(`🎉 Seed complete! ${productRows.length} products, ${listingRows.length} listings across ${COUNTRIES.length} countries and ${STORES.length} stores in ${durationSec}s.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
