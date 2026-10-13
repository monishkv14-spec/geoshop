import React from 'react';
import type { ProductSummary } from '../../types';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface SearchResultsGridProps {
  query: string;
  products: ProductSummary[];
  selectedProduct: ProductSummary | null;
  onSelectProduct: (product: ProductSummary) => void;
  onCompareStores: (product: ProductSummary) => void;
}

export const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  query,
  products,
  selectedProduct,
  onSelectProduct,
  onCompareStores,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section id="search-results-section" className="max-w-6xl mx-auto px-4 my-8 z-20 relative animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Step 1: Product Selection
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {products.length} {products.length === 1 ? 'product' : 'products'} found {query ? `for "${query}"` : 'in catalog'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Select a Product to Compare Prices
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Compare prices across Amazon, Flipkart, Meesho, Myntra, MediaMarkt, Rakuten & global stores
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Live Merchant Data Geocoded
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {products.map((product) => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className={`relative bg-slate-950/90 rounded-2xl border-2 p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 ${
                  isSelected
                    ? 'border-cyan-400 shadow-xl shadow-cyan-500/20 bg-cyan-950/20'
                    : 'border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Active
                  </div>
                )}

                <div>
                  {/* Product Image & Badges */}
                  <div className="relative mb-4 overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 flex gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/90 text-cyan-300 border border-slate-700 backdrop-blur-md">
                        {product.brand}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/90 text-slate-300 border border-slate-700 backdrop-blur-md">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specs */}
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                        <span
                          key={key}
                          className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          <strong className="text-slate-400">{key}:</strong> {String(val)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Price & Compare Action */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Price</span>
                    <span className="text-lg font-black text-white">${product.basePriceUsd} USD</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                      onCompareStores(product);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 hover:brightness-110'
                        : 'bg-slate-800 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950'
                    }`}
                  >
                    <span>Compare Prices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
