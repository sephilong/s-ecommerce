
import { Product } from "@/lib/store-data";

export interface SearchService {
  search(params: SearchParams): Promise<SearchResult>;
  autocomplete(query: string, tenantId: string): Promise<AutocompleteResult>;
}

export interface SearchParams {
  tenantId: string;
  query: string;
  page?: number;
  limit?: number;
  filters?: {
    categoryIds?: string[];
    brandIds?: string[];
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    onSale?: boolean;
    attributes?: Record<string, string[]>;
    rating?: number;
  };
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_selling' | 'rating';
  facets?: boolean;
}

export interface SearchResult {
  hits: any[];
  total: number;
  page: number;
  limit: number;
  facets?: any;
  processingTime: number;
  query: string;
}

export interface AutocompleteResult {
  products: any[];
  categories: any[];
  suggestions: string[];
}
