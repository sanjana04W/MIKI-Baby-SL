"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, FrameSize, Order, Promotion, Review, OrderStatus, StockStatus } from "@/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_FRAME_SIZES,
  INITIAL_ORDERS,
  INITIAL_PROMOTIONS,
  INITIAL_REVIEWS,
} from "@/lib/initialData";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  frameSizes: FrameSize[];
  orders: Order[];
  promotions: Promotion[];
  reviews: Review[];
  addProduct: (product: Omit<Product, "productId" | "createdAt" | "updatedAt">) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  adjustStock: (productId: string, newStock: number) => void;
  addCategory: (data: Omit<Category, "categoryId">) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  addFrameSize: (data: Omit<FrameSize, "id">) => void;
  updateFrameSize: (id: string, updates: Partial<FrameSize>) => void;
  deleteFrameSize: (id: string) => void;
  createOrder: (orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string, internalNotes?: string) => void;
  addPromotion: (promo: Omit<Promotion, "promoId">) => void;
  togglePromotion: (promoId: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  addReview: (reviewData: {
    productId: string;
    productSlug?: string;
    productName?: string;
    author: string;
    customerId: string;
    customerEmail: string;
    rating: number;
    title?: string;
    comment: string;
  }) => Promise<{ success: boolean; message: string; review?: Review }>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  updateReviewStatus: (reviewId: string, status: "approved" | "rejected" | "pending") => Promise<boolean>;
  refreshReviews: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [frameSizes, setFrameSizes] = useState<FrameSize[]>(INITIAL_FRAME_SIZES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const isLoadedRef = React.useRef(false);
  const isMountedRef = React.useRef(false);

  // Load from localStorage only after client-side hydration completes
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedProds = localStorage.getItem("miki_products");
        const savedOrders = localStorage.getItem("miki_orders");
        const savedPromos = localStorage.getItem("miki_promotions");
        const savedCategories = localStorage.getItem("miki_categories");
        const savedFrameSizes = localStorage.getItem("miki_frame_sizes");

        if (savedProds) {
          const parsed = JSON.parse(savedProds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.productId, p]));
            const merged = parsed.map((p: Product) => {
              const init = initialMap.get(p.productId);
              if (init) {
                return { ...init, ...p, images: init.images, name: init.name, slug: init.slug };
              }
              return p;
            });
            const existingIds = new Set(merged.map((p: Product) => p.productId));
            const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.productId));
            const fullList = [...merged, ...missing];
            setProducts(fullList);
            localStorage.setItem("miki_products", JSON.stringify(fullList));
          }
        } else {
          localStorage.setItem("miki_products", JSON.stringify(INITIAL_PRODUCTS));
        }

        if (savedCategories) {
          const parsed = JSON.parse(savedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        } else {
          localStorage.setItem("miki_categories", JSON.stringify(INITIAL_CATEGORIES));
        }

        if (savedFrameSizes) {
          const parsed = JSON.parse(savedFrameSizes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFrameSizes(parsed);
          }
        } else {
          localStorage.setItem("miki_frame_sizes", JSON.stringify(INITIAL_FRAME_SIZES));
        }

        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        } else {
          localStorage.setItem("miki_orders", JSON.stringify(INITIAL_ORDERS));
        }

        // Fetch centralized orders from server API
        fetch("/api/orders")
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
              setOrders((prev) => {
                const map = new Map(prev.map((o) => [o.orderId, o]));
                data.orders.forEach((o: Order) => map.set(o.orderId, o));
                const merged = Array.from(map.values());
                try {
                  localStorage.setItem("miki_orders", JSON.stringify(merged));
                } catch {}
                return merged;
              });
            }
          })
          .catch(() => {});

        // Fetch centralized reviews from server API
        fetch("/api/reviews/admin")
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.reviews)) {
              setReviews(data.reviews);
            }
          })
          .catch(() => {});

        if (savedPromos) {
          const parsed = JSON.parse(savedPromos);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPromotions(parsed);
          }
        } else {
          localStorage.setItem("miki_promotions", JSON.stringify(INITIAL_PROMOTIONS));
        }
      } catch (e) {
        console.error("Error loading store data from localStorage:", e);
      } finally {
        isLoadedRef.current = true;
        // Delay enabling the automatic save effect so the initial render never wipes stored data
        setTimeout(() => {
          isMountedRef.current = true;
        }, 100);
      }
    };

    loadFromStorage();

    // Listen for storage changes from other tabs / windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "miki_orders" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setOrders(parsed);
        } catch {}
      }
      if (e.key === "miki_products" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {}
      }
      if (e.key === "miki_promotions" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPromotions(parsed);
        } catch {}
      }
      if (e.key === "miki_categories" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCategories(parsed);
        } catch {}
      }
      if (e.key === "miki_frame_sizes" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFrameSizes(parsed);
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist to localStorage whenever state changes, ONLY AFTER initial load has completely settled
  useEffect(() => {
    if (!isMountedRef.current) return;
    try {
      localStorage.setItem("miki_products", JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    try {
      localStorage.setItem("miki_orders", JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    try {
      localStorage.setItem("miki_promotions", JSON.stringify(promotions));
    } catch (e) {
      console.error(e);
    }
  }, [promotions]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    try {
      localStorage.setItem("miki_categories", JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    try {
      localStorage.setItem("miki_frame_sizes", JSON.stringify(frameSizes));
    } catch (e) {
      console.error(e);
    }
  }, [frameSizes]);

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.productId === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.productId === id);
  };

  const getStockStatus = (stock: number): StockStatus => {
    if (stock <= 0) return "out_of_stock";
    if (stock <= 5) return "low_stock";
    return "in_stock";
  };

  const addProduct = (productData: Omit<Product, "productId" | "createdAt" | "updatedAt">): Product => {
    const newId = `miki-prod-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const stockStatus = getStockStatus(productData.stockLevel);

    const newProduct: Product = {
      ...productData,
      productId: newId,
      stockStatus,
      createdAt: now,
      updatedAt: now,
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      try {
        localStorage.setItem("miki_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated: Product[] = prev.map((p) => {
        if (p.productId !== productId) return p;
        const updatedStock = updates.stockLevel !== undefined ? updates.stockLevel : p.stockLevel;
        const stockStatus = updates.stockStatus !== undefined ? updates.stockStatus : getStockStatus(updatedStock);

        return {
          ...p,
          ...updates,
          stockLevel: updatedStock,
          stockStatus,
          updatedAt: new Date().toISOString(),
        };
      });
      try {
        localStorage.setItem("miki_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.productId !== productId);
      try {
        localStorage.setItem("miki_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const adjustStock = (productId: string, newStock: number) => {
    updateProduct(productId, { stockLevel: newStock });
  };

  // ── Category CRUD ──
  const addCategory = (data: Omit<Category, "categoryId">) => {
    const categoryId = `cat-${Date.now().toString().slice(-6)}`;
    const newCat: Category = { ...data, categoryId };
    setCategories((prev) => {
      const updated = [...prev, newCat];
      try { localStorage.setItem("miki_categories", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => c.categoryId === categoryId ? { ...c, ...updates } : c);
      try { localStorage.setItem("miki_categories", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.categoryId !== categoryId);
      try { localStorage.setItem("miki_categories", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // ── Frame Size CRUD ──
  const addFrameSize = (data: Omit<FrameSize, "id">) => {
    const id = `fs-${Date.now().toString().slice(-6)}`;
    const newFs: FrameSize = { ...data, id };
    setFrameSizes((prev) => {
      const updated = [...prev, newFs];
      try { localStorage.setItem("miki_frame_sizes", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const updateFrameSize = (id: string, updates: Partial<FrameSize>) => {
    setFrameSizes((prev) => {
      const updated = prev.map((f) => f.id === id ? { ...f, ...updates } : f);
      try { localStorage.setItem("miki_frame_sizes", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteFrameSize = (id: string) => {
    setFrameSizes((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try { localStorage.setItem("miki_frame_sizes", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const createOrder = (orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt">): Order => {
    const orderId = `MIKI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      orderId,
      createdAt: now,
      updatedAt: now,
    };

    // 1. Read existing orders from localStorage
    let currentOrders: Order[] = [];
    try {
      const stored = localStorage.getItem("miki_orders");
      if (stored) {
        currentOrders = JSON.parse(stored);
      } else {
        currentOrders = orders;
      }
    } catch {
      currentOrders = orders;
    }

    const updatedOrders = [newOrder, ...currentOrders.filter((o) => o.orderId !== orderId)];

    // 2. Persist immediately to localStorage and Server API
    try {
      localStorage.setItem("miki_orders", JSON.stringify(updatedOrders));
    } catch (e) {
      console.error("Failed to write order to localStorage:", e);
    }

    // Centralized server sync
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch((e) => console.warn("Background order sync warning:", e));

    // 3. Decrement stock for ordered items
    orderData.items.forEach((item) => {
      setProducts((prevProds) => {
        const updated: Product[] = prevProds.map((prod) => {
          if (prod.productId === item.productId) {
            const nextStock = Math.max(0, prod.stockLevel - item.quantity);
            const stockStatus = getStockStatus(nextStock);
            return {
              ...prod,
              stockLevel: nextStock,
              stockStatus,
              updatedAt: now,
            };
          }
          return prod;
        });
        try {
          localStorage.setItem("miki_products", JSON.stringify(updated));
        } catch {}
        return updated;
      });
    });

    // 4. Update React state
    setOrders(updatedOrders);

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    reason?: string,
    internalNotes?: string
  ) => {
    let currentOrders: Order[] = [];
    try {
      const stored = localStorage.getItem("miki_orders");
      if (stored) currentOrders = JSON.parse(stored);
      else currentOrders = orders;
    } catch {
      currentOrders = orders;
    }

    const updatedOrders = currentOrders.map((ord) => {
      if (ord.orderId !== orderId) return ord;

      const previousStatus = ord.orderStatus;

      if (newStatus === "Cancelled" && previousStatus !== "Cancelled") {
        ord.items.forEach((item) => {
          setProducts((prevProds) => {
            const restored: Product[] = prevProds.map((prod) => {
              if (prod.productId === item.productId) {
                const restoredStock = prod.stockLevel + item.quantity;
                const stockStatus = getStockStatus(restoredStock);
                return {
                  ...prod,
                  stockLevel: restoredStock,
                  stockStatus,
                };
              }
              return prod;
            });
            try {
              localStorage.setItem("miki_products", JSON.stringify(restored));
            } catch {}
            return restored;
          });
        });
      }

      const paymentStatus = newStatus === "Completed" ? "collected" : ord.paymentStatus;

      return {
        ...ord,
        orderStatus: newStatus,
        paymentStatus,
        cancellationReason: reason || ord.cancellationReason,
        internalNotes: internalNotes || ord.internalNotes,
        updatedAt: new Date().toISOString(),
      };
    });

    try {
      localStorage.setItem("miki_orders", JSON.stringify(updatedOrders));
    } catch (e) {
      console.error(e);
    }

    // Centralized server sync for status
    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        status: newStatus,
        cancellationReason: reason,
        internalNotes,
      }),
    }).catch((e) => console.warn("Background order status sync warning:", e));

    setOrders(updatedOrders);
  };

  const addPromotion = (promoData: Omit<Promotion, "promoId">) => {
    const promoId = `promo-${Date.now().toString().slice(-4)}`;
    const newPromo: Promotion = { ...promoData, promoId };
    setPromotions((prev) => [newPromo, ...prev]);
  };

  const togglePromotion = (promoId: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.promoId === promoId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const refreshReviews = async () => {
    try {
      const res = await fetch("/api/reviews/admin", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.warn("refreshReviews error:", e);
    }
  };

  const addReview = async (reviewData: {
    productId: string;
    productSlug?: string;
    productName?: string;
    author: string;
    customerId: string;
    customerEmail: string;
    rating: number;
    title?: string;
    comment: string;
  }): Promise<{ success: boolean; message: string; review?: Review }> => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev.filter((r) => r.id !== data.review.id)]);
        return { success: true, message: data.message, review: data.review };
      }
      return { success: false, message: data.message || "Failed to submit review." };
    } catch {
      return { success: false, message: "Network error submitting review." };
    }
  };

  const updateReviewStatus = async (
    reviewId: string,
    status: "approved" | "rejected" | "pending"
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/reviews/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reviewId, status }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/admin?id=${encodeURIComponent(reviewId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        frameSizes,
        orders,
        promotions,
        reviews,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addFrameSize,
        updateFrameSize,
        deleteFrameSize,
        createOrder,
        updateOrderStatus,
        addPromotion,
        togglePromotion,
        getProductBySlug,
        getProductById,
        addReview,
        deleteReview,
        updateReviewStatus,
        refreshReviews,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
