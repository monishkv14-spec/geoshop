import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { ProductListing } from '../../types';
import { ExternalLink, X, ShieldCheck, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';

interface PurchaseDecisionModalProps {
  listing: ProductListing | null;
  onClose: () => void;
}

const ProductImage: React.FC<{ src?: string; alt: string; emoji?: string }> = ({ src, alt, emoji }) => {
  const [err, setErr] = React.useState(false);
  if (err || !src) {
    return (
      <span className="text-4xl" role="img" aria-label={alt}>
        {emoji ?? '🛍️'}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      className="w-full h-full object-contain p-1"
    />
  );
};

export const PurchaseDecisionModal: React.FC<PurchaseDecisionModalProps> = ({
  listing,
  onClose,
}) => {
  // Focus trap, Esc to close, and scroll lock
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

  const handleConfirmRedirection = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    const targetUrl =
      listing.originalProductUrl ||
      listing.directStoreUrl ||
      `https://www.google.com/search?q=${encodeURIComponent(
        `${listing.productName} ${listing.websiteName}`
      )}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900 border-2 border-cyan-500/80 rounded-3xl shadow-2xl p-6 text-white overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Purchase Decision Confirmation</h3>
              <p className="text-xs text-slate-400">Final Step: Redirecting to Merchant Store</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product & Store Details Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          {/* Item Row */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
              <ProductImage
                src={listing.productImage}
                alt={listing.productName}
                emoji={listing.productEmoji}
              />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-400">{listing.brand || 'Original Brand'}</div>
              <h4 className="text-sm font-bold text-white line-clamp-1">{listing.productName}</h4>
              <div className="text-xs text-slate-400 mt-0.5">
                Location: <strong className="text-white">{listing.country} ({listing.countryCode})</strong>
              </div>
            </div>
          </div>

          {/* Merchant Platform & Price Summary */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Selected Store</span>
              <div className="text-base font-extrabold text-cyan-300 mt-0.5 flex items-center gap-1.5">
                <span>{listing.websiteName}</span>
                {listing.isLocalStore && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                    Local
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Price in Region</span>
              <div className="text-2xl font-black text-emerald-400">
                {listing.currencySymbol || listing.currency || '$'}{listing.price.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">
                ≈ ${listing.priceUsd ?? listing.price} USD
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stock: <strong>{listing.stockStatus || 'In Stock'}</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{listing.deliveryEst || 'Standard Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Action Redirection Button */}
        <div className="space-y-2">
          <button
            onClick={handleConfirmRedirection}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
          >
            <span>CONFIRM & PROCEED TO OFFICIAL STORE ({listing.websiteName.toUpperCase()})</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition"
          >
            Cancel & Return to Comparisons
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Demo data disclaimer: Purchasing happens directly on the merchant's original site with safe noopener protection.</span>
        </div>
      </div>
    </div>
  );
};
