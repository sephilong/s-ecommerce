
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
  const { incrementClick } = useAffiliateStore();

  useEffect(() => {
    const fetchData = async () => {
      // Resolve subdomain from current host
      const host = window.location.host;
      const subdomain = host.split('.')[0] || "demo";
      const config = await getTenantConfig(subdomain);
      setTenant(config);
    };
    fetchData();

    // Attribution Logic: Catch ?ref= in URL for Product Affiliate
    const refCode = searchParams.get("ref");
    if (refCode) {
      const attribution = {
        code: refCode,
        timestamp: Date.now()
      };
      localStorage.setItem("scomhub_affiliate_ref", JSON.stringify(attribution));
      incrementClick(refCode);
    }
  }, [searchParams]);

  if (!tenant) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Inject Tenant Branding Colors */}
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
