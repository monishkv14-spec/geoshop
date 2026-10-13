import React from 'react';
import type { GlobeMarker } from '../../types';
import { ShoppingBag, ArrowRight, Sparkles, MapPin, Tag } from 'lucide-react';
import { getCountryFlag } from '../../utils/globeUtils';

interface LocationAtmosphereBarProps {
  selectedLocation: GlobeMarker | null;
  onOpenStoreComparison: () => void;
}

export const LocationAtmosphereBar: React.FC<LocationAtmosphereBarProps> = ({
  selectedLocation,
  onOpenStoreComparison,
}) => {
  if (!selectedLocation) {
    return (
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Click any glowing pin marker on the 3D Globe to select a country.</span>
        </div>
      </div>
    );
  }

  const flag = selectedLocation.flag || getCountryFlag(selectedLocation.code);
  const stores = selectedLocation.websites || selectedLocation.stores || [];
  const storesCount = selectedLocation.storesCount ?? selectedLocation.storeCount ?? stores.length;
  const lowestPrice = selectedLocation.minPrice ?? selectedLocation.lowestPrice ?? 0;
  const lowestUsd = selectedLocation.lowestUsdPrice || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 mb-6 z-20 relative">
      <div
        style={{ borderColor: selectedLocation.atmosphereColor }}
        className="bg-slate-900/90 backdrop-blur-xl border-2 rounded-2xl p-4 shadow-2xl transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-3xl p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner shrink-0">
            {flag}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Location
              </span>
              <span
                style={{
                  color: selectedLocation.atmosphereColor,
                  borderColor: `${selectedLocation.atmosphereColor}40`,
                }}
                className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-950 border"
              >
                {selectedLocation.country} Atmosphere Active
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 mt-0.5">
              <span>{selectedLocation.country}</span>
              <span className="text-xs font-normal text-slate-400">({selectedLocation.code})</span>
            </h3>

            <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" />
                {storesCount} Platforms
              </span>
              <span>•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" />
                Lowest:{' '}
                <strong className="text-white">
                  {selectedLocation.currencySymbol || selectedLocation.currency || '$'}
                  {lowestPrice.toLocaleString()}
                </strong>{' '}
                <span className="text-slate-500">(${lowestUsd} USD)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenStoreComparison}
            style={{ backgroundColor: selectedLocation.atmosphereColor }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Compare {selectedLocation.country} Stores</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-400 italic font-medium text-center sm:text-right">
            Tip: Or double-click the {selectedLocation.country} pin on globe
          </span>
        </div>
      </div>
    </div>
  );
};
