
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentMethod, ShippingMethod, Banner, MOCK_TENANTS } from '@/lib/store-data';

interface ConfigState {
  paymentMethods: PaymentMethod[];
  shippingMethods: ShippingMethod[];
  banners: Banner[];
  storeName: string;
  storeDescription: string;
  updatePaymentMethods: (methods: PaymentMethod[]) => void;
  updatePaymentConfig: (id: string, config: any) => void;
  togglePaymentMethod: (id: string, active: boolean) => void;
  updateShippingMethods: (methods: ShippingMethod[]) => void;
  updateBanners: (banners: Banner[]) => void;
  updateStoreInfo: (name: string, description: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      paymentMethods: MOCK_TENANTS[0].paymentMethods,
      shippingMethods: MOCK_TENANTS[0].shippingMethods,
      banners: MOCK_TENANTS[0].banners,
      storeName: MOCK_TENANTS[0].name,
      storeDescription: MOCK_TENANTS[0].description,
      
      updatePaymentMethods: (paymentMethods) => set({ paymentMethods }),
      
      updatePaymentConfig: (id, config) => set((state) => ({
        paymentMethods: state.paymentMethods.map(pm => pm.id === id ? { ...pm, config: { ...pm.config, ...config } } : pm)
      })),

      togglePaymentMethod: (id, isActive) => set((state) => ({
        paymentMethods: state.paymentMethods.map(pm => pm.id === id ? { ...pm, isActive } : pm)
      })),

      updateShippingMethods: (shippingMethods) => set({ shippingMethods }),
      updateBanners: (banners) => set({ banners }),
      updateStoreInfo: (storeName, storeDescription) => set({ storeName, storeDescription }),
    }),
    {
      name: 'scomhub-config-storage-v2',
    }
  )
);
