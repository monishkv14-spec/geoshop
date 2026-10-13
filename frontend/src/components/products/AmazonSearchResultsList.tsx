import React, { useState } from 'react';
import type { ProductSummary } from '../../types';
import { Star, ShieldCheck, Truck, ArrowRight, Sparkles } from 'lucide-react';

interface AmazonSearchResultsListProps {
  query: string;
  products: ProductSummary[];
  selectedProduct: ProductSummary | null;
  onSelectProduct: (product: ProductSummary) => void;
  onCompareStores: (product: ProductSummary) => void;
}

export const AmazonSearchResultsList: React.FC<AmazonSearchResultsListProps> = ({
  query,
  products,
  selectedProduct,
  onSelectProduct,
  onCompareStores,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  if (!products || products.length === 0) return null;

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.basePriceUsd ?? a.minUsdPrice ?? 0;
    const priceB = b.basePriceUsd ?? b.minUsdPrice ?? 0;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.availableCountries.length - a.availableCountries.length;
    return 0;
  });

  return (
    <section
      id="amazon-search-results"
      className="max-w-6xl mx-auto px-4 my-6 z-20 relative animate-in fade-in duration-300"
    >
      {/* Control bar */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm">
            1-{sortedProducts.length} of {sortedProducts.length} results
          </span>
          {query && (
            <span className="text-slate-400 font-medium">
              for <strong className="text-cyan-300">"{query}"</strong>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-slate-400 font-medium hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 text-white font-semibold border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer text-xs"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Most Available Globally</option>
          </select>
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-4">
        {sortedProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            isBestSeller={index === 0}
            onSelectProduct={onSelectProduct}
            onCompareStores={onCompareStores}
          />
        ))}
      </div>
    </section>
  );
};

// ─── Per-card component so each card manages its own image-error state ──────

interface ProductCardProps {
  product: ProductSummary;
  isSelected: boolean;
  isBestSeller: boolean;
  onSelectProduct: (p: ProductSummary) => void;
  onCompareStores: (p: ProductSummary) => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  smartphones: 'from-blue-900/60 to-cyan-900/40',
  laptops:     'from-slate-800/80 to-indigo-900/40',
  audio:       'from-purple-900/60 to-pink-900/40',
  gaming:      'from-red-900/60 to-orange-900/40',
  cameras:     'from-amber-900/60 to-yellow-900/40',
  shoes:       'from-emerald-900/60 to-teal-900/40',
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  isBestSeller,
  onSelectProduct,
  onCompareStores,
}) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = !!product.image && !imgError;
  const gradient = CATEGORY_GRADIENTS[product.category] ?? 'from-slate-800/80 to-slate-900/40';

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className={`bg-slate-900/95 border-2 rounded-2xl p-5 shadow-xl transition-all duration-300 cursor-pointer
        flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group
        hover:border-cyan-400/80
        ${isSelected ? 'border-cyan-400 bg-cyan-950/20 shadow-cyan-500/15' : 'border-slate-800 hover:bg-slate-900'}`}
    >
      {/* ── Thumbnail ── */}
      <div
        className={`relative shrink-0 w-full md:w-48 h-48 rounded-xl bg-gradient-to-br ${gradient}
          border border-slate-700/60 overflow-hidden flex items-center justify-center`}
      >
        {hasImage ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 select-none px-4 text-center">
            <span
              className="text-7xl leading-none drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
              role="img"
              aria-label={product.name}
            >
              {product.imageEmoji || categoryEmoji(product.category)}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest line-clamp-1">
              {product.brand}
            </span>
          </div>
        )}

        {/* Top-left badge */}
        {isBestSeller ? (
          <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
            #1 Best Seller
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-slate-950/90 text-cyan-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md">
            Top Pick
          </span>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute bottom-2 right-2 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Selected
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[11px] font-extrabold uppercase text-cyan-400">{product.brand}</span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 font-medium">{product.category}</span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center text-amber-400">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
            <Star className="w-4 h-4 fill-amber-400 opacity-60" />
          </div>
          <span className="text-xs font-bold text-slate-200">4.8</span>
          <span className="text-[11px] text-slate-400">(2,480 ratings)</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Spec pills */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(product.specs).map(([key, val]) => (
              <span
                key={key}
                className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-medium"
              >
                <strong className="text-slate-400">{key}:</strong> {String(val)}
              </span>
            ))}
          </div>
        )}

        {/* Availability badge */}
        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium mt-3">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            Available across Amazon, Flipkart, Meesho, Myntra, MediaMarkt, Rakuten &amp;{' '}
            {product.availableCountries.length} Global Regions
          </span>
        </div>
      </div>

      {/* ── Price & CTA ── */}
      <div className="shrink-0 w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between items-start md:items-end gap-3 h-full">
        <div className="text-left md:text-right w-full">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">List Price</span>
          <div className="text-2xl font-black text-white">
            ${product.basePriceUsd ?? product.minUsdPrice ?? '—'}{' '}
            <span className="text-xs font-bold text-slate-400">USD</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1 justify-start md:justify-end">
            <Truck className="w-3.5 h-3.5" />
            <span>Free Shipping Available</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
            onCompareStores(product);
          }}
          className={`w-full px-5 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
            isSelected
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          <span>COMPARE PRICES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Emoji fallback map ──────────────────────────────────────────────────────
function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    smartphones: '📱',
    laptops:     '💻',
    audio:       '🎧',
    gaming:      '🎮',
    cameras:     '📷',
    shoes:       '👟',
    clothing:    '👕',
    watches:     '⌚',
    tablets:     '📲',
    tvs:         '📺',
  };
  return map[category] ?? '🛍️';
}
