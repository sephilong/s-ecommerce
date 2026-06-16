
/**
 * HỆ THỐNG ĐA NGÔN NGỮ (Multi-language Support)
 * Hỗ trợ Tiếng Việt (Default) và Tiếng Anh.
 */

export type Locale = 'vi' | 'en';

const dictionaries = {
  vi: {
    common: {
      cart: 'Giỏ hàng',
      checkout: 'Thanh toán',
      home: 'Trang chủ',
      products: 'Sản phẩm',
      search: 'Tìm kiếm',
      account: 'Tài khoản',
      buy_now: 'Mua ngay',
      add_to_cart: 'Thêm vào giỏ',
    },
    checkout: {
      title: 'Thanh toán an toàn',
      secure_info: 'Mọi giao dịch được bảo mật bởi chuẩn PCI DSS.',
      payment_method: 'Phương thức thanh toán',
      order_summary: 'Tóm tắt đơn hàng',
      place_order: 'Xác nhận đặt hàng',
    }
  },
  en: {
    common: {
      cart: 'Cart',
      checkout: 'Checkout',
      home: 'Home',
      products: 'Products',
      search: 'Search',
      account: 'Account',
      buy_now: 'Buy Now',
      add_to_cart: 'Add to Cart',
    },
    checkout: {
      title: 'Secure Checkout',
      secure_info: 'All transactions are secured with PCI DSS standards.',
      payment_method: 'Payment Method',
      order_summary: 'Order Summary',
      place_order: 'Complete Purchase',
    }
  }
};

export const getDictionary = (locale: Locale = 'vi') => dictionaries[locale];
