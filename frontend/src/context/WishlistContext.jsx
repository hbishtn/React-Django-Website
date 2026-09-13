import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();
const STORAGE_KEY = 'bisht_wishlist';

// Wishlist ke liye abhi koi backend model nahi hai, isliye simplest/safe
// tareeka: browser ke localStorage mein save karo. Isse refresh/dobara aane
// pe bhi wishlist yaad rehti hai (lekin sirf isi browser mein, doosre device
// pe sync nahi hoga — agar future mein cross-device chahiye ho to backend
// model add karna padega).
export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // storage full ya disabled ho to bhi app crash na ho
    }
  }, [wishlistItems]);

  const isWishlisted = (productId) => wishlistItems.some((p) => p.id === productId);

  const toggleWishlist = (product) => {
    setWishlistItems((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}