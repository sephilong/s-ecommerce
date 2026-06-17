
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FacebookSDK } from '@/components/social/FacebookSDK';
import { MetaPixel } from '@/components/social/MetaPixel';
import { ZaloChatWidget } from '@/components/social/ZaloChatWidget';
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager';
import { WebVitals } from '@/components/analytics/WebVitals';
import { MOCK_TENANTS } from '@/lib/store-data';
import { organizationJsonLd } from '@/lib/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const viewport: Viewport = {
  themeColor: '#9757EA',
  width: 'device-width',
  initialScale: 1,
};

const tenant = MOCK_TENANTS[0];

export const metadata: Metadata = {
  title: {
    default: 'S-Com Hub | Nền tảng Thương mại Điện tử Đa chi nhánh',
    template: '%s | S-Com Hub'
  },
  description: 'S-Com Hub cung cấp giải pháp bán hàng hiện đại, đa vendor với công nghệ tối ưu và trải nghiệm người dùng cao cấp.',
  keywords: ['ecommerce', 'multi-vendor', 'vietnam retail', 'tech shop', 'scomhub'],
  authors: [{ name: 'S-Com Team' }],
  creator: 'S-Com Hub Platform',
  publisher: 'S-Com Hub',
  metadataBase: new URL('https://demo.scomhub.vn'),
  verification: {
    google: tenant.googleEcosystem.searchConsoleVerificationCode,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://scomhub.vn',
    siteName: 'S-Com Hub',
    images: [
      {
        url: 'https://picsum.photos/seed/scom/1200/630',
        width: 1200,
        height: 630,
        alt: 'S-Com Hub Platform Preview',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const social = tenant.socialCommerce;
  const google = tenant.googleEcosystem;

  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <JsonLd data={organizationJsonLd(tenant)} />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary">
        <GoogleTagManager gtmId={google.gtmContainerId || ''} />
        <WebVitals ga4Id={google.ga4MeasurementId} />
        {children}
        <Toaster />
        <FacebookSDK appId={social.facebookAppId || ''} />
        <MetaPixel pixelId={social.facebookPixelId || ''} />
        <ZaloChatWidget oaId={social.zaloOaId} />
      </body>
    </html>
  );
}
