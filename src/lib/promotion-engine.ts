
import { CartItem } from "@/store/cartStore";
import { Promotion, Coupon } from "./store-data";

export interface DiscountResult {
  totalDiscount: number;
  shippingDiscount: number;
  orderDiscount: number;
  appliedPromotions: Promotion[];
  appliedCoupon?: Coupon;
  loyaltyMultiplier: number;
  potentialPoints: number;
}

export function calculateDiscount(
  items: CartItem[], 
  shippingFee: number, 
  promotions: Promotion[], 
  coupon?: Coupon,
  orderHistoryCount: number = 0,
  loyaltyBaseRate: number = 10000
): DiscountResult {
  let orderDiscount = 0;
  let shippingDiscount = 0;
  let loyaltyMultiplier = 1;
  const appliedPromotions: Promotion[] = [];
  
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // 1. Process Automatic Promotions (Sorted by Priority)
  const activePromos = promotions
    .filter(p => {
      if (!p.isActive) return false;
      const now = new Date();
      if (p.startsAt && new Date(p.startsAt) > now) return false;
      if (p.expiresAt && new Date(p.expiresAt) < now) return false;
      return true;
    })
    .sort((a, b) => b.priority - a.priority);

  for (const promo of activePromos) {
    let promoAmount = 0;
    const { config } = promo;

    const getEligibleItems = () => {
      const { appliesTo, targetIds } = config;
      if (appliesTo === 'order' || !targetIds || targetIds.length === 0) return items;
      if (appliesTo === 'category') {
        return items.filter(i => targetIds.some((id: string) => i.product.category.toLowerCase().includes(id.toLowerCase())));
      }
      if (appliesTo === 'product') {
        return items.filter(i => targetIds.includes(i.product.id) || targetIds.includes(i.product.slug));
      }
      return [];
    };

    switch (promo.type) {
      case 'percentage': {
        const eligibleItems = getEligibleItems();
        if (eligibleItems.length > 0) {
          const eligibleTotal = eligibleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
          promoAmount = (eligibleTotal * config.discountPercent) / 100;
          if (config.maxDiscountAmount) promoAmount = Math.min(promoAmount, config.maxDiscountAmount);
        }
        break;
      }

      case 'fixed_amount': {
        const eligibleItems = getEligibleItems();
        if (eligibleItems.length > 0 && subtotal >= (config.minimumOrderAmount || 0)) {
          promoAmount = config.discountAmount;
        }
        break;
      }

      case 'buy_x_get_y': {
        const { buyQuantity, getQuantity, applicableProductIds, giftProductIds, getDiscount } = config;
        const buyItems = items.filter(i => applicableProductIds?.includes(i.product.id));
        const totalBuyQty = buyItems.reduce((acc, i) => acc + i.quantity, 0);
        if (totalBuyQty >= buyQuantity) {
          const timesApplied = Math.floor(totalBuyQty / buyQuantity);
          const freeUnits = timesApplied * getQuantity;
          if (giftProductIds && giftProductIds.length > 0) {
            const giftsInCart = items.filter(i => giftProductIds.includes(i.product.id));
            const giftValue = giftsInCart.reduce((acc, i) => acc + (i.product.price * Math.min(i.quantity, freeUnits)), 0);
            promoAmount = (giftValue * (getDiscount || 100)) / 100;
          } else {
            const cheapest = [...buyItems].sort((a, b) => a.product.price - b.product.price)[0];
            if (cheapest) promoAmount = (cheapest.product.price * freeUnits * (getDiscount || 100)) / 100;
          }
        }
        break;
      }

      case 'bundle': {
        const { bundleProductIds, discountValue, discountType, requireAll } = config;
        const cartProductIds = items.map(i => i.product.id);
        const hasBundle = requireAll 
          ? bundleProductIds?.every((id: string) => cartProductIds.includes(id))
          : bundleProductIds?.some((id: string) => cartProductIds.includes(id));
        if (hasBundle) {
          const bundleItems = items.filter(i => bundleProductIds.includes(i.product.id));
          const bundleTotal = bundleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
          promoAmount = discountType === 'percent' ? (bundleTotal * discountValue) / 100 : discountValue;
        }
        break;
      }

      case 'tiered': {
        const { tiers, targetIds, appliesTo } = config;
        const eligibleItems = getEligibleItems();
        const totalQty = eligibleItems.reduce((acc, i) => acc + i.quantity, 0);
        const applicableTier = [...tiers].sort((a, b) => b.minimumQuantity - a.minimumQuantity)
                                          .find(t => totalQty >= t.minimumQuantity);
        if (applicableTier) {
          const eligibleTotal = eligibleItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
          promoAmount = (eligibleTotal * applicableTier.discountPercent) / 100;
        }
        break;
      }

      case 'flash_sale': {
        items.forEach(item => {
          const saleProduct = config.products?.find((p: any) => p.productId === item.product.id);
          if (saleProduct) promoAmount += (item.product.price - saleProduct.salePrice) * item.quantity;
        });
        break;
      }

      case 'free_shipping': {
        if (subtotal >= (config.minimumOrderAmount || 0)) {
          shippingDiscount = Math.min(shippingFee, config.maxShippingFee || Infinity);
        }
        break;
      }

      case 'loyalty_multiplier': {
        loyaltyMultiplier = Math.max(loyaltyMultiplier, config.pointsMultiplier || 1);
        break;
      }

      case 'first_order': {
        if (orderHistoryCount === 0) {
          if (config.discountType === 'percent') promoAmount = (subtotal * config.discountValue) / 100;
          else promoAmount = config.discountValue;
        }
        break;
      }
    }

    if (promoAmount > 0 || (promo.type === 'free_shipping' && shippingDiscount > 0) || promo.type === 'loyalty_multiplier') {
      orderDiscount += promoAmount;
      appliedPromotions.push(promo);
    }
  }

  // 2. Process Coupon
  let finalAppliedCoupon: Coupon | undefined = undefined;
  if (coupon && coupon.isActive) {
    if (subtotal >= (coupon.minOrderAmount || 0)) {
      let couponAmount = 0;
      if (coupon.discountType === 'percent') couponAmount = (subtotal * coupon.discountValue) / 100;
      else if (coupon.discountType === 'fixed') couponAmount = coupon.discountValue;
      else if (coupon.discountType === 'free_shipping') shippingDiscount = shippingFee;
      
      if (coupon.maxDiscountAmount) couponAmount = Math.min(couponAmount, coupon.maxDiscountAmount);
      orderDiscount += couponAmount;
      finalAppliedCoupon = coupon;
    }
  }

  const finalTotal = subtotal - orderDiscount;
  const potentialPoints = Math.floor((finalTotal / loyaltyBaseRate) * loyaltyMultiplier);

  return {
    totalDiscount: orderDiscount + shippingDiscount,
    shippingDiscount,
    orderDiscount,
    appliedPromotions,
    appliedCoupon: finalAppliedCoupon,
    loyaltyMultiplier,
    potentialPoints
  };
}
