
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { CompareBar } from "@/components/product/CompareBar";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { getTenantConfig } from "@/lib/tenant";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAffiliateStore } from "@/store/affiliateStore";
import { useThemeStore } from "@/store/themeStore";
import { Tenant } from "@/lib/store-data";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const { logClick } = useAffiliateStore();
  const { themes, platformThemeId } = useThemeStore();

  return (
    <Suspense fallback={null}>
      <LayoutContent 
        tenant={tenant} 
        setTenant={setTenant} 
        logClick={logClick} 
        themes={themes} 
        platformThemeId={platformThemeId}
      >
        {children}
      </LayoutContent>
    </Suspense>
  );
}

function LayoutContent({ children, tenant, setTenant, logClick, themes, platformThemeId }: any) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const host = window.location.host;
      const subdomain = host.split('.')[0] || "demo";
      const config = await getTenantConfig(subdomain);
      setTenant(config);
    };
    fetchData();

    const refCode = searchParams.get("ref");
    if (refCode) {
      logClick({
        id: `click-${Date.now()}`,
        code: refCode,
        ip: "Captured on backend",
        device: "Desktop",
        browser: "Chrome",
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("scomhub_affiliate_ref", JSON.stringify({ code: refCode, timestamp: Date.now() }));
    }
  }, [searchParams, logClick, setTenant]);

  if (!tenant) return null;
  const currentTheme = themes.find((t: any) => t.id === platformThemeId);

  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticsTracker />
      <style jsx global>{`
        :root {
          --primary: ${currentTheme?.config.primaryColor || tenant.primaryColor};
          --radius: ${currentTheme?.config.borderRadius || '0.75rem'};
        }
      `}</style>
      
      <Header tenant={tenant} />
      <main className="flex-1">{children}</main>
      <Footer tenant={tenant} />
      <ChatWidget tenant={tenant} />
      <CompareBar />
    </div>
  );
}
