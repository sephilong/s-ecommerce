
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FacebookSDK } from '@/components/social/FacebookSDK';
import { MetaPixel } from '@/components/social/MetaPixel';
import { ZaloChatWidget } from '@/components/social/ZaloChatWidget';
import { MOCK_TENANTS } from '@/lib/store-data';

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
  twitter: {
    card: 'summary_large_image',
    title: 'S-Com Hub | Modern Ecommerce',
    description: 'Bứt phá doanh thu cùng hệ sinh thái S-Com Hub.',
    images: ['https://picsum.photos/seed/scom/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const social = tenant.socialCommerce;

  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary">
        {children}
        <Toaster />
        <FacebookSDK appId={social.facebookAppId || ''} />
        <MetaPixel pixelId={social.facebookPixelId || ''} />
        <ZaloChatWidget oaId={social.zaloOaId} />
      </body>
    </html>
  );
}
