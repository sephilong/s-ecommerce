
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { getTenantConfig } from "@/lib/tenant";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAffiliateStore } from "@/store/affiliateStore";
import { Tenant } from "@/lib/store-data";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const searchParams = useSearchParams();
  const { logClick } = useAffiliateStore();

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
      // 1. Capture metadata
      const ua = navigator.userAgent;
      const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : "Safari";
      const device = /Mobile|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop";
      
      // 2. Log click event
      logClick({
        id: `click-${Date.now()}`,
        code: refCode,
        ip: "Captured on backend", // Simplified for demo
        device: device,
        browser: browser,
        timestamp: new Date().toISOString()
      });

      // 3. Store for attribution (Cookie 30 Days)
      const attribution = {
        code: refCode,
        timestamp: Date.now()
      };
      localStorage.setItem("scomhub_affiliate_ref", JSON.stringify(attribution));
    }
  }, [searchParams, logClick]);

  if (!tenant) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>{`
        :root {
          --primary: ${tenant.primaryColor};
        }
      `}</style>
      
      <Header tenant={tenant} />
      <main className="flex-1">{children}</main>
      <Footer tenant={tenant} />
      <ChatWidget tenant={tenant} />
    </div>
  );
}
