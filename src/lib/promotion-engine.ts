
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
    const { config } = promo;

    // Helper to check if any cart items match the target criteria
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
        if (!applicableProductIds || applicableProductIds.length === 0) break;

        const buyItems = items.filter(i => applicableProductIds.includes(i.product.id));
        const totalBuyQty = buyItems.reduce((acc, i) => acc + i.quantity, 0);
        
        if (totalBuyQty >= buyQuantity) {
          const timesApplied = Math.floor(totalBuyQty / buyQuantity);
          const freeUnits = timesApplied * getQuantity;
          
          // If specific gift products are defined, we check if they are in cart
          if (giftProductIds && giftProductIds.length > 0) {
            const giftItemsInCart = items.filter(i => giftProductIds.includes(i.product.id));
            if (giftItemsInCart.length > 0) {
              // Apply discount to the gifts already in cart
              const giftTotal = giftItemsInCart.reduce((acc, i) => acc + (i.product.price * Math.min(i.quantity, freeUnits)), 0);
              promoAmount = (giftTotal * (getDiscount || 100)) / 100;
            }
          } else {
            // Otherwise, free units from the buy list (cheapest ones)
            const cheapestItem = [...buyItems].sort((a, b) => a.product.price - b.product.price)[0];
            if (cheapestItem) {
              promoAmount = (cheapestItem.product.price * freeUnits * (getDiscount || 100)) / 100;
            }
          }
        }
        break;
      }

      case 'bundle': {
        const { bundleProductIds, discountValue, discountType, requireAll } = config;
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
        const { products } = config;
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
        const eligibleItems = getEligibleItems();
        if (eligibleItems.length > 0 && subtotal >= (config.minimumOrderAmount || 0)) {
          shippingDiscount = Math.min(shippingFee, config.maxShippingFee || Infinity);
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
