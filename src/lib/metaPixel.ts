// Meta / Facebook Pixel helper functions

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "123456789012345";

export const pageView = () => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "PageView");
  }
};

export const trackEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, options);
  } else {
    console.log(`[Meta Pixel Event] ${name}:`, options);
  }
};

export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
}) => {
  trackEvent("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: "LKR",
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price * product.quantity,
    currency: "LKR",
  });
};

export const trackInitiateCheckout = (total: number, itemsCount: number) => {
  trackEvent("InitiateCheckout", {
    num_items: itemsCount,
    value: total,
    currency: "LKR",
  });
};

export const trackPurchase = (orderId: string, total: number, itemsCount: number) => {
  trackEvent("Purchase", {
    content_type: "product",
    num_items: itemsCount,
    value: total,
    currency: "LKR",
    order_id: orderId,
  });
};
