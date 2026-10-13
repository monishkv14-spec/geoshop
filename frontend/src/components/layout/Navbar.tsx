import React from 'react';
import { Globe, ShoppingCart, User, History, Layers, Sparkles, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'products' | 'compare' | 'history';
  onSelectTab: (tab: 'home' | 'products' | 'compare' | 'history') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenHistory,
  onOpenCommandPalette,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#f7f4ee]/90 border-b border-[#e5dec4] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#3a4b37] text-[#f7f5f0] shadow-sm group-hover:bg-[#4d6049] transition-all">
            <Globe className="w-4 h-4 text-[#eaf0e8] group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-[#191c19] leading-tight">
              GeoShop
            </span>
            <span className="text-[9px] text-[#5b7056] font-semibold tracking-wider uppercase">
              Global Price Discovery
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#ede8df] p-1 rounded-full border border-[#ded7cc]">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-[#3a4b37] text-[#f7f5f0] shadow-sm'
                : 'text-[#535d52] hover:text-[#191c19] hover:bg-[#e4ded4]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Globe Discovery
          </button>

          <button
            onClick={() => onSelectTab('products')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-[#3a4b37] text-[#f7f5f0] shadow-sm'
                : 'text-[#535d52] hover:text-[#191c19] hover:bg-[#e4ded4]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Global Catalog
          </button>

          <button
            onClick={() => onSelectTab('compare')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-[#3a4b37] text-[#f7f5f0] shadow-sm'
                : 'text-[#535d52] hover:text-[#191c19] hover:bg-[#e4ded4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Store Comparison
          </button>

          <button
            onClick={onOpenHistory}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#3a4b37] text-[#f7f5f0] shadow-sm'
                : 'text-[#535d52] hover:text-[#191c19] hover:bg-[#e4ded4]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Search History
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#ded7cc] hover:border-[#5b7056] text-[#535d52] hover:text-[#191c19] transition-all flex items-center gap-1.5 text-xs shadow-xs"
              title="Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#5b7056]" />
              <span className="hidden lg:inline text-[11px] font-medium">Palette</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-[#f3efe8] text-[10px] font-mono border border-[#e2dcce] text-[#535d52]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Saved Items Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-white border border-[#ded7cc] hover:border-[#5b7056] text-[#3a4b37] hover:text-[#191c19] transition-all shadow-xs"
            title="Saved Products"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3a4b37] text-[#f7f5f0] font-bold text-[10px] flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 bg-white border border-[#ded7cc] p-1 pl-2.5 rounded-lg text-xs shadow-xs">
            <span className="font-medium text-[#4a524a] hidden sm:inline text-xs">Guest</span>
            <div className="w-6 h-6 rounded-md bg-[#eaf0e8] text-[#3a4b37] border border-[#cbd6c8] flex items-center justify-center text-xs font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
