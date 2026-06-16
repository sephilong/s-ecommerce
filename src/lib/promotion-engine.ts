
import { CartItem } from "@/store/cartStore";
import { Promotion, Coupon } from "./store-data";

export interface DiscountResult {
  totalDiscount: number;
  shippingDiscount: number;
  orderDiscount: number;
  appliedPromotions: Promotion[];
  appliedCoupon?: Coupon;
}

export function calculateDiscount(
  items: CartItem[], 
  shippingFee: number, 
  promotions: Promotion[], 
  coupon?: Coupon
): DiscountResult {
  let orderDiscount = 0;
  let shippingDiscount = 0;
  const appliedPromotions: Promotion[] = [];
  
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // 1. Process Automatic Promotions (Sorted by Priority)
  const activePromos = promotions
    .filter(p => p.isActive)
    .sort((a, b) => b.priority - a.priority);

  for (const promo of activePromos) {
    let promoAmount = 0;

    switch (promo.type) {
      case 'percentage': {
        const { discountPercent, maxDiscountAmount, appliesTo, targetIds } = promo.config;
        if (appliesTo === 'order') {
          promoAmount = (subtotal * discountPercent) / 100;
          if (maxDiscountAmount) promoAmount = Math.min(promoAmount, maxDiscountAmount);
        } else if (appliesTo === 'category') {
          const eligibleItems = items.filter(i => targetIds.some((id: string) => i.product.category.toLowerCase().includes(id.toLowerCase())));
          const eligibleTotal = eligibleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
          promoAmount = (eligibleTotal * discountPercent) / 100;
          if (maxDiscountAmount) promoAmount = Math.min(promoAmount, maxDiscountAmount);
        } else if (appliesTo === 'product') {
          const eligibleItems = items.filter(i => targetIds.includes(i.product.id) || targetIds.includes(i.product.slug));
          const eligibleTotal = eligibleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
          promoAmount = (eligibleTotal * discountPercent) / 100;
          if (maxDiscountAmount) promoAmount = Math.min(promoAmount, maxDiscountAmount);
        }
        break;
      }

      case 'fixed_amount': {
        const { discountAmount, minimumOrderAmount, appliesTo, targetIds } = promo.config;
        if (subtotal >= (minimumOrderAmount || 0)) {
          if (appliesTo === 'order' || !targetIds || targetIds.length === 0) {
            promoAmount = discountAmount;
          } else {
            // Check if cart contains any target products/categories
            const hasTarget = items.some(i => 
              appliesTo === 'category' ? targetIds.some((id: string) => i.product.category.includes(id)) : targetIds.includes(i.product.id)
            );
            if (hasTarget) promoAmount = discountAmount;
          }
        }
        break;
      }

      case 'buy_x_get_y': {
        const { buyQuantity, getQuantity, applicableProductIds, getDiscount } = promo.config;
        if (!applicableProductIds || applicableProductIds.length === 0) break;

        const eligibleItems = items.filter(i => applicableProductIds.includes(i.product.id));
        const totalQty = eligibleItems.reduce((acc, i) => acc + i.quantity, 0);
        
        if (totalQty >= buyQuantity) {
          const timesApplied = Math.floor(totalQty / buyQuantity);
          const freeUnits = timesApplied * getQuantity;
          const cheapestItem = [...eligibleItems].sort((a, b) => a.product.price - b.product.price)[0];
          if (cheapestItem) {
            promoAmount = (cheapestItem.product.price * freeUnits * (getDiscount || 100)) / 100;
          }
        }
        break;
      }

      case 'bundle': {
        const { bundleProductIds, discountValue, discountType, requireAll } = promo.config;
        if (!bundleProductIds || bundleProductIds.length === 0) break;

        const cartProductIds = items.map(i => i.product.id);
        const hasBundle = requireAll 
          ? bundleProductIds.every((id: string) => cartProductIds.includes(id))
          : bundleProductIds.some((id: string) => cartProductIds.includes(id));

        if (hasBundle) {
          const bundleItems = items.filter(i => bundleProductIds.includes(i.product.id));
          const bundleTotal = bundleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
          promoAmount = discountType === 'percent' ? (bundleTotal * discountValue) / 100 : discountValue;
        }
        break;
      }

      case 'flash_sale': {
        const { products } = promo.config;
        if (!products) break;
        
        items.forEach(item => {
          const saleProduct = products.find((p: any) => p.productId === item.product.id);
          if (saleProduct) {
            promoAmount += (item.product.price - saleProduct.salePrice) * item.quantity;
          }
        });
        break;
      }

      case 'free_shipping': {
        const { minimumOrderAmount, maxShippingFee } = promo.config;
        if (subtotal >= (minimumOrderAmount || 0)) {
          shippingDiscount = Math.min(shippingFee, maxShippingFee || Infinity);
        }
        break;
      }
    }

    if (promoAmount > 0 || (promo.type === 'free_shipping' && shippingDiscount > 0)) {
      orderDiscount += promoAmount;
      appliedPromotions.push(promo);
    }
  }

  // 2. Process Coupon
  let finalAppliedCoupon: Coupon | undefined = undefined;
  if (coupon && coupon.isActive) {
    const minOrder = coupon.minOrderAmount || 0;
    if (subtotal >= minOrder) {
      let couponAmount = 0;
      if (coupon.discountType === 'percent') {
        couponAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
          couponAmount = Math.min(couponAmount, coupon.maxDiscountAmount);
        }
      } else if (coupon.discountType === 'fixed') {
        couponAmount = coupon.discountValue;
      } else if (coupon.discountType === 'free_shipping') {
        shippingDiscount = shippingFee;
      }

      orderDiscount += couponAmount;
      finalAppliedCoupon = coupon;
    }
  }

  return {
    totalDiscount: orderDiscount + shippingDiscount,
    shippingDiscount,
    orderDiscount,
    appliedPromotions,
    appliedCoupon: finalAppliedCoupon
  };
}
