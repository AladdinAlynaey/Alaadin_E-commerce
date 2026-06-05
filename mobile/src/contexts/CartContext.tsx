import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem { productId: string; quantity: number; variant?: any; product?: any; }

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, variant?: any) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (productId: string, variant?: any) => {
    setItems(prev => {
      const existing = prev.findIndex(i => i.productId === productId && JSON.stringify(i.variant) === JSON.stringify(variant));
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing].quantity += 1;
        return updated;
      }
      return [...prev, { productId, quantity: 1, variant }];
    });
  };

  const removeItem = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) { removeItem(index); return; }
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity } : item));
  };
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount: items.reduce((sum, i) => sum + i.quantity, 0) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
