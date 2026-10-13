import { ProductProvider, ProviderSearchResult, SearchFilters } from './ProductProvider.js';
import { LocalCatalogProvider } from './LocalCatalogProvider.js';
import { LiveApiProvider } from './LiveApiProvider.js';
import { TaxonomyGeneratorProvider } from './TaxonomyGeneratorProvider.js';

/**
 * SearchOrchestrator – coordinates multiple product providers.
 *   1️⃣ Local catalog (seeded DB) – primary source.
 *   2️⃣ Live API (external marketplaces) – real‑time data.
 *   3️⃣ Taxonomy generator – fallback synthetic results for uncovered queries.
 *
 * The orchestrator merges results, de‑duplicates by product ID (preferring the
 * highest scoring entry), and returns a unified, ranked list.
 */
export class SearchOrchestrator implements ProductProvider {
  public readonly name = 'SearchOrchestrator';

  private readonly providers: ProductProvider[];

  constructor() {
    this.providers = [
      new LocalCatalogProvider(),
      new LiveApiProvider(),
      new TaxonomyGeneratorProvider(),
    ];
  }

  /** Merge and de‑duplicate provider results, keeping the highest score. */
  private mergeResults(results: ProviderSearchResult[][]): ProviderSearchResult[] {
    const map = new Map<string, ProviderSearchResult>();
    for (const arr of results) {
      for (const prod of arr) {
        const existing = map.get(prod.id);
        if (!existing || (prod.score ?? 0) > (existing.score ?? 0)) {
          map.set(prod.id, prod);
        }
      }
    }
    // Sort descending by score (fallback to 0)
    return Array.from(map.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  async search(query: string, country?: string, filters?: SearchFilters): Promise<ProviderSearchResult[]> {
    const promises = this.providers.map((p) => p.search(query, country, filters));
    const allResults = await Promise.all(promises);
    return this.mergeResults(allResults);
  }

  async getById(id: string): Promise<any | null> {
    for (const provider of this.providers) {
      const result = await provider.getById(id);
      if (result) return result;
    }
    return null;
  }

  async getRelated(productId: string): Promise<ProviderSearchResult[]> {
    const promises = this.providers.map((p) => p.getRelated(productId));
    const relatedLists = await Promise.all(promises);
    return this.mergeResults(relatedLists);
  }
}
