
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TENANTS } from '@/lib/store-data';

export async function GET(req: NextRequest) {
  const tenant = MOCK_TENANTS[0];
  const products = tenant.products;
  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;

  let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${tenant.storeName}</title>
    <link>${baseUrl}</link>
    <description>${tenant.description}</description>`;

  products.forEach(p => {
    xml += `
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${p.name}</g:title>
      <g:description>${p.shortDescription || p.description}</g:description>
      <g:link>${baseUrl}/products/${p.slug}</g:link>
      <g:image_link>${p.image}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.inStock ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${p.price} VND</g:price>
      <g:brand>${p.brand?.name || tenant.storeName}</g:brand>
      <g:mpn>${p.sku || p.id}</g:mpn>
      <g:product_type>${p.category}</g:product_type>
      <g:shipping_country>VN</g:shipping_country>
    </item>`;
  });

  xml += `
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
