import React, { useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { ProductListing, GlobeMarker } from '../../types';
import {
  ExternalLink,
  Star,
  ShieldCheck,
  BookmarkPlus,
  BookmarkCheck,
  Info,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ShoppingWebsiteListProps {
  location: GlobeMarker | null;
  listings: ProductListing[];
  isLoading: boolean;
  onOpenQualityModal: (listing: ProductListing) => void;
  onSaveCartItem: (listing: ProductListing) => void;
  savedListingIds: string[];
  onSelectListingToBuy: (listing: ProductListing) => void;
}

// Sparkline Mini-Component
const MiniSparkline: React.FC<{ currentPrice: number }> = ({ currentPrice }) => {
  const points = useMemo(() => {
    const arr: number[] = [];
    let p = currentPrice * 1.04;
    for (let i = 0; i < 10; i++) {
      p += (Math.random() - 0.52) * (currentPrice * 0.03);
      arr.push(Math.round(p));
    }
    arr.push(currentPrice);
    return arr;
  }, [currentPrice]);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const svgPoints = points
    .map((val, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const isDown = points[points.length - 1] <= points[0];

  return (
    <div className="flex items-center gap-1.5">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isDown ? '#10b981' : '#f43f5e'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={svgPoints}
        />
      </svg>
      <span className={`text-[9px] font-bold ${isDown ? 'text-emerald-600' : 'text-rose-500'}`}>
        {isDown ? '📉 -3%' : '📈 +2%'}
      </span>
    </div>
  );
};

export const ShoppingWebsiteList: React.FC<ShoppingWebsiteListProps> = ({
  location,
  listings,
  isLoading,
  onOpenQualityModal,
  onSaveCartItem,
  savedListingIds,
  onSelectListingToBuy,
}) => {
  // Compute Winners
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

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-[#e5dec4] rounded-3xl p-8 text-center max-w-4xl mx-auto my-6 animate-pulse">
        <div className="w-8 h-8 border-2 border-[#3a4b37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <h4 className="text-[#191c19] font-semibold text-base">Scanning Regional Store Platforms...</h4>
        <p className="text-[#6b6856] text-xs mt-1">Retrieving normalized live prices, ratings, and quality scores.</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-[#e5dec4] rounded-3xl p-8 text-center max-w-4xl mx-auto my-6">
        <h4 className="text-[#191c19] font-semibold text-base">No Store Listings Found</h4>
        <p className="text-[#6b6856] text-xs mt-1">Select a location pin on the 3D globe to load regional merchant stores.</p>
      </div>
    );
  }

  const handleBuy = (listing: ProductListing) => {
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    onSelectListingToBuy(listing);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 my-8 z-20 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#191c19] flex items-center gap-2">
            <span>Available Stores in {location ? location.country : 'Selected Location'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3a4b37]/10 text-[#3a4b37] border border-[#3a4b37]/20 font-bold">
              {listings.length} Outlets
            </span>
          </h3>
          <p className="text-xs text-[#6b6856] mt-0.5">
            Compare prices, ratings, verified reviews and quality indexes before finalizing your purchase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing) => {
          const listingKey = listing.listingId || listing.id;
          const isBestPrice = listingKey === winners.bestPriceId;
          const isBestQuality = listingKey === winners.bestQualityId;
          const isBestValue = listingKey === winners.bestValueId;
          const isSaved = savedListingIds.includes(listingKey);

          const buyHint =
            listing.qualityIndex?.bestTimeToBuyHint ||
            (isBestPrice
              ? 'Historical low - buy now'
              : listing.rating >= 4.8
              ? 'Good time to buy'
              : 'Price is stable');

          return (
            <div
              key={listingKey}
              className={`bg-white backdrop-blur-xl border rounded-2xl p-5 shadow-sm transition-all duration-300 relative flex flex-col justify-between ${
                isBestPrice
                  ? 'border-emerald-400 ring-1 ring-emerald-200'
                  : isBestQuality
                  ? 'border-purple-400'
                  : 'border-[#e5dec4] hover:border-[#c4bfa8]'
              }`}
            >
              {/* Highlight Winners Badges */}
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
                <div className="flex items-center justify-between mb-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f7f4ee] border border-[#e5dec4] flex items-center justify-center text-[#3a4b37] font-extrabold text-sm shadow-inner">
                      {listing.websiteName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#191c19] flex items-center gap-1.5">
                        {listing.websiteName}
                        {listing.isLocalStore && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200 font-semibold">
                            Local Outlet
                          </span>
                        )}
                      </h4>
                      <div className="text-[11px] text-[#6b6856]">{listing.websiteDomain}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSaveCartItem(listing)}
                    className={`p-2 rounded-lg border transition-all ${
                      isSaved
                        ? 'bg-[#3a4b37]/10 border-[#3a4b37] text-[#3a4b37]'
                        : 'bg-[#f7f4ee] border-[#e5dec4] text-[#6b6856] hover:text-[#3a4b37]'
                    }`}
                    title={isSaved ? 'Remove from saved items' : 'Save to bookmarks'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#3a4b37]" /> : <BookmarkPlus className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#191c19]">
                      {listing.currencySymbol || listing.currency || '$'}
                      {listing.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">
                      (${listing.priceUsd ?? listing.price} USD)
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6b6856] font-medium">
                    Currency: {listing.currency} • Free standard delivery
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#f7f4ee] border border-[#e5dec4] mb-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#8a8474] block">Rating & Reviews</span>
                    <div className="flex items-center gap-1 font-bold text-amber-500 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{listing.rating} / 5.0</span>
                      <span className="text-[#6b6856] text-[10px] font-normal">
                        ({listing.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-[#8a8474]">Quality Index</span>
                      <button
                        onClick={() => onOpenQualityModal(listing)}
                        className="text-[#3a4b37] hover:underline text-[10px] flex items-center gap-0.5"
                      >
                        <Info className="w-3 h-3" /> Breakdown
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#3a4b37] mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5b7056]" />
                      <span>{listing.qualityScore ?? listing.qualityIndex?.score ?? 88} / 100</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">(Verified)</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline & Hint */}
                <div className="p-2.5 rounded-xl bg-[#f7f4ee] border border-[#e5dec4] mb-4 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8a8474] block mb-1">
                      30-Day Trend
                    </span>
                    <MiniSparkline currentPrice={listing.price} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#8a8474] block">Buy Timing</span>
                    <span className="text-[10px] font-extrabold text-[#3a4b37] flex items-center gap-1 justify-end mt-1">
                      <Clock className="w-3 h-3 text-[#5b7056]" />
                      {buyHint}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#6b6856] mb-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Stock: <strong className="text-[#191c19]">{listing.stockStatus || 'In Stock'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#c4bfa8]">•</span>
                    <span>{listing.returnDays || 30}-day verified return policy guarantee</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBuy(listing)}
                className="w-full py-3 rounded-xl bg-[#3a4b37] hover:bg-[#2e3d2c] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
              >
                <span>BUY / VISIT STORE ON {listing.websiteName.toUpperCase()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
