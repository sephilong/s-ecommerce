
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import HomePageContent from './(storefront)/page';
import { getTenantConfig } from "@/lib/tenant";
import { headers } from "next/headers";

export default async function RootPage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);

  return (
    <div className="flex flex-col min-h-screen">
      <Header tenant={tenant} />
      <main className="flex-1">
        <HomePageContent />
      </main>
      <Footer tenant={tenant} />
      <ChatWidget tenant={tenant} />
    </div>
  );
}
