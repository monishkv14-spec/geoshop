import { ProductProvider, ProviderSearchResult, SearchFilters } from './ProductProvider';
import { CATALOG_DEFINITIONS, ProductTypeDefinition } from '../data/catalogDefinitions.js';
import crypto from 'crypto';

/**
 * TaxonomyGeneratorProvider – fallback provider that generates synthetic product results
 * based on the static catalog definitions. This ensures searches for accessories
 * that are not present in the seeded database still return realistic‑looking items.
 */
export class TaxonomyGeneratorProvider implements ProductProvider {
  public readonly name = 'TaxonomyGeneratorProvider';

  /** Find definitions that match the query in type, synonyms, tags or brand/model strings. */
  private matchDefinition(query: string): ProductTypeDefinition[] {
    const lowered = query.toLowerCase();
    return CATALOG_DEFINITIONS.filter((def) => {
      const terms = [
        def.type,
        ...def.synonyms,
        ...def.tags,
        ...def.brands.flatMap((b) => [b.brand, ...b.models]),
      ];
      return terms.some((t) => t.toLowerCase().includes(lowered));
    });
  }

  async search(query: string, country?: string, filters?: SearchFilters): Promise<ProviderSearchResult[]> {
    if (!query) return [];
    const matches = this.matchDefinition(query);
    // Generate a synthetic result for each matching definition
    return matches.map((def) => {
      const brand = def.brands[0]?.brand ?? 'Generic';
      const model = def.brands[0]?.models[0] ?? '';
      const name = `${brand} ${def.type}${model ? ' ' + model : ''}`.trim();
      return {
        id: crypto.randomUUID(),
        name,
        brand,
        category: def.category,
        subcategory: def.subcategory,
        imageEmoji: def.emoji,
        image: undefined,
        description: `Generated ${def.type} from taxonomy fallback`,
        basePriceUsd: def.baseUsdMin,
        source: 'Estimated',
        isGenerated: true,
        score: 0.5,
      } as ProviderSearchResult;
    });
  }

  async getById(_id: string): Promise<any | null> {
    // Not applicable for generated items.
    return null;
  }

  async getRelated(_productId: string): Promise<ProviderSearchResult[]> {
    // No related data for generated items.
    return [];
  }
}
