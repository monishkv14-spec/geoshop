import * as THREE from 'three';
import type { GlobeMarker } from '../types';

/**
 * Converts Latitude and Longitude to 3D Cartesian Coordinates (Vector3)
 * Exactly calibrated to standard equirectangular sphere UV coordinates.
 * North Pole: Lat +90, South Pole: Lat -90
 * Prime Meridian: Lon 0 (center of equirectangular map)
 * India: ~20.59° N, 78.96° E
 * USA: ~37.09° N, -95.71° W
 * Japan: ~36.20° N, 138.25° E
 */
export function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Returns country flag emoji based on ISO code or country name
 */
export function getCountryFlag(codeOrName: string): string {
  const upper = (codeOrName || '').toUpperCase();
  const flagMap: Record<string, string> = {
    // ISO-2
    IN: '🇮🇳',
    US: '🇺🇸',
    GB: '🇬🇧',
    DE: '🇩🇪',
    FR: '🇫🇷',
    JP: '🇯🇵',
    AU: '🇦🇺',
    AE: '🇦🇪',
    BR: '🇧🇷',
    CA: '🇨🇦',
    SG: '🇸🇬',
    KR: '🇰🇷',
    // ISO-3
    IND: '🇮🇳',
    USA: '🇺🇸',
    GBR: '🇬🇧',
    DEU: '🇩🇪',
    FRA: '🇫🇷',
    JPN: '🇯🇵',
    AUS: '🇦🇺',
    ARE: '🇦🇪',
    BRA: '🇧🇷',
    CAN: '🇨🇦',
    SGP: '🇸🇬',
    KOR: '🇰🇷',
    // Country names
    INDIA: '🇮🇳',
    'UNITED STATES': '🇺🇸',
    'UNITED KINGDOM': '🇬🇧',
    GERMANY: '🇩🇪',
    FRANCE: '🇫🇷',
    JAPAN: '🇯🇵',
    AUSTRALIA: '🇦🇺',
    'UNITED ARAB EMIRATES': '🇦🇪',
    UAE: '🇦🇪',
    UK: '🇬🇧',
    BRAZIL: '🇧🇷',
    CANADA: '🇨🇦',
    SINGAPORE: '🇸🇬',
    'SOUTH KOREA': '🇰🇷',
  };
  return flagMap[upper] || '🌐';
}

/**
 * Parses Hex color string to THREE.Color
 */
export function hexToThreeColor(hex?: string): THREE.Color {
  try {
    if (!hex) return new THREE.Color('#00d2ff');
    return new THREE.Color(hex);
  } catch {
    return new THREE.Color('#00d2ff');
  }
}

/**
 * Checks if WebGL is supported in the current browser environment
 */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Computes a 3D Quadratic Bezier Arc between two points on the sphere.
 * Lifts the apex outward radially proportional to the surface distance.
 */
export function createArcCurve(
  startPos: THREE.Vector3,
  endPos: THREE.Vector3,
  radius: number
): { curve: THREE.QuadraticBezierCurve3; apex: THREE.Vector3 } {
  const dist = startPos.distanceTo(endPos);
  const mid = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);

  // Height scaling: farther points arch higher above the globe
  const altitudeFactor = 1.12 + Math.min(0.48, dist / (radius * 1.8));
  const apex = mid.clone().normalize().multiplyScalar(radius * altitudeFactor);

  const curve = new THREE.QuadraticBezierCurve3(startPos, apex, endPos);
  return { curve, apex };
}

/**
 * High-fidelity default mock markers for independent testing & immediate display
 * Covers all 8 countries across 5 continents with realistic multi-store data.
 */
export const DEFAULT_MOCK_MARKERS: GlobeMarker[] = [
  {
    locationId: 'loc-ind',
    country: 'India',
    code: 'IN',
    flag: '🇮🇳',
    lat: 20.5937,
    lon: 78.9629,
    currency: 'INR',
    currencySymbol: '₹',
    atmosphereColor: '#ff9933',
    backgroundMood: 'saffron',
    storeCount: 7,
    lowestPrice: 134900,
    lowestUsdPrice: 1615,
    priceTier: 'mid',
    pulseColor: '#f59e0b',
    relativeDifferencePercent: 12,
    websites: ['Amazon India', 'Flipkart', 'Meesho', 'Croma', 'Reliance Digital', 'Tata CLiQ', 'Vijay Sales'],
    stores: ['Amazon India', 'Flipkart', 'Meesho', 'Croma', 'Reliance Digital', 'Tata CLiQ', 'Vijay Sales'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-usa',
    country: 'United States',
    code: 'US',
    flag: '🇺🇸',
    lat: 37.0902,
    lon: -95.7129,
    currency: 'USD',
    currencySymbol: '$',
    atmosphereColor: '#00d2ff',
    backgroundMood: 'cyan',
    storeCount: 6,
    lowestPrice: 1199,
    lowestUsdPrice: 1199,
    priceTier: 'cheapest',
    pulseColor: '#10b981',
    relativeDifferencePercent: 0,
    websites: ['Amazon US', 'Best Buy', 'Walmart', 'Target', 'B&H Photo', 'Newegg'],
    stores: ['Amazon US', 'Best Buy', 'Walmart', 'Target', 'B&H Photo', 'Newegg'],
    inStock: true,
    availabilityStatus: 'Highly Available',
  },
  {
    locationId: 'loc-gbr',
    country: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    lat: 55.3781,
    lon: -3.436,
    currency: 'GBP',
    currencySymbol: '£',
    atmosphereColor: '#6366f1',
    backgroundMood: 'indigo',
    storeCount: 6,
    lowestPrice: 1049,
    lowestUsdPrice: 1327,
    priceTier: 'mid',
    pulseColor: '#f59e0b',
    relativeDifferencePercent: 10.7,
    websites: ['Amazon UK', 'Currys', 'Argos', 'John Lewis', 'AO.com', 'Very'],
    stores: ['Amazon UK', 'Currys', 'Argos', 'John Lewis', 'AO.com', 'Very'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-deu',
    country: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    lat: 51.1657,
    lon: 10.4515,
    currency: 'EUR',
    currencySymbol: '€',
    atmosphereColor: '#22c55e',
    backgroundMood: 'emerald',
    storeCount: 6,
    lowestPrice: 1299,
    lowestUsdPrice: 1412,
    priceTier: 'mid',
    pulseColor: '#f59e0b',
    relativeDifferencePercent: 17.8,
    websites: ['Amazon.de', 'MediaMarkt', 'Saturn', 'Otto', 'Cyberport', 'Notebooksbilliger'],
    stores: ['Amazon.de', 'MediaMarkt', 'Saturn', 'Otto', 'Cyberport', 'Notebooksbilliger'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-fra',
    country: 'France',
    code: 'FR',
    flag: '🇫🇷',
    lat: 46.6034,
    lon: 1.8883,
    currency: 'EUR',
    currencySymbol: '€',
    atmosphereColor: '#a855f7',
    backgroundMood: 'purple',
    storeCount: 6,
    lowestPrice: 1329,
    lowestUsdPrice: 1444,
    priceTier: 'expensive',
    pulseColor: '#ef4444',
    relativeDifferencePercent: 20.4,
    websites: ['Amazon.fr', 'Fnac', 'Darty', 'Boulanger', 'Cdiscount', 'LDLC'],
    stores: ['Amazon.fr', 'Fnac', 'Darty', 'Boulanger', 'Cdiscount', 'LDLC'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-jpn',
    country: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    lat: 36.2048,
    lon: 138.2529,
    currency: 'JPY',
    currencySymbol: '¥',
    atmosphereColor: '#ff4d4d',
    backgroundMood: 'crimson',
    storeCount: 6,
    lowestPrice: 189800,
    lowestUsdPrice: 1224,
    priceTier: 'cheapest',
    pulseColor: '#10b981',
    relativeDifferencePercent: 2.1,
    websites: ['Amazon Japan', 'Rakuten Ichiba', 'Yodobashi Camera', 'Bic Camera', 'Yahoo! Shopping', 'Edion'],
    stores: ['Amazon Japan', 'Rakuten Ichiba', 'Yodobashi Camera', 'Bic Camera', 'Yahoo! Shopping', 'Edion'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-aus',
    country: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    lat: -25.2744,
    lon: 133.7751,
    currency: 'AUD',
    currencySymbol: 'A$',
    atmosphereColor: '#eab308',
    backgroundMood: 'amber',
    storeCount: 6,
    lowestPrice: 2049,
    lowestUsdPrice: 1348,
    priceTier: 'mid',
    pulseColor: '#f59e0b',
    relativeDifferencePercent: 12.4,
    websites: ['Amazon AU', 'JB Hi-Fi', 'Harvey Norman', 'The Good Guys', 'Officeworks', 'eBay Australia'],
    stores: ['Amazon AU', 'JB Hi-Fi', 'Harvey Norman', 'The Good Guys', 'Officeworks', 'eBay Australia'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-are',
    country: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    lat: 23.4241,
    lon: 53.8478,
    currency: 'AED',
    currencySymbol: 'د.إ',
    atmosphereColor: '#f97316',
    backgroundMood: 'orange',
    storeCount: 6,
    lowestPrice: 4699,
    lowestUsdPrice: 1280,
    priceTier: 'mid',
    pulseColor: '#f59e0b',
    relativeDifferencePercent: 6.7,
    websites: ['Amazon.ae', 'Noon', 'Sharaf DG', 'Jumbo Electronics', 'Emax', 'Lulu Hypermarket'],
    stores: ['Amazon.ae', 'Noon', 'Sharaf DG', 'Jumbo Electronics', 'Emax', 'Lulu Hypermarket'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-bra',
    country: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    lat: -14.235,
    lon: -51.9253,
    currency: 'BRL',
    currencySymbol: 'R$',
    atmosphereColor: '#10b981',
    backgroundMood: 'teal',
    storeCount: 6,
    lowestPrice: 8999,
    lowestUsdPrice: 1748,
    priceTier: 'expensive',
    pulseColor: '#ef4444',
    relativeDifferencePercent: 45.8,
    websites: ['Amazon Brasil', 'Mercado Livre', 'Magazine Luiza', 'Casas Bahia', 'Americanas', 'Fast Shop'],
    stores: ['Amazon Brasil', 'Mercado Livre', 'Magazine Luiza', 'Casas Bahia', 'Americanas', 'Fast Shop'],
    inStock: true,
    availabilityStatus: 'Limited',
  },
  {
    locationId: 'loc-can',
    country: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    lat: 56.1304,
    lon: -106.3468,
    currency: 'CAD',
    currencySymbol: 'C$',
    atmosphereColor: '#ef4444',
    backgroundMood: 'red',
    storeCount: 6,
    lowestPrice: 1649,
    lowestUsdPrice: 1212,
    priceTier: 'cheapest',
    pulseColor: '#10b981',
    relativeDifferencePercent: 1.1,
    websites: ['Amazon.ca', 'Best Buy Canada', 'Walmart Canada', 'Canadian Tire', 'Staples Canada', 'Memory Express'],
    stores: ['Amazon.ca', 'Best Buy Canada', 'Walmart Canada', 'Canadian Tire', 'Staples Canada', 'Memory Express'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-sgp',
    country: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    lat: 1.3521,
    lon: 103.8198,
    currency: 'SGD',
    currencySymbol: 'S$',
    atmosphereColor: '#ec4899',
    backgroundMood: 'pink',
    storeCount: 6,
    lowestPrice: 1649,
    lowestUsdPrice: 1230,
    priceTier: 'cheapest',
    pulseColor: '#10b981',
    relativeDifferencePercent: 2.6,
    websites: ['Shopee SG', 'Lazada SG', 'Amazon.sg', 'Challenger', 'Courts', 'Gain City'],
    stores: ['Shopee SG', 'Lazada SG', 'Amazon.sg', 'Challenger', 'Courts', 'Gain City'],
    inStock: true,
    availabilityStatus: 'Available',
  },
  {
    locationId: 'loc-kor',
    country: 'South Korea',
    code: 'KR',
    flag: '🇰🇷',
    lat: 35.9078,
    lon: 127.7669,
    currency: 'KRW',
    currencySymbol: '₩',
    atmosphereColor: '#3b82f6',
    backgroundMood: 'blue',
    storeCount: 6,
    lowestPrice: 1590000,
    lowestUsdPrice: 1195,
    priceTier: 'cheapest',
    pulseColor: '#10b981',
    relativeDifferencePercent: 0,
    websites: ['Coupang', 'Gmarket', '11st', 'SSG.com', 'Lotte ON', 'Interpark'],
    stores: ['Coupang', 'Gmarket', '11st', 'SSG.com', 'Lotte ON', 'Interpark'],
    inStock: true,
    availabilityStatus: 'Available',
  },
];

/**
 * Generates an ultra-high-definition procedural 2D canvas texture for the Earth sphere
 * used as an instant, zero-latency fallback while local image textures are initializing.
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const W = canvas.width;
  const H = canvas.height;

  // Deep Blue Ocean
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, H);
  oceanGradient.addColorStop(0, '#040d1a');
  oceanGradient.addColorStop(0.2, '#091b36');
  oceanGradient.addColorStop(0.5, '#0b2447');
  oceanGradient.addColorStop(0.8, '#091b36');
  oceanGradient.addColorStop(1, '#040d1a');
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, W, H);

  // Digital coordinate grid
  ctx.strokeStyle = 'rgba(0, 210, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Major Continents Outlines
  const landmasses: Array<{ points: Array<[number, number]>; type?: 'land' | 'ice' }> = [
    { type: 'ice', points: [[-180, 78], [180, 78], [180, 90], [-180, 90]] },
    { type: 'ice', points: [[-180, -90], [180, -90], [180, -64], [-180, -64]] },
    {
      type: 'land',
      points: [
        [-168, 65], [-150, 60], [-130, 54], [-124, 48], [-124, 38], [-117, 32.5],
        [-105, 20], [-90, 16], [-88, 13], [-83, 8], [-77, 8], [-80, 25],
        [-70, 41], [-56, 52], [-76, 62], [-100, 70], [-140, 70], [-168, 65]
      ]
    },
    {
      type: 'land',
      points: [
        [-77, 8], [-73, 11], [-60, 10], [-50, 0], [-35, -5], [-35, -10],
        [-38, -20], [-48, -28], [-57, -38], [-66, -55], [-75, -50], [-76, -15], [-77, 8]
      ]
    },
    {
      type: 'land',
      points: [
        [-10, 36], [-2, 43], [3, 47], [8, 54], [25, 71], [40, 65], [60, 55],
        [50, 45], [30, 46], [15, 38], [0, 38], [-10, 36]
      ]
    },
    {
      type: 'land',
      points: [
        [-17, 32], [11, 37], [33, 31], [43, 12], [51, 11], [41, -5],
        [33, -34], [18, -34], [12, -5], [-15, 12], [-17, 32]
      ]
    },
    {
      type: 'land',
      points: [
        [68, 24], [72, 21], [73, 15], [76, 9.5], [77.5, 8], [80, 13], [85, 20],
        [92, 21], [90, 26], [80, 30], [74, 32], [68, 24]
      ]
    },
    {
      type: 'land',
      points: [
        [60, 55], [100, 55], [140, 55], [180, 65], [145, 45], [120, 32],
        [100, 10], [92, 21], [80, 30], [60, 55]
      ]
    },
    {
      type: 'land',
      points: [
        [113, -22], [130, -12], [146, -17], [153, -28], [150, -37],
        [130, -32], [113, -22]
      ]
    }
  ];

  landmasses.forEach(item => {
    const isIce = item.type === 'ice';
    ctx.fillStyle = isIce ? '#e2f1ff' : '#143866';
    ctx.strokeStyle = isIce ? '#ffffff' : '#00d2ff';
    ctx.lineWidth = isIce ? 1.5 : 3;

    ctx.beginPath();
    item.points.forEach(([px, py], idx) => {
      const x = (px / 360 + 0.5) * W;
      const y = (-py / 180 + 0.5) * H;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
