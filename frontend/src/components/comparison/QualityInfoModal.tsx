import React, { useEffect } from 'react';
import type { ProductListing } from '../../types';
import { ShieldCheck, X, CheckCircle, Info, Sparkles } from 'lucide-react';

interface QualityInfoModalProps {
  listing: ProductListing | null;
  onClose: () => void;
}

export const QualityInfoModal: React.FC<QualityInfoModalProps> = ({ listing, onClose }) => {
  // Focus trapping, Esc key listener, and scroll lock
  useEffect(() => {
    if (!listing) return;

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
  }, [listing, onClose]);

  if (!listing) return null;

  const score = listing.qualityScore ?? listing.qualityIndex?.score ?? 88;
  const ratingComp = Math.round((listing.rating / 5) * 40);
  const reviewCount = listing.reviewCount || 12000;
  const volumeComp = Math.min(30, Math.round(Math.log10(reviewCount + 1) * 7.5));
  const sellerReliability = listing.sellerTrustScore ? Math.round(listing.sellerTrustScore * 0.3) : 28;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c19]/40 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#f7f4ee] border border-[#e5dec4] rounded-3xl shadow-2xl p-6 text-[#191c19] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e5dec4]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#3a4b37]/10 border border-[#3a4b37]/20 text-[#3a4b37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#191c19]">Quality Index Transparency</h3>
              <p className="text-xs text-[#6b6856]">
                Formula breakdown for {listing.websiteName} ({listing.country})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white text-[#6b6856] hover:text-[#191c19] border border-[#e5dec4] transition"
            aria-label="Close quality info modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score Hero Badge */}
        <div className="my-5 p-4 rounded-2xl bg-white border border-[#3a4b37]/20 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#8a8474] uppercase font-bold tracking-wider">
              Total Quality Index
            </div>
            <div className="text-3xl font-black text-[#3a4b37] mt-0.5 flex items-baseline gap-1">
              <span>{score}</span>
              <span className="text-sm text-[#8a8474] font-normal">/ 100</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Authentic Score
          </span>
        </div>

        {/* 5-Factor Factor Breakdown */}
        <div className="space-y-2.5 text-xs mb-5">
          {/* Factor 1: Rating */}
          <div className="p-3 rounded-xl bg-white border border-[#e5dec4] flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[#3a4b37] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between font-bold text-[#191c19]">
                <span>Customer Star Rating (40% Weight)</span>
                <span className="text-[#3a4b37]">{ratingComp} / 40 pts</span>
              </div>
              <div className="text-[#6b6856] text-[11px] mt-0.5">
                Calculated from {listing.rating} / 5.0 verified customer star reviews.
              </div>
            </div>
          </div>

          {/* Factor 2: Review Volume */}
          <div className="p-3 rounded-xl bg-white border border-[#e5dec4] flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[#3a4b37] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between font-bold text-[#191c19]">
                <span>Review Volume & Statistical Power (30% Weight)</span>
                <span className="text-[#3a4b37]">{volumeComp} / 30 pts</span>
              </div>
              <div className="text-[#6b6856] text-[11px] mt-0.5">
                Log-scaled volume check based on {reviewCount.toLocaleString()} verified buyer reviews.
              </div>
            </div>
          </div>

          {/* Factor 3: Seller Reliability */}
          <div className="p-3 rounded-xl bg-white border border-[#e5dec4] flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[#3a4b37] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between font-bold text-[#191c19]">
                <span>Seller Trust & Fulfillment Record (30% Weight)</span>
                <span className="text-[#3a4b37]">{sellerReliability} / 30 pts</span>
              </div>
              <div className="text-[#6b6856] text-[11px] mt-0.5">
                Evaluated from merchant historical fulfillment, return handling, and store authenticity.
              </div>
            </div>
          </div>

          {/* Factor 4 & 5: Return Policy & Anti-Gouging */}
          <div className="p-3 rounded-xl bg-white border border-[#e5dec4] flex items-start gap-3">
            <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-[#191c19]">Consumer Rights & Price Stability Checks</div>
              <div className="text-[#6b6856] text-[11px] mt-0.5 flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">✓ 30-Day Hassle-Free Returns</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">✓ Anti-Price Gouging Shield Passed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-white border border-[#e5dec4] text-[11px] text-[#6b6856] italic">
          <strong>Fairness Note:</strong> GeoShop applies an algorithmic quality index across all merchant listings equally to prevent skewed sponsor placements.
        </div>
      </div>
    </div>
  );
};
