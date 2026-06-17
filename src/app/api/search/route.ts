
import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/services/search/mock-search.service';
import { SearchParams } from '@/services/search/search.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const params: SearchParams = {
    tenantId: searchParams.get('tenantId') || 'platform-1',
    query: searchParams.get('q') || '',
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 20),
    sort: (searchParams.get('sort') as any) || 'relevance',
    facets: searchParams.get('facets') === 'true',
    filters: {
      categoryIds: searchParams.getAll('category'),
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      inStock: searchParams.get('inStock') === 'true',
    }
  };

  const result = await searchService.search(params);

  return NextResponse.json({ success: true, data: result });
}
