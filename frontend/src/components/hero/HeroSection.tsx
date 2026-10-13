import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Sparkles, X, Cpu, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import type { ProductSummary, AIAnalysisResult } from '../../types';
import { ProductShowcaseCard } from '../products/ProductShowcaseCard';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchResults: ProductSummary[];
  selectedProduct: ProductSummary | null;
  onSelectProduct: (product: ProductSummary) => void;
  onCompareStores?: () => void;
  aiAnalysis?: AIAnalysisResult | null;
  onOpenCommandPalette?: () => void;
}

const POPULAR_SEARCHES = [
  'iPhone',
  'Laptop',
  'Headphones',
  'Shoes',
  'Smart Watch',
  'Camera',
  'PS5',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  searchResults,
  selectedProduct,
  onSelectProduct,
  onCompareStores,
  aiAnalysis,
  onOpenCommandPalette,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 300ms Debounce search implementation
  const triggerDebouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setIsDebouncing(true);
      debounceTimerRef.current = window.setTimeout(() => {
        setIsDebouncing(false);
        onSearch(query);
      }, 300);
    },
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputQuery(val);
    setSelectedIndex(-1);
    setShowDropdown(val.trim().length > 0);
    triggerDebouncedSearch(val);
  };

  const handlePillClick = (term: string) => {
    setInputQuery(term);
    setShowDropdown(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setIsDebouncing(false);
    onSearch(term);
  };

  const handleSelectProduct = (product: ProductSummary) => {
    onSelectProduct(product);
    setShowDropdown(false);
    setInputQuery(product.name);
  };

  // Keyboard navigation within suggestions dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) {
      if (e.key === 'Enter') {
        setShowDropdown(false);
        onSearch(inputQuery);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        handleSelectProduct(searchResults[selectedIndex]);
      } else {
        setShowDropdown(false);
        onSearch(inputQuery);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-left w-full">
      {/* Category Pill / Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf0e8] border border-[#cbd6c8] text-[#3a4b37] text-xs font-semibold self-start shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-[#5b7056]" />
        <span>Live Regional Arbitrage • 12 Markets</span>
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:inline-flex items-center gap-1 ml-1 px-1.5 py-0.2 rounded bg-white text-[10px] text-[#3a4b37] border border-[#cbd6c8] hover:bg-[#f2f6f1] transition"
            title="Press Ctrl+K to open Command Palette"
          >
            <span>Ctrl</span>+<span>K</span>
          </button>
        )}
      </div>

      {/* Main Headline */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#191c19] tracking-tight leading-[1.12]">
        Find Your Product <br />
        <span className="text-[#3a4b37] italic">Anywhere in the World</span>
      </h1>

      <p className="text-xs sm:text-sm text-[#5a6358] max-w-xl leading-relaxed">
        Search for any gadget, device, or item. GeoShop maps multi-store prices across 12 countries on a 3D Earth to reveal global savings routes.
      </p>

      {/* Search Input Box Container */}
      <div ref={containerRef} className="relative w-full">
        <div className="relative flex items-center bg-white border border-[#ded7cc] focus-within:border-[#5b7056] focus-within:ring-2 focus-within:ring-[#5b7056]/20 rounded-2xl shadow-xs transition-all duration-200 p-1.5">
          {isDebouncing ? (
            <Loader2 className="w-4 h-4 text-[#5b7056] ml-2.5 shrink-0 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-[#6d776a] ml-2.5 shrink-0" />
          )}

          <input
            type="text"
            value={inputQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(inputQuery.trim().length > 0 && searchResults.length > 0)}
            placeholder="Search iPhone, MacBook, Sony, PS5, Shoes..."
            className="w-full bg-transparent px-3 py-1.5 text-[#191c19] placeholder-[#8c9489] text-xs sm:text-sm focus:outline-none"
            aria-label="Search product catalog"
          />

          {inputQuery && (
            <button
              onClick={() => {
                setInputQuery('');
                setShowDropdown(false);
                onSearch('');
              }}
              className="p-1 text-[#8c9489] hover:text-[#191c19] mr-1 transition"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setShowDropdown(false);
              onSearch(inputQuery);
            }}
            className="px-4 py-2 rounded-xl bg-[#3a4b37] hover:bg-[#4d6049] text-[#f7f5f0] font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Search Suggestions Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ded7cc] rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-64 overflow-y-auto divide-y divide-[#f0ece4]">
            {searchResults.map((product, idx) => {
              const isHighlighted = idx === selectedIndex;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={`p-3 cursor-pointer transition-colors flex items-center gap-3 ${
                    isHighlighted ? 'bg-[#eaf0e8] text-[#191c19]' : 'hover:bg-[#f7f5f0]'
                  }`}
                >
                  {/* Thumbnail with fallback */}
                  <div className="w-10 h-10 rounded-lg shrink-0 border border-[#e2dcd2] overflow-hidden flex items-center justify-center bg-[#f7f5f0]">
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
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : null}
                    <span
                      role="img"
                      aria-label={product.name}
                      style={{ display: product.image ? 'none' : 'flex' }}
                      className="text-xl items-center justify-center"
                    >
                      {product.imageEmoji ?? '🛍️'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-[#191c19] truncate">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-[#6d776a] flex items-center gap-2 mt-0.5">
                      <span>{product.brand}</span>
                      <span>•</span>
                      <span className="text-[#3a4b37] font-semibold">
                        {product.availableCountries.length} countries
                      </span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-lg bg-[#f0ede6] text-[#191c19] font-bold border border-[#ded7cc] shrink-0">
                    ${(product.basePriceUsd ?? product.minUsdPrice ?? 0).toFixed(0)} USD
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular Search Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-[#788277] font-medium mr-0.5">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            onClick={() => handlePillClick(term)}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#ded7cc] hover:bg-[#eaf0e8] hover:border-[#5b7056] text-[#3a4b37] transition-all shadow-2xs"
          >
            {term}
          </button>
        ))}
      </div>

      {/* AI Discovery HUD Indicator */}
      {aiAnalysis && (
        <div className="bg-[#eef3ec] border border-[#cbd6c8] p-3 rounded-2xl text-left shadow-2xs flex items-center justify-between text-xs text-[#3a4b37]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[#5b7056] shrink-0 animate-pulse" />
            <div>
              <div className="font-bold text-[#191c19] flex items-center gap-1.5">
                <span>AI Global Discovery Active</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#2d613e] border border-[#b2d9be] font-bold">
                  {(aiAnalysis.confidenceScore * 100).toFixed(0)}% Match
                </span>
              </div>
              <div className="text-[11px] text-[#5a6358] mt-0.5">
                Category: <strong>{aiAnalysis.detectedCategory}</strong> • Scanned {aiAnalysis.globalMerchantsScanned} Stores across {aiAnalysis.matchingLocationsCount} Countries
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[#2d613e] font-semibold shrink-0">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>12 Pins Mapped</span>
          </div>
        </div>
      )}

      {/* Selected Product Card inside Left Column */}
      {selectedProduct && onCompareStores && (
        <ProductShowcaseCard
          product={selectedProduct}
          onCompareStores={onCompareStores}
        />
      )}
    </div>
  );
};
