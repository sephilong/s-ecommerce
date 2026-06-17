
import { SearchService, SearchParams, SearchResult, AutocompleteResult } from "./search.service";
import { MOCK_TENANTS } from "@/lib/store-data";
import { generateFacets } from "@/lib/filter-utils";

export class MockSearchService implements SearchService {
  async search(params: SearchParams): Promise<SearchResult> {
    const start = Date.now();
    const tenant = MOCK_TENANTS.find(t => t.id === params.tenantId) || MOCK_TENANTS[0];
    let results = [...tenant.products];

    // Fuzzy query
    if (params.query && params.query !== '*') {
      const q = params.query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filters
    if (params.filters?.categoryIds?.length) {
      results = results.filter(p => params.filters!.categoryIds!.includes(p.category));
    }
    if (params.filters?.priceMin !== undefined) {
      results = results.filter(p => p.price >= params.filters!.priceMin!);
    }
    if (params.filters?.priceMax !== undefined) {
      results = results.filter(p => p.price <= params.filters!.priceMax!);
    }
    if (params.filters?.inStock) {
      results = results.filter(p => p.inStock);
    }

    // Sort
    if (params.sort === 'price_asc') results.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price_desc') results.sort((a, b) => b.price - a.price);
    else results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = results.length;
    const page = params.page || 1;
    const limit = params.limit || 20;
    const pagedResults = results.slice((page - 1) * limit, page * limit);

    return {
      hits: pagedResults,
      total,
      page,
      limit,
      facets: params.facets ? generateFacets(results) : undefined,
      processingTime: Date.now() - start,
      query: params.query,
    };
  }

  async autocomplete(query: string, tenantId: string): Promise<AutocompleteResult> {
    const tenant = MOCK_TENANTS.find(t => t.id === tenantId) || MOCK_TENANTS[0];
    const q = query.toLowerCase();

    if (q.length < 2) return { products: [], categories: [], suggestions: [] };

    const products = tenant.products
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 5);

    const categories = Array.from(new Set(tenant.products.map(p => p.category)))
      .filter(c => c.toLowerCase().includes(q))
      .map(c => ({ id: c, name: c, slug: c.toLowerCase().replace(/\s+/g, '-'), productCount: tenant.products.filter(p => p.category === c).length }))
      .slice(0, 3);

    return {
      products,
      categories,
      suggestions: products.map(p => p.name).slice(0, 3),
    };
  }
}

export const searchService = new MockSearchService();
