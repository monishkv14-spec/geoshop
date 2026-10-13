import React, { useState, useMemo, useEffect } from 'react';
import type { ProductSummary } from '../../types';
import {
  Layers,
  X,
  Search,
  ChevronRight,
  ArrowUpDown,
  ChevronLeft,
  ShoppingBag,
} from 'lucide-react';

interface GlobalProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductSummary[];
  onSelectProduct: (product: ProductSummary) => void;
}

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio', 'Gaming', 'Cameras', 'Shoes'];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'availability';

const ITEMS_PER_PAGE = 6;

export const GlobalProductsModal: React.FC<GlobalProductsModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Keyboard Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchFilter, sortBy]);

  // Filter and Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchFilter.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.basePriceUsd || 0) - (b.basePriceUsd || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.basePriceUsd || 0) - (a.basePriceUsd || 0));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'availability') {
      result.sort((a, b) => b.availableCountries.length - a.availableCountries.length);
    }

    return result;
  }, [products, selectedCategory, searchFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[90vh] flex flex-col text-white animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Global Product Catalog</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {filteredAndSortedProducts.length} Items
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Browse products across global merchant categories and visualize availability on Earth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            aria-label="Close catalog modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search products by brand, model, or keywords..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-slate-400 text-[11px] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-white font-medium focus:outline-none text-xs cursor-pointer"
              >
                <option value="featured" className="bg-slate-900">Featured Catalog</option>
                <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
                <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
                <option value="name-asc" className="bg-slate-900">Alphabetical (A-Z)</option>
                <option value="availability" className="bg-slate-900">Most Available Countries</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No products found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No catalog items match your search for "{searchFilter}" in category "{selectedCategory}".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchFilter('');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-900 transition"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between shadow-lg hover:shadow-cyan-500/10"
                >
                  <div>
                    {/* Image Preview with Emoji Fallback */}
                    <div className="w-full h-36 rounded-xl bg-slate-900 border border-slate-800 mb-3 overflow-hidden flex items-center justify-center relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            (e.currentTarget.nextSibling as HTMLElement | null)?.style.setProperty(
                              'display',
                              'flex'
                            );
                          }}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      ) : null}
                      <span
                        role="img"
                        aria-label={product.name}
                        style={{ display: product.image ? 'none' : 'flex' }}
                        className="text-4xl items-center justify-center"
                      >
                        {product.imageEmoji || '🛍️'}
                      </span>

                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/90 text-cyan-300 border border-slate-700 text-[10px] font-bold">
                        {product.availableCountries.length} Countries
                      </div>
                    </div>

                    <div className="text-[10px] uppercase font-bold text-cyan-400">
                      {product.brand} • {product.category}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Base Price</span>
                      <span className="font-extrabold text-white text-sm">
                        ${product.basePriceUsd} USD
                      </span>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                      <span>Fly to Globe</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Showing page <strong className="text-white">{currentPage}</strong> of{' '}
              <strong className="text-white">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-bold text-xs transition ${
                      currentPage === pageNum
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
