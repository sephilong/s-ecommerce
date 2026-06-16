
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { CompareBar } from "@/components/product/CompareBar";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { getTenantConfig } from "@/lib/tenant";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { Tenant } from "@/lib/store-data";
import HomePageContent from "./(storefront)/page-content";
import React from "react";

export default function RootHomePage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const { themes, platformThemeId } = useThemeStore();

  useEffect(() => {
    const fetchData = async () => {
      const config = await getTenantConfig("demo");
      setTenant(config);
    };
    fetchData();
  }, []);

  if (!tenant) return <div className="h-screen flex items-center justify-center font-black italic animate-pulse text-primary tracking-tighter text-2xl">BOOTING S-COM HUB...</div>;
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
      <main className="flex-1">
        <HomePageContent />
      </main>
      <Footer tenant={tenant} />
      <ChatWidget tenant={tenant} />
      <CompareBar />
    </div>
  );
}
