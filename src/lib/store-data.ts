import { PlaceHolderImages } from "./placeholder-images";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
};

export type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  logo?: string;
  primaryColor: string;
  products: Product[];
};

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    name: "S-Com Hub Demo Store",
    subdomain: "demo",
    description: "Nền tảng thương mại điện tử đa năng, hỗ trợ Việt Nam.",
    primaryColor: "#9757EA",
    products: [
      {
        id: "p1",
        name: "Smartphone Pro Max",
        slug: "smartphone-pro-max",
        price: 25990000,
        compareAtPrice: 27990000,
        image: PlaceHolderImages[1].imageUrl,
        description: "Điện thoại thông minh mạnh mẽ nhất với hệ thống camera tiên tiến.",
        category: "Điện tử",
        inStock: true
      },
      {
        id: "p2",
        name: "Tai nghe chống ồn Elite",
        slug: "elite-noise-cancelling-headphones",
        price: 6500000,
        image: PlaceHolderImages[2].imageUrl,
        description: "Âm thanh trung thực với công nghệ chống ồn chủ động hàng đầu.",
        category: "Phụ kiện",
        inStock: true
      },
      {
        id: "p3",
        name: "Laptop Air 13-inch",
        slug: "laptop-air-13",
        price: 32900000,
        compareAtPrice: 35000000,
        image: PlaceHolderImages[3].imageUrl,
        description: "Siêu mỏng, siêu nhẹ, hiệu năng vượt trội cho công việc.",
        category: "Điện tử",
        inStock: true
      },
      {
        id: "p4",
        name: "Smart Watch Ultra",
        slug: "smart-watch-ultra",
        price: 18900000,
        image: PlaceHolderImages[4].imageUrl,
        description: "Người bạn đồng hành hoàn hảo cho sức khỏe và luyện tập.",
        category: "Phụ kiện",
        inStock: false
      }
    ]
  }
];

export function getTenantBySubdomain(subdomain: string) {
  return MOCK_TENANTS.find(t => t.subdomain === subdomain) || MOCK_TENANTS[0];
}

export function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}
