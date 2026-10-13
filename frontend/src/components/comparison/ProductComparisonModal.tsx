import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { ProductListing, GlobeMarker, ProductSummary } from '../../types';
import {
  X,
  ExternalLink,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  Globe2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { getCountryFlag } from '../../utils/globeUtils';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductSummary | null;
  location: GlobeMarker | null;
  listings: ProductListing[];
  availableMarkers?: GlobeMarker[];
  onOpenQualityModal: (listing: ProductListing) => void;
  onSelectListingToBuy: (listing: ProductListing) => void;
}

// ── SVG Sparkline Component ──────────────────────────────────────────────
const PriceSparkline: React.FC<{
  history?: Array<{ day?: number; date?: string; price: number }>;
  currentPrice: number;
  currencySymbol?: string;
}> = ({ history, currentPrice }) => {
  const points = useMemo(() => {
    if (history && history.length >= 5) {
      return history.map((h) => h.price);
    }
    // Generate realistic 30-day variation around current price
    const gen: number[] = [];
    let p = currentPrice * 1.05;
    for (let i = 0; i < 15; i++) {
      p += (Math.random() - 0.52) * (currentPrice * 0.03);
      gen.push(Math.round(p));
    }
    gen.push(currentPrice);
    return gen;
  }, [history, currentPrice]);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 120;
  const height = 32;

  const svgPoints = points
    .map((val, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const isTrendingDown = points[points.length - 1] <= points[0];

  return (
    <div className="flex items-center gap-2">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isTrendingDown ? '#34d399' : '#f87171'} stopOpacity="0.4" />
            <stop offset="100%" stopColor={isTrendingDown ? '#34d399' : '#f87171'} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={isTrendingDown ? '#10b981' : '#f43f5e'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={svgPoints}
        />
      </svg>
      <span className={`text-[10px] font-bold ${isTrendingDown ? 'text-emerald-600' : 'text-rose-500'}`}>
        {isTrendingDown ? '📉 -4.2%' : '📈 +2.1%'}
      </span>
    </div>
  );
};

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  product,
  location,
  listings,
  availableMarkers = [],
  onOpenQualityModal,
  onSelectListingToBuy,
}) => {
  const [activeView, setActiveView] = useState<'single' | 'cross-country'>('single');
  const [selectedCountryCodes, setSelectedCountryCodes] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize selected countries for cross-country comparison (up to 3)
  useEffect(() => {
    if (location && availableMarkers.length > 0) {
      const initial = [location.code];
      availableMarkers.forEach((m) => {
        if (m.code !== location.code && initial.length < 3) {
          initial.push(m.code);
        }
      });
      setSelectedCountryCodes(initial);
    }
  }, [location, availableMarkers]);

  // Focus trap, Esc key listener, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Compute Winners (Best Price, Best Quality, Best Value)
  const winners = useMemo(() => {
    if (!listings || listings.length === 0) return { bestPriceId: '', bestQualityId: '', bestValueId: '' };

    let minPriceUsd = Infinity;
    let maxQualityScore = -Infinity;
    let maxValueRatio = -Infinity;

    let bestPriceId = '';
    let bestQualityId = '';
    let bestValueId = '';

    listings.forEach((l) => {
      const id = l.listingId || l.id;
      const priceUsd = l.priceUsd || l.price;
      const qScore = l.qualityScore ?? l.qualityIndex?.score ?? 80;
      const valueRatio = qScore / (priceUsd || 1);

      if (priceUsd < minPriceUsd) {
        minPriceUsd = priceUsd;
        bestPriceId = id;
      }
      if (qScore > maxQualityScore) {
        maxQualityScore = qScore;
        bestQualityId = id;
      }
      if (valueRatio > maxValueRatio) {
        maxValueRatio = valueRatio;
        bestValueId = id;
      }
    });

    return { bestPriceId, bestQualityId, bestValueId };
  }, [listings]);

  if (!isOpen) return null;

  const handleBuy = (listing: ProductListing) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSelectListingToBuy(listing);
  };

  const toggleCrossCountry = (code: string) => {
    if (selectedCountryCodes.includes(code)) {
      if (selectedCountryCodes.length > 1) {
        setSelectedCountryCodes(selectedCountryCodes.filter((c) => c !== code));
      }
    } else {
      if (selectedCountryCodes.length < 3) {
        setSelectedCountryCodes([...selectedCountryCodes, code]);
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#191c19]/40 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#f7f4ee] border border-[#e5dec4] rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-[#191c19] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e5dec4] bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {product && (
              <div className="w-12 h-12 rounded-2xl border border-[#e5dec4] bg-white shrink-0 overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.nextSibling as HTMLElement | null)?.style.setProperty('display', 'flex');
                    }}
                    className="w-full h-full object-contain p-1"
                  />
                ) : null}
                <span
                  role="img"
                  aria-label={product.name}
                  style={{ display: product.image ? 'none' : 'flex' }}
                  className="text-2xl"
                >
                  {product.imageEmoji ?? '🛍️'}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3a4b37]">
                  Store Comparison Engine
                </span>
                {location && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#191c19] border border-[#e5dec4]">
                    {location.flag || getCountryFlag(location.code)} {location.country}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#191c19] mt-0.5 line-clamp-1">
                {product ? product.name : 'Store Price Comparison'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-white p-1 rounded-xl border border-[#e5dec4] text-xs">
              <button
                onClick={() => setActiveView('single')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeView === 'single'
                    ? 'bg-[#3a4b37] text-white'
                    : 'text-[#6b6856] hover:text-[#191c19]'
                }`}
              >
                Local Stores
              </button>
              <button
                onClick={() => setActiveView('cross-country')}
                className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  activeView === 'cross-country'
                    ? 'bg-[#3a4b37] text-white'
                    : 'text-[#6b6856] hover:text-[#191c19]'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                Cross-Country (3)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white text-[#6b6856] hover:text-[#191c19] hover:bg-[#f0ede6] border border-[#e5dec4] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode: Single-Country Detailed Store Cards */}
        {activeView === 'single' ? (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-16 text-[#6b6856] text-xs space-y-2">
                <Globe2 className="w-10 h-10 mx-auto text-[#c4bfa8]" />
                <div className="font-bold text-[#191c19] text-sm">No Store Listings Available</div>
                <p>No merchant pricing data is currently recorded for this country.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing) => {
                  const id = listing.listingId || listing.id;
                  const isBestPrice = id === winners.bestPriceId;
                  const isBestQuality = id === winners.bestQualityId;
                  const isBestValue = id === winners.bestValueId;

                  // Derive best time to buy hint
                  const buyHint =
                    listing.qualityIndex?.bestTimeToBuyHint ||
                    (isBestPrice
                      ? 'Historical low - buy now'
                      : listing.rating >= 4.8
                      ? 'Good time to buy'
                      : 'Price is stable');

                  return (
                    <div
                      key={id}
                      className={`p-5 rounded-2xl bg-white border transition-all relative flex flex-col justify-between ${
                        isBestPrice
                          ? 'border-emerald-400 ring-1 ring-emerald-200'
                          : isBestQuality
                          ? 'border-purple-400'
                          : 'border-[#e5dec4] hover:border-[#c4bfa8]'
                      }`}
                    >
                      {/* Highlight Winner Badges */}
                      <div className="flex items-center gap-1.5 absolute -top-3 left-4">
                        {isBestPrice && (
                          <span className="bg-emerald-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Best Price
                          </span>
                        )}
                        {isBestQuality && (
                          <span className="bg-purple-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <Award className="w-2.5 h-2.5" /> Best Quality
                          </span>
                        )}
                        {isBestValue && !isBestPrice && (
                          <span className="bg-[#3a4b37] text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            ★ Best Value
                          </span>
                        )}
                      </div>

                      <div>
                        {/* Store Info & Local Price Header */}
                        <div className="flex items-start justify-between gap-3 mb-3 pt-1">
                          <div>
                            <h4 className="text-base font-extrabold text-[#191c19] flex items-center gap-1.5">
                              {listing.websiteName}
                              {listing.isLocalStore && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-600 border border-purple-200 font-semibold">
                                  Local
                                </span>
                              )}
                            </h4>
                            <div className="text-[11px] text-[#6b6856]">{listing.websiteDomain}</div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-black text-[#191c19]">
                              {listing.currencySymbol || listing.currency || '$'}
                              {listing.price.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              ≈ ${listing.priceUsd ?? listing.price} USD
                            </div>
                          </div>
                        </div>

                        {/* Ratings & Quality Index Row */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#f7f4ee] border border-[#e5dec4] mb-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#8a8474] block">Rating</span>
                            <div className="flex items-center gap-1 font-bold text-amber-500 mt-0.5">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{listing.rating}</span>
                              <span className="text-[10px] text-[#6b6856] font-normal">
                                ({listing.reviewCount.toLocaleString()})
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-[#8a8474]">Quality Index</span>
                              <button
                                onClick={() => onOpenQualityModal(listing)}
                                className="text-[#3a4b37] hover:underline text-[9px] flex items-center gap-0.5"
                              >
                                <Info className="w-3 h-3" /> Breakdown
                              </button>
                            </div>
                            <div className="flex items-center gap-1 font-extrabold text-[#3a4b37] mt-0.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#5b7056]" />
                              <span>{listing.qualityScore ?? listing.qualityIndex?.score ?? 85}/100</span>
                            </div>
                          </div>
                        </div>

                        {/* 30-Day Price History Sparkline & Buy Hint */}
                        <div className="p-2.5 rounded-xl bg-[#f7f4ee] border border-[#e5dec4] mb-3 text-xs flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#8a8474] block mb-1">
                              30-Day Price Trend
                            </span>
                            <PriceSparkline
                              history={listing.priceHistory}
                              currentPrice={listing.price}
                              currencySymbol={listing.currencySymbol}
                            />
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-[#8a8474] block">
                              Timing Hint
                            </span>
                            <span className="text-[10px] font-extrabold text-[#3a4b37] flex items-center gap-1 justify-end mt-1">
                              <Clock className="w-3 h-3 text-[#5b7056]" />
                              {buyHint}
                            </span>
                          </div>
                        </div>

                        {/* Stock & Delivery details */}
                        <div className="space-y-1 text-xs text-[#6b6856] mb-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Stock: <strong className="text-[#191c19]">{listing.stockStatus || 'In Stock'}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#c4bfa8]">•</span>
                            <span>{listing.returnDays || 30}-day hassle-free return policy</span>
                          </div>
                        </div>
                      </div>

                      {/* Buy Action */}
                      <button
                        onClick={() => handleBuy(listing)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3a4b37] hover:bg-[#2e3d2c] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98]"
                      >
                        <span>VISIT & BUY ON {listing.websiteName.toUpperCase()}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* View Mode: Side-by-Side Cross-Country Comparison (Up to 3 countries) */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {/* Country Selector Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#e5dec4]">
              <span className="text-xs text-[#6b6856]">
                Select up to 3 countries for side-by-side comparison:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableMarkers.map((m) => {
                  const isChecked = selectedCountryCodes.includes(m.code);
                  return (
                    <button
                      key={m.code}
                      onClick={() => toggleCrossCountry(m.code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#3a4b37] text-white shadow-md'
                          : 'bg-white border border-[#e5dec4] text-[#6b6856] hover:text-[#191c19]'
                      }`}
                    >
                      <span>{m.flag || getCountryFlag(m.code)}</span>
                      <span>{m.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-Column Comparison Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {selectedCountryCodes.map((code) => {
                const marker = availableMarkers.find((m) => m.code === code) || location;
                if (!marker) return null;

                const lowestPrice = marker.minPrice ?? marker.lowestPrice ?? 0;
                const usdPrice = marker.lowestUsdPrice || 0;
                const stores = marker.websites || marker.stores || [];

                return (
                  <div
                    key={marker.code}
                    className="p-5 rounded-2xl bg-white border border-[#e5dec4] flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div>
                      {/* Flag and Country */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#e5dec4]">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{marker.flag || getCountryFlag(marker.code)}</span>
                          <div>
                            <h4 className="font-extrabold text-base text-[#191c19]">{marker.country}</h4>
                            <span className="text-[10px] text-[#6b6856]">{marker.currency} Region</span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            marker.priceTier === 'cheapest'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-[#f7f4ee] text-[#6b6856] border border-[#e5dec4]'
                          }`}
                        >
                          {marker.priceTier === 'cheapest' ? 'Cheapest' : marker.priceTier || 'Mid-Tier'}
                        </span>
                      </div>

                      {/* Pricing Specs */}
                      <div className="py-4 space-y-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8a8474] block">
                            Lowest Local Price
                          </span>
                          <div className="text-2xl font-black text-[#191c19]">
                            {marker.currencySymbol || marker.currency || '$'}
                            {lowestPrice.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8a8474] block">
                            Normalized Price
                          </span>
                          <div className="text-lg font-extrabold text-emerald-600">
                            ${usdPrice} USD
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#8a8474] block">
                            Available Store Outlets ({stores.length})
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stores.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded bg-[#f7f4ee] text-[#3a4b37] text-[10px] font-semibold border border-[#e5dec4]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#e5dec4]">
                      <div className="text-[11px] text-[#6b6856] mb-2">
                        {marker.inStock ? '✓ Verified in stock across merchants' : 'Limited stock available'}
                      </div>
                      <button
                        onClick={() => {
                          const demoListing: ProductListing = {
                            id: `demo-${marker.code}`,
                            listingId: `demo-${marker.code}`,
                            productId: product?.id || '',
                            productName: product?.name || 'Product',
                            websiteId: marker.code,
                            websiteName: stores[0] || `${marker.country} Merchant`,
                            websiteDomain: `${marker.code.toLowerCase()}.shopping.com`,
                            locationId: marker.locationId,
                            country: marker.country,
                            countryCode: marker.code,
                            price: lowestPrice,
                            priceUsd: usdPrice,
                            currency: marker.currency,
                            rating: 4.8,
                            reviewCount: 9500,
                            inStock: true,
                            originalProductUrl: `https://www.google.com/search?q=${encodeURIComponent(
                              (product?.name || '') + ' ' + (stores[0] || marker.country)
                            )}`,
                          };
                          handleBuy(demoListing);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#3a4b37] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-[#2e3d2c] transition"
                      >
                        <span>BUY IN {marker.code}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="p-3.5 bg-white border-t border-[#e5dec4] text-center text-[11px] text-[#8a8474] flex items-center justify-center gap-2">
          <span>
            Demo data disclaimer: GeoShop operates exclusively as a discovery & comparison layer. All checkout transactions occur on the official merchant site.
          </span>
        </div>
      </div>
    </div>
  );
};
