
import { Metadata } from "next";
import HomePageContent from "./(storefront)/page-content";
import { getTenantConfig } from "@/lib/tenant";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { CompareBar } from "@/components/product/CompareBar";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { ThemeStyle } from "@/components/layout/ThemeStyle";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteJsonLd, organizationJsonLd } from "@/lib/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig("demo");
  const url = 'https://scomhub.vn';

  return {
    title: `${tenant.name} | Hệ sinh thái Thương mại Điện tử hiện đại`,
    description: tenant.description,
    verification: {
      google: tenant.googleEcosystem.searchConsoleVerificationCode,
    },
    openGraph: {
      title: tenant.name,
      description: tenant.description,
      url: url,
      siteName: 'S-Com Hub',
      images: [
        {
          url: 'https://picsum.photos/seed/scom/1200/630',
          width: 1200,
          height: 630,
          alt: 'S-Com Hub Platform',
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tenant.name,
      description: tenant.description,
      images: ['https://picsum.photos/seed/scom/1200/630'],
    },
    other: {
      'zalo:og:url': url
    }
  };
}

/**
 * TRANG CHỦ CHÍNH THỨC (Server Component)
 * Hỗ trợ SEO tốt nhất và tích hợp Social Commerce.
 */
export default async function LandingPage() {
  const tenant = await getTenantConfig("demo");

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={websiteJsonLd(tenant)} />
      <JsonLd data={organizationJsonLd(tenant)} />
      
      <AnalyticsTracker />
      <ThemeStyle primaryColor={tenant.primaryColor} />
      
      <Header tenant={tenant} />
      <main className="flex-1">
        <HomePageContent />
      </main>
      <Footer tenant={tenant} />
      <ChatWidget tenant={tenant} />
      <CompareBar />
    </div>
  );
}
