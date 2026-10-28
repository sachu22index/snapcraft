import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Product, PRODUCTS } from "@/data/products";

export interface CartItem {
  id: string; // unique item id (could be product id or builder item id)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  packagingStyle?: string | undefined;
  giftMessage?: string | undefined;
  customDetails?: string | undefined;
}

export interface OrderDetails {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  deliveryDate: string;
  deliverySlot: string;
  giftNote?: string;
  paymentMethod: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  orderSuccess: OrderDetails | null;
  setOrderSuccess: (order: OrderDetails | null) => void;

  // Actions
  addToCart: (
    product: Product,
    quantity?: number,
    options?: { packagingStyle?: string; giftMessage?: string; customDetails?: string },
  ) => void;
  addCustomItemToCart: (customItem: {
    name: string;
    price: number;
    image: string;
    quantity: number;
    packagingStyle?: string;
    giftMessage?: string;
    customDetails?: string;
  }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Calculations
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartFinalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage safely
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("snapcraft_cart");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default starter items for instant pleasant demo
    return [
      {
        id: "item-default-1",
        productId: "bloom-and-bliss",
        name: "Bloom & Bliss Hamper",
        price: 3499,
        image: PRODUCTS[0]?.image ?? "",
        quantity: 1,
        packagingStyle: "Signature Wicker Hamper",
        giftMessage: "With all my love on your special day!",
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("snapcraft_wishlist");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ["chocolate-love-box", "anniversary-memories-hamper"];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<OrderDetails | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("WELCOME10");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("snapcraft_cart", JSON.stringify(cart));
      } catch (e) {
        console.error(e);
      }
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("snapcraft_wishlist", JSON.stringify(wishlist));
      } catch (e) {
        console.error(e);
      }
    }
  }, [wishlist]);

  const addToCart = (
    product: Product,
    quantity = 1,
    options?: { packagingStyle?: string; giftMessage?: string; customDetails?: string },
  ) => {
    setCart((prev) => {
      // If same product without unique custom message exists, increment
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && !options?.giftMessage && !options?.customDetails,
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        const existing = copy[existingIdx];
        if (existing) {
          existing.quantity += quantity;
        }
        return copy;
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          packagingStyle: options?.packagingStyle || "Signature SnapCraft Packaging",
          giftMessage: options?.giftMessage,
          customDetails: options?.customDetails,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const addCustomItemToCart = (customItem: {
    name: string;
    price: number;
    image: string;
    quantity: number;
    packagingStyle?: string;
    giftMessage?: string;
    customDetails?: string;
  }) => {
    setCart((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: "custom-builder-hamper",
        ...customItem,
      },
    ]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const wishlistCount = wishlist.length;

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  // Free shipping over 1999
  const shippingFee = cartSubtotal > 1999 || cartSubtotal === 0 ? 0 : 150;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0) return 0;
    if (appliedCoupon.toUpperCase() === "WELCOME10") return Math.round(cartSubtotal * 0.1);
    if (appliedCoupon.toUpperCase() === "SNAPCRAFTLOVE")
      return Math.min(500, Math.round(cartSubtotal * 0.15));
    if (appliedCoupon.toUpperCase() === "FIRSTGIFT") return 200;
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartFinalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "WELCOME10" || trimmed === "SNAPCRAFTLOVE" || trimmed === "FIRSTGIFT") {
      setAppliedCoupon(trimmed);
      return { success: true, message: `Promo code "${trimmed}" applied successfully!` };
    }
    return { success: false, message: "Invalid promo code. Try WELCOME10 or SNAPCRAFTLOVE." };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        orderSuccess,
        setOrderSuccess,
        addToCart,
        addCustomItemToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        wishlistCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
