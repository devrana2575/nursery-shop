import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'nursery_cart';
const CartContext = createContext(null);

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((plant, quantity = 1) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.plantId === plant._id);
      const maxStock = Number.isFinite(plant.stock) ? plant.stock : Infinity;

      if (existing) {
        return previous.map((item) =>
          item.plantId === plant._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxStock) }
            : item
        );
      }

      return [
        ...previous,
        {
          plantId: plant._id,
          name: plant.name,
          price: plant.price,
          image: plant.image,
          stock: plant.stock,
          quantity: Math.min(quantity, maxStock),
        },
      ];
    });
  }, []);

  const updateQty = useCallback((plantId, quantity) => {
    setCart((previous) => {
      if (quantity < 1) return previous.filter((item) => item.plantId !== plantId);
      return previous.map((item) => {
        if (item.plantId !== plantId) return item;
        const max = Number.isFinite(item.stock) ? item.stock : quantity;
        return { ...item, quantity: Math.min(quantity, max) };
      });
    });
  }, []);

  const removeItem = useCallback((plantId) => {
    setCart((previous) => previous.filter((item) => item.plantId !== plantId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const count = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({ cart, count, subtotal, addToCart, updateQty, removeItem, clearCart }),
    [cart, count, subtotal, addToCart, updateQty, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
}
