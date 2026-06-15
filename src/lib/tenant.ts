
import { MOCK_TENANTS, Tenant } from "./store-data";

/**
 * Utility to resolve tenant based on hostname/subdomain.
 */
export async function getTenantConfig(subdomain: string): Promise<Tenant> {
  // In a real app, this would query Firestore or a cache
  const tenant = MOCK_TENANTS.find(t => t.subdomain === subdomain);
  if (!tenant) return MOCK_TENANTS[0];
  return tenant;
}

export function getSubdomain(host: string | null): string {
  if (!host) return "demo";
  const parts = host.split('.');
  if (parts.length > 2) return parts[0];
  return "demo";
}
