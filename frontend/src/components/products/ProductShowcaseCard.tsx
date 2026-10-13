import React from 'react';
import type { ProductSummary } from '../../types';
import { ShoppingBag, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductShowcaseCardProps {
  product: ProductSummary;
  onCompareStores: () => void;
}

export const ProductShowcaseCard: React.FC<ProductShowcaseCardProps> = ({
  product,
  onCompareStores,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const hasImage = !!product.image && !imgError;

  return (
    <div className="w-full mt-2 relative z-10">
      <div className="bg-white rounded-2xl border border-[#ded7cc] p-4 sm:p-5 shadow-xs transition-all flex flex-col gap-4">
        
        <div className="flex items-start gap-4">
          {hasImage ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-20 h-20 rounded-xl object-contain bg-[#f9f8f5] border border-[#e8e2d6] p-1.5 shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-[#f0ede6] border border-[#e2dcce] shrink-0 flex items-center justify-center text-3xl">
              <span>{product.imageEmoji || '📦'}</span>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#eaf0e8] text-[#3a4b37] border border-[#cbd6c8]">
                {product.brand}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f3efe6] text-[#6b5e4c] border border-[#e5dec4]">
                {product.category}
              </span>
              <span className="text-[10px] text-[#2d613e] font-semibold flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3 h-3 text-[#3b7a57]" /> Verified In Catalog
              </span>
            </div>

            <h2 className="font-serif text-base sm:text-lg font-bold text-[#191c19] tracking-tight leading-snug truncate">
              {product.name}
            </h2>
            <p className="text-xs text-[#5a6358] mt-0.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Specs Pills */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f0ece4]">
            {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
              <span key={key} className="text-[10px] bg-[#f8f6f0] border border-[#e6dfd3] text-[#4a524a] px-2 py-0.5 rounded-md">
                <strong className="text-[#6d756b]">{key}:</strong> {String(val)}
              </span>
            ))}
          </div>
        )}

        {/* Footer info & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0ece4] gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#4a524a]">
            <Globe className="w-3.5 h-3.5 text-[#5b7056]" />
            <span className="font-bold text-[#191c19]">{product.availableCountries.length} Countries</span>
            <span className="text-[10px] text-[#788277] hidden sm:inline">• 70+ verified local retailers</span>
          </div>

          <button
            onClick={onCompareStores}
            className="px-4 py-2 rounded-xl bg-[#3a4b37] hover:bg-[#4d6049] text-[#f7f5f0] font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Compare Stores</span>
            <Sparkles className="w-3 h-3 text-[#d8c385]" />
          </button>
        </div>

      </div>
    </div>
  );
};
