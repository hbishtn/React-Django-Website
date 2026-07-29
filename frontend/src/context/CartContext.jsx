import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth();

  const fetchCart = () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    fetch('http://127.0.0.1:8000/api/cart/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data.items || []));
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = (product) => {
    fetch('http://127.0.0.1:8000/api/cart/add/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ product_id: product.id }),
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data.items || []));
  };

  const removeFromCart = (itemId) => {
    fetch(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data.items || []));
  };

  const clearCart = () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    fetch('http://127.0.0.1:8000/api/cart/clear/', {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setCartItems(data.items || []));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}