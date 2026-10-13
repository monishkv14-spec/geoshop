import { ProductProvider, ProviderSearchResult, SearchFilters } from './ProductProvider';

/**
 * LiveApiProvider – placeholder implementation that simulates fetching live product data
 * from external marketplaces. In a real system this would call third‑party APIs via HTTP
 * and transform the response into {@link ProviderSearchResult}. For now we return an
 * empty array so the orchestrator can fall back to other providers.
 */
export class LiveApiProvider implements ProductProvider {
  public readonly name = 'LiveApiProvider';

  async search(query: string, country?: string, filters?: SearchFilters): Promise<ProviderSearchResult[]> {
    // TODO: Replace with real API calls. Currently returns empty results.
    // Simulate async delay for realism.
    await new Promise((r) => setTimeout(r, 50));
    return [];
  }

  async getById(id: string): Promise<any | null> {
    // No live lookup; return null.
    return null;
  }

  async getRelated(productId: string): Promise<ProviderSearchResult[]> {
    // No related data; return empty.
    return [];
  }
}
