
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { getTenantConfig } from "@/lib/tenant";
import { useEffect, useState } from "react";
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
  const searchParams = useSearchParams();
  const { logClick } = useAffiliateStore();
  const { themes, platformThemeId } = useThemeStore();

  useEffect(() => {
    const fetchData = async () => {
      const host = window.location.host;
      const subdomain = host.split('.')[0] || "demo";
      const config = await getTenantConfig(subdomain);
      setTenant(config);
    };
    fetchData();

    // Attribution Logic: Click Tracking
    const refCode = searchParams.get("ref");
    if (refCode) {
      const ua = navigator.userAgent;
      const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : "Safari";
      const device = /Mobile|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop";
      
      logClick({
        id: `click-${Date.now()}`,
        code: refCode,
        ip: "Captured on backend",
        device: device,
        browser: browser,
        timestamp: new Date().toISOString()
      });

      const attribution = { code: refCode, timestamp: Date.now() };
      localStorage.setItem("scomhub_affiliate_ref", JSON.stringify(attribution));
    }
  }, [searchParams, logClick]);

  if (!tenant) return null;

  // Lấy cấu hình theme hiện tại của Platform
  const currentTheme = themes.find(t => t.id === platformThemeId);

  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
  );
}
