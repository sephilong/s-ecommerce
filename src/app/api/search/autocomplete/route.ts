
import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/services/search/mock-search.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const tenantId = searchParams.get('tenantId') || 'platform-1';

  const result = await searchService.autocomplete(query, tenantId);

  return NextResponse.json({ success: true, data: result });
}
