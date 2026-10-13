import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe2, Layers, History, Bookmark, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import type { ProductSummary, GlobeMarker } from '../../types';
import { getCountryFlag } from '../../utils/globeUtils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductSummary[];
  markers: GlobeMarker[];
  onSelectProduct: (product: ProductSummary) => void;
  onSelectLocation: (marker: GlobeMarker) => void;
  onOpenCatalog: () => void;
  onOpenHistory: () => void;
  onOpenCart: () => void;
  onOpenCompare: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  products,
  markers,
  onSelectProduct,
  onSelectLocation,
  onOpenCatalog,
  onOpenHistory,
  onOpenCart,
  onOpenCompare,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Filter products
  const matchedProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, 5);

  // Filter countries
  const matchedCountries = markers.filter(
    (m) =>
      m.country.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.currency.toLowerCase().includes(q)
  );

  // Core navigation commands
  const defaultCommands = [
    {
      id: 'cmd-catalog',
      title: 'Open Global Product Catalog',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        onOpenCatalog();
        onClose();
      },
    },
    {
      id: 'cmd-history',
      title: 'View Search & Comparison History',
      category: 'Navigation',
      icon: History,
      action: () => {
        onOpenHistory();
        onClose();
      },
    },
    {
      id: 'cmd-cart',
      title: 'Open Bookmarked & Saved Listings',
      category: 'Navigation',
      icon: Bookmark,
      action: () => {
        onOpenCart();
        onClose();
      },
    },
    {
      id: 'cmd-compare',
      title: 'Compare Stores for Current Location',
      category: 'Navigation',
      icon: Globe2,
      action: () => {
        onOpenCompare();
        onClose();
      },
    },
  ].filter((c) => c.title.toLowerCase().includes(q));

  // Flatten items for keyboard navigation
  const allItems: Array<{
    type: 'product' | 'country' | 'command';
    data: any;
    execute: () => void;
  }> = [
    ...matchedProducts.map((p) => ({
      type: 'product' as const,
      data: p,
      execute: () => {
        onSelectProduct(p);
        onClose();
      },
    })),
    ...matchedCountries.map((m) => ({
      type: 'country' as const,
      data: m,
      execute: () => {
        onSelectLocation(m);
        onClose();
      },
    })),
    ...defaultCommands.map((c) => ({
      type: 'command' as const,
      data: c,
      execute: c.action,
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (allItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        allItems[selectedIndex].execute();
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a product, country, or command..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded mr-2">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 space-y-4 divide-y divide-slate-800/60">
          {allItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching products, countries, or commands found.
            </div>
          ) : (
            <>
              {/* Products Section */}
              {matchedProducts.length > 0 && (
                <div className="pt-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Products
                  </div>
                  {matchedProducts.map((p) => {
                    const idx = allItems.findIndex((it) => it.data.id === p.id);
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-cyan-950 text-white' : 'hover:bg-slate-800/70 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{p.imageEmoji || '🛍️'}</span>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.brand} • {p.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-extrabold text-cyan-300">
                            ${p.basePriceUsd} USD
                          </span>
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Countries Section */}
              {matchedCountries.length > 0 && (
                <div className="pt-2">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Countries & Globe Pins
                  </div>
                  {matchedCountries.map((m) => {
                    const idx = allItems.findIndex((it) => it.data.code === m.code);
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={m.code}
                        onClick={() => {
                          onSelectLocation(m);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-cyan-950 text-white' : 'hover:bg-slate-800/70 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{m.flag || getCountryFlag(m.code)}</span>
                          <div>
                            <div className="text-xs font-bold">{m.country}</div>
                            <div className="text-[10px] text-slate-400">
                              {m.code} • {m.storeCount} Platforms • {m.currency}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">
                            ${m.lowestUsdPrice} USD
                          </span>
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation Commands */}
              {defaultCommands.length > 0 && (
                <div className="pt-2">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Commands
                  </div>
                  {defaultCommands.map((cmd) => {
                    const idx = allItems.findIndex((it) => it.data.id === cmd.id);
                    const isSelected = idx === selectedIndex;
                    const IconComponent = cmd.icon;
                    return (
                      <div
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-cyan-950 text-white' : 'hover:bg-slate-800/70 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1 rounded-lg bg-slate-800 text-cyan-400">
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold">{cmd.title}</span>
                        </div>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span className="text-cyan-400 font-medium">GeoShop Mission Control</span>
        </div>
      </div>
    </div>
  );
};
