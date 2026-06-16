
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

  // 1. Process Automatic Promotions
  const activePromos = promotions
    .filter(p => p.isActive)
    .sort((a, b) => b.priority - a.priority);

  for (const promo of activePromos) {
    if (promo.type === 'percentage') {
      const { discountPercent, appliesTo, targetIds } = promo.config;
      let promoAmount = 0;

      if (appliesTo === 'order') {
        promoAmount = (subtotal * discountPercent) / 100;
      } else if (appliesTo === 'category') {
        const eligibleItems = items.filter(i => targetIds.includes(i.product.category));
        const eligibleTotal = eligibleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
        promoAmount = (eligibleTotal * discountPercent) / 100;
      }

      if (promoAmount > 0) {
        orderDiscount += promoAmount;
        appliedPromotions.push(promo);
      }
    }

    if (promo.type === 'free_shipping') {
      const { minimumOrderAmount, maxShippingFee } = promo.config;
      if (subtotal >= minimumOrderAmount) {
        shippingDiscount = Math.min(shippingFee, maxShippingFee || Infinity);
        appliedPromotions.push(promo);
      }
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
