import { useEffect, useState, useCallback, useRef, Suspense, lazy } from 'react';
import type { ProductSummary, GlobeMarker, ProductListing, SearchHistoryItem, AIAnalysisResult } from './types';
import {
  fetchSearchProducts,
  fetchProductAvailability,
  fetchProductComparison,
  fetchSearchHistory,
  recordSearchHistory,
  clearSearchHistory,
  deleteHistoryItem,
  fetchSavedItems,
  addSavedItem,
  deleteSavedItem,
} from './services/api';

import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { AmazonSearchResultsList } from './components/products/AmazonSearchResultsList';
import { ProductShowcaseCard } from './components/products/ProductShowcaseCard';
const WorldGlobe = lazy(() => import('./components/3d/WorldGlobe').then(m => ({ default: m.WorldGlobe })));
import { LocationAtmosphereBar } from './components/location/LocationAtmosphereBar';
import { ShoppingWebsiteList } from './components/comparison/ShoppingWebsiteList';
import { ProductComparisonModal } from './components/comparison/ProductComparisonModal';
import { QualityInfoModal } from './components/comparison/QualityInfoModal';
import { PurchaseDecisionModal } from './components/redirection/PurchaseDecisionModal';
import { GlobalProductsModal } from './components/products/GlobalProductsModal';
import { SearchHistoryModal } from './components/history/SearchHistoryModal';
import { CommandPalette } from './components/palette/CommandPalette';
import { CartDrawer } from './components/cart/CartDrawer';
import { Footer } from './components/layout/Footer';
import { Search } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'compare' | 'history'>('home');

  const [catalogProducts, setCatalogProducts] = useState<ProductSummary[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const [searchResults, setSearchResults] = useState<ProductSummary[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [markers, setMarkers] = useState<GlobeMarker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GlobeMarker | null>(null);

  const [listings, setListings] = useState<ProductListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(false);

  // Modals & Redirection state
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [selectedQualityListing, setSelectedQualityListing] = useState<ProductListing | null>(null);
  const [selectedBuyListing, setSelectedBuyListing] = useState<ProductListing | null>(null);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  const [savedListings, setSavedListings] = useState<ProductListing[]>([]);
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);

  // Race-condition safety request tracker
  const searchRequestIdRef = useRef<number>(0);

  // Global Ctrl+K / Cmd+K Command Palette Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial App Setup
  useEffect(() => {
    const initApp = async () => {
      setIsSearching(true);
      const res = await fetchSearchProducts('');
      if (res.success && res.data.length > 0) {
        setCatalogProducts(res.data);
        const defaultProd = res.data[0];
        setSelectedProduct(defaultProd);

        const availRes = await fetchProductAvailability(defaultProd.id);
        if (availRes.success && availRes.markers.length > 0) {
          setMarkers(availRes.markers);

          // Phase 3 requirement: Find and auto-fly to the global cheapest country
          const cheapestLoc = availRes.markers.reduce(
            (min, m) =>
              (m.lowestUsdPrice || 999999) < (min.lowestUsdPrice || 999999) ? m : min,
            availRes.markers[0]
          );
          setSelectedLocation(cheapestLoc);

          const compRes = await fetchProductComparison(defaultProd.id, cheapestLoc.locationId);
          if (compRes.success) {
            setListings(compRes.data);
          }
        }
      }
      setIsSearching(false);

      const histRes = await fetchSearchHistory();
      if (histRes.success) {
        setHistoryItems(histRes.data);
      }

      const savedRes = await fetchSavedItems();
      if (savedRes.success && savedRes.data && savedRes.data.length > 0) {
        const formatted: ProductListing[] = savedRes.data.map((item: any) => ({
          id: item.listingId || item.id,
          listingId: item.listingId || item.id,
          productId: item.product?.id || '',
          productName: item.product?.name || 'Product',
          productEmoji: item.product?.imageEmoji,
          websiteId: item.website?.id || '',
          websiteName: item.website?.name || 'Store',
          locationId: item.website?.countryCode || '',
          country: item.website?.country || '',
          countryCode: item.website?.countryCode || '',
          price: item.price,
          currency: item.currency,
          priceUsd: item.priceUsd,
          rating: item.rating,
          reviewCount: item.reviewCount,
          inStock: item.inStock,
          directStoreUrl: item.directStoreUrl,
          originalProductUrl: item.directStoreUrl,
        }));
        setSavedListings(formatted);
      }
    };

    initApp();
  }, []);

  // Search execution with race condition prevention
  const handleSearch = useCallback(async (query: string) => {
    const reqId = ++searchRequestIdRef.current;
    setIsSearching(true);
    setCurrentQuery(query);

    const res = await fetchSearchProducts(query);

    // Discard response if a newer query was fired while awaiting
    if (reqId !== searchRequestIdRef.current) return;

    if (res.success) {
      setSearchResults(res.data);
      if (res.aiAnalysis) {
        setAiAnalysis(res.aiAnalysis);
      }

      if (res.data.length > 0 && query.trim() !== '') {
        const topProduct = res.data[0];
        setSelectedProduct(topProduct);

        const availRes = await fetchProductAvailability(topProduct.id);
        if (reqId !== searchRequestIdRef.current) return;

        if (availRes.success && availRes.markers.length > 0) {
          setMarkers(availRes.markers);

          // Auto-fly to cheapest country pin
          const cheapestLoc = availRes.markers.reduce(
            (min, m) =>
              (m.lowestUsdPrice || 999999) < (min.lowestUsdPrice || 999999) ? m : min,
            availRes.markers[0]
          );
          setSelectedLocation(cheapestLoc);

          const compRes = await fetchProductComparison(topProduct.id, cheapestLoc.locationId);
          if (compRes.success) {
            setListings(compRes.data);
          }
        }

        recordSearchHistory(query, topProduct.id).then(async () => {
          const histRes = await fetchSearchHistory();
          if (histRes.success) {
            setHistoryItems(histRes.data);
          }
        });
      }
    }
    setIsSearching(false);
  }, []);

  // Select a product from Catalog, Suggestions, or Command Palette
  const handleSelectProduct = async (product: ProductSummary) => {
    setSelectedProduct(product);
    setIsSearching(true);

    const availRes = await fetchProductAvailability(product.id);
    if (availRes.success && availRes.markers.length > 0) {
      setMarkers(availRes.markers);

      // Auto-fly to cheapest country
      const cheapestLoc = availRes.markers.reduce(
        (min, m) =>
          (m.lowestUsdPrice || 999999) < (min.lowestUsdPrice || 999999) ? m : min,
        availRes.markers[0]
      );
      setSelectedLocation(cheapestLoc);

      const compRes = await fetchProductComparison(product.id, cheapestLoc.locationId);
      if (compRes.success) {
        setListings(compRes.data);
      }
    } else {
      setListings([]);
    }
    setIsSearching(false);

    // Smoothly scroll down to Globe & Price Comparison section
    const elem = document.getElementById('globe-comparison-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Location selection on Globe or Country Jump
  const handleSelectLocation = async (marker: GlobeMarker) => {
    setSelectedLocation(marker);
    if (!selectedProduct) return;

    setIsLoadingListings(true);
    const compRes = await fetchProductComparison(selectedProduct.id, marker.locationId);
    if (compRes.success) {
      setListings(compRes.data);
    }
    setIsLoadingListings(false);
  };

  // Double click location on Globe: selects and opens comparison modal
  const handleDoubleClickLocation = async (marker: GlobeMarker) => {
    setSelectedLocation(marker);
    if (selectedProduct) {
      setIsLoadingListings(true);
      const compRes = await fetchProductComparison(selectedProduct.id, marker.locationId);
      if (compRes.success) {
        setListings(compRes.data);
      }
      setIsLoadingListings(false);
    }
    setIsComparisonModalOpen(true);
  };

  const handleSelectTab = (tab: 'home' | 'products' | 'compare' | 'history') => {
    setActiveTab(tab);
    if (tab === 'products') {
      setIsProductsModalOpen(true);
    } else if (tab === 'compare') {
      setIsComparisonModalOpen(true);
    } else if (tab === 'history') {
      setIsHistoryModalOpen(true);
    }
  };

  const handleSaveCartItem = async (listing: ProductListing) => {
    const listingId = listing.listingId || listing.id;
    const isAlreadySaved = savedListings.some(
      (item) => (item.listingId || item.id) === listingId
    );

    if (isAlreadySaved) {
      setSavedListings((prev) =>
        prev.filter((item) => (item.listingId || item.id) !== listingId)
      );
      await deleteSavedItem(listingId);
    } else {
      setSavedListings((prev) => [...prev, listing]);
      await addSavedItem(listingId);
    }
  };

  const handleRemoveSavedItem = async (id: string) => {
    setSavedListings((prev) =>
      prev.filter((item) => (item.listingId || item.id) !== id)
    );
    await deleteSavedItem(id);
  };

  // Database Search History Handlers
  const handleClearHistory = async () => {
    await clearSearchHistory();
    setHistoryItems([]);
  };

  const handleDeleteHistoryItem = async (id: string) => {
    await deleteHistoryItem(id);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        cartCount={savedListings.length}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main className="flex-1 relative">
        <HeroSection
          onSearch={handleSearch}
          searchResults={searchResults}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          aiAnalysis={aiAnalysis}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Step 1: Loading Skeleton when searching */}
        {isSearching && currentQuery && (
          <div className="max-w-6xl mx-auto px-4 my-6 space-y-3 animate-pulse">
            <div className="h-10 bg-slate-900/80 rounded-2xl border border-slate-800" />
            <div className="h-44 bg-slate-900/60 rounded-2xl border border-slate-800" />
            <div className="h-44 bg-slate-900/60 rounded-2xl border border-slate-800" />
          </div>
        )}

        {/* Step 2: Search Results List (Only visible when user searches) */}
        {!isSearching && searchResults.length > 0 && (
          <AmazonSearchResultsList
            query={currentQuery}
            products={searchResults}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onCompareStores={(product) => {
              handleSelectProduct(product);
              setIsComparisonModalOpen(true);
            }}
          />
        )}

        {/* Empty State when search returns 0 results */}
        {!isSearching && currentQuery.trim() !== '' && searchResults.length === 0 && (
          <div className="max-w-2xl mx-auto px-4 my-8 text-center bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No products found for "{currentQuery}"</h3>
            <p className="text-xs text-slate-400">
              Try searching with popular keywords or explore the global catalog:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {['iPhone', 'Laptop', 'Headphones', 'PS5', 'Shoes'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="px-3 py-1 rounded-full bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Selected Product Showcase & 3D Globe Section */}
        <div id="globe-comparison-section" className="pt-4">
          {selectedProduct && searchResults.length === 0 && (
            <ProductShowcaseCard
              product={selectedProduct}
              onCompareStores={() => setIsComparisonModalOpen(true)}
            />
          )}

          {/* Selected Location Atmosphere Status Bar */}
          <LocationAtmosphereBar
            selectedLocation={selectedLocation}
            onOpenStoreComparison={() => setIsComparisonModalOpen(true)}
          />

          {/* 3D World Globe Container */}
          <section className="w-full h-[540px] sm:h-[620px] relative my-2 px-2 sm:px-6">
            <Suspense
              fallback={
                <div className="w-full h-full min-h-[540px] flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800/80">
                  <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3 shadow-lg shadow-cyan-500/20" />
                  <span className="text-cyan-300 text-xs font-bold tracking-wider uppercase animate-pulse">
                    Initializing 3D World Globe Engine...
                  </span>
                </div>
              }
            >
              <WorldGlobe
                markers={markers}
                selectedLocation={selectedLocation}
                onSelectLocation={handleSelectLocation}
                onDoubleClickLocation={handleDoubleClickLocation}
                isSearching={isSearching}
              />
            </Suspense>
          </section>

          {/* Multi-Store Price & Quality Comparison Table */}
          <section>
            <ShoppingWebsiteList
              location={selectedLocation}
              listings={listings}
              isLoading={isLoadingListings}
              onOpenQualityModal={(listing) => setSelectedQualityListing(listing)}
              onSaveCartItem={handleSaveCartItem}
              savedListingIds={savedListings
                .map((s) => s.listingId || s.id)
                .filter((id): id is string => Boolean(id))}
              onSelectListingToBuy={(listing) => setSelectedBuyListing(listing)}
            />
          </section>
        </div>
      </main>

      <Footer />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={catalogProducts}
        markers={markers}
        onSelectProduct={handleSelectProduct}
        onSelectLocation={handleSelectLocation}
        onOpenCatalog={() => setIsProductsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenCompare={() => setIsComparisonModalOpen(true)}
      />

      {/* Modals & Redirection Flow */}
      <ProductComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        product={selectedProduct}
        location={selectedLocation}
        listings={listings}
        availableMarkers={markers}
        onOpenQualityModal={(listing) => setSelectedQualityListing(listing)}
        onSelectListingToBuy={(listing) => {
          setIsComparisonModalOpen(false);
          setSelectedBuyListing(listing);
        }}
      />

      <QualityInfoModal
        listing={selectedQualityListing}
        onClose={() => setSelectedQualityListing(null)}
      />

      <PurchaseDecisionModal
        listing={selectedBuyListing}
        onClose={() => setSelectedBuyListing(null)}
      />

      <GlobalProductsModal
        isOpen={isProductsModalOpen}
        onClose={() => setIsProductsModalOpen(false)}
        products={catalogProducts}
        onSelectProduct={handleSelectProduct}
      />

      <SearchHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyItems={historyItems}
        onSelectQuery={(q) => handleSearch(q)}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        savedListings={savedListings}
        onRemoveItem={handleRemoveSavedItem}
      />
    </div>
  );
}

export default App;
