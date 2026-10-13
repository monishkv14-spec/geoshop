import { prisma } from '../config/prisma.js';
import { ProductProvider, ProviderSearchResult, SearchFilters } from './ProductProvider.js';
import { expandQuery, scoreProductMatch } from '../utils/searchQuality.js';
import { convertToUsd } from '../utils/pricing.js';

export class LocalCatalogProvider implements ProductProvider {
  public readonly name = 'LocalCatalogProvider';

  public async search(
    query: string,
    country?: string,
    filters?: SearchFilters
  ): Promise<ProviderSearchResult[]> {
    const expanded = expandQuery(query);
    const searchTerms = Array.from(new Set([
      expanded.normalizedQuery,
      ...expanded.tokens,
      ...expanded.expandedTerms,
    ])).filter((t) => t.length >= 2);

    // Build Prisma OR filter conditions
    const orClauses: any[] = [];
    for (const term of searchTerms) {
      orClauses.push(
        { name: { contains: term } },
        { brand: { contains: term } },
        { category: { contains: term } },
        { subcategory: { contains: term } },
        { tags: { contains: term } },
        { aliases: { contains: term } },
        { description: { contains: term } }
      );
    }

    const where: any = {
      OR: orClauses.length > 0 ? orClauses : undefined,
    };

    if (filters?.category) {
      where.category = { equals: filters.category };
    }
    if (filters?.brand) {
      where.brand = { equals: filters.brand };
    }

    // Query database with listings
    const products = await prisma.product.findMany({
      where,
      include: {
        listings: {
          include: {
            website: {
              include: {
                location: true,
              },
            },
          },
        },
      },
      take: 120, // Fetch up to 120 candidates for in-memory ranking
    });

    // Score and map results
    const scored: ProviderSearchResult[] = [];

    for (const prod of products) {
      const matchScore = scoreProductMatch(
        {
          name: prod.name,
          brand: prod.brand,
          category: prod.category,
          subcategory: prod.subcategory,
          tags: prod.tags,
          aliases: prod.aliases,
          description: prod.description,
        },
        expanded
      );

      if (matchScore <= 0 && query.trim() !== '') {
        continue;
      }

      // Calculate country availability & prices
      const formattedListings = prod.listings.map((l) => ({
        id: l.id,
        productId: l.productId,
        websiteId: l.website.id,
        websiteName: l.website.name,
        country: l.website.location.name,
        countryCode: l.website.location.code,
        price: l.price,
        currency: l.currency,
        priceUsd: convertToUsd(l.price, l.currency),
        rating: l.rating,
        reviewCount: l.reviewCount,
        inStock: l.inStock,
        returnDays: l.returnDays,
        priceHistory: l.priceHistory,
        priceType: (l.priceType as any) || 'Catalog',
        sourceName: l.sourceName || 'Catalog',
        directStoreUrl: l.directUrl || `${l.website.baseSearchUrl}${encodeURIComponent(prod.name)}`,
      }));

      // Filter by country if specified
      if (country && !formattedListings.some((l) => l.countryCode.toLowerCase() === country.toLowerCase() || l.country.toLowerCase() === country.toLowerCase())) {
        continue;
      }

      // Price filter
      const usdPrices = formattedListings.map((l) => l.priceUsd);
      const minUsdPrice = usdPrices.length > 0 ? Math.min(...usdPrices) : 0;

      if (filters?.minPrice !== undefined && minUsdPrice < filters.minPrice) continue;
      if (filters?.maxPrice !== undefined && minUsdPrice > filters.maxPrice) continue;
      if (filters?.inStockOnly && !formattedListings.some((l) => l.inStock)) continue;

      const availableCountries = Array.from(new Set(formattedListings.map((l) => l.country)));

      scored.push({
        id: prod.id,
        name: prod.name,
        brand: prod.brand,
        category: prod.category,
        subcategory: prod.subcategory,
        imageEmoji: prod.imageEmoji,
        image: prod.image || undefined,
        description: prod.description,
        basePriceUsd: minUsdPrice,
        totalListingsCount: formattedListings.length,
        availableCountries,
        source: 'Catalog',
        isGenerated: prod.isGenerated,
        score: matchScore,
        listings: formattedListings,
        directStoreUrl: formattedListings[0]?.directStoreUrl,
      });
    }

    // Sort descending by score
    scored.sort((a, b) => (b.score || 0) - (a.score || 0));
    return scored;
  }

  public async getById(id: string): Promise<any | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        listings: {
          include: {
            website: {
              include: {
                location: true,
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    const countries = Array.from(
      new Set(product.listings.map((l) => l.website.location.name))
    );
    const usdPrices = product.listings.map((l) => convertToUsd(l.price, l.currency));
    const minUsdPrice = usdPrices.length > 0 ? Math.min(...usdPrices) : 0;

    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      imageEmoji: product.imageEmoji,
      image: product.image || undefined,
      description: product.description,
      source: product.source,
      isGenerated: product.isGenerated,
      basePriceUsd: minUsdPrice,
      totalListingsCount: product.listings.length,
      availableCountries: countries,
      listings: product.listings,
    };
  }

  public async getRelated(productId: string): Promise<ProviderSearchResult[]> {
    const current = await prisma.product.findUnique({ where: { id: productId } });
    if (!current) return [];

    const related = await prisma.product.findMany({
      where: {
        id: { not: productId },
        category: current.category,
      },
      include: {
        listings: {
          include: {
            website: {
              include: { location: true },
            },
          },
        },
      },
      take: 6,
    });

    return related.map((p) => {
      const usdPrices = p.listings.map((l) => convertToUsd(l.price, l.currency));
      const minUsdPrice = usdPrices.length > 0 ? Math.min(...usdPrices) : 0;
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory,
        imageEmoji: p.imageEmoji,
        image: p.image || undefined,
        description: p.description,
        basePriceUsd: minUsdPrice,
        totalListingsCount: p.listings.length,
        source: 'Catalog',
        isGenerated: p.isGenerated,
      };
    });
  }
}
