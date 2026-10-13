import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductListing } from '../../types';
import { ShoppingCart, X, Trash2, ExternalLink, BookmarkCheck } from 'lucide-react';
import { getCountryFlag } from '../../utils/globeUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings: ProductListing[];
  onRemoveItem: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  savedListings,
  onRemoveItem,
}) => {
  // Focus trap, Esc to close, and scroll lock
  useEffect(() => {
    if (!isOpen) return;

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

  const handleVisit = (listing: ProductListing) => {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    const targetUrl =
      listing.originalProductUrl ||
      listing.directStoreUrl ||
      `https://www.google.com/search?q=${encodeURIComponent(
        `${listing.productName} ${listing.websiteName}`
      )}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col text-white shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span>Saved Store Listings</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {savedListings.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Database-persisted bookmarks for quick redirection
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                aria-label="Close saved drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Listings List */}
            <div className="my-4 overflow-y-auto flex-1 space-y-3">
              {savedListings.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                    <BookmarkCheck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-300">No saved listings yet</div>
                  <p className="max-w-xs mx-auto text-slate-500">
                    Click the bookmark icon on any store card or comparison matrix to save items here.
                  </p>
                </div>
              ) : (
                savedListings.map((listing) => {
                  const id = listing.listingId || listing.id;
                  const countryFlag = listing.countryCode ? getCountryFlag(listing.countryCode) : '🌐';

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      key={id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">
                            {listing.productName}
                          </h4>
                          <div className="text-xs text-cyan-400 font-medium flex items-center gap-1.5 mt-0.5">
                            <span>{countryFlag}</span>
                            <span>{listing.websiteName}</span>
                            <span>({listing.country || listing.countryCode})</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <div>
                          <span className="text-base font-extrabold text-white">
                            {listing.currencySymbol || listing.currency || '$'}
                            {listing.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ≈ ${listing.priceUsd ?? listing.price} USD
                          </span>
                        </div>

                        <button
                          onClick={() => handleVisit(listing)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition"
                        >
                          <span>VISIT & BUY</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              GeoShop Saved Drawer • Instant Redirection with safe rel protection
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
