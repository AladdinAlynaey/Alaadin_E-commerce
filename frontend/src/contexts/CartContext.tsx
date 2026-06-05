'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  product: any;
  variant: { size: string; color: string };
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  savedItems: any[];
  itemCount: number;
  addItem: (product: string, variant?: any, quantity?: number) => Promise<void>;
  removeItem: (index: number) => Promise<void>;
  updateQuantity: (index: number, quantity: number) => Promise<void>;
  saveForLater: (index: number) => Promise<void>;
  moveToCart: (index: number) => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!token) {
      const local = localStorage.getItem('cart');
      if (local) setItems(JSON.parse(local));
      return;
    }
    try {
      const cart = await api.get<any>('/cart', token);
      setItems(cart.items || []);
      setSavedItems(cart.savedForLater || []);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    if (!token) localStorage.setItem('cart', JSON.stringify(items));
  }, [items, token]);

  const addItem = async (product: any, variant?: any, quantity = 1) => {
    setIsLoading(true);
    try {
      const productId = typeof product === 'object' ? product._id : product;
      if (token) {
        const cart = await api.post<any>('/cart/items', { product: productId, variant, quantity }, token);
        setItems(cart.items || []);
      } else {
        setItems(prev => {
          const existing = prev.findIndex(i => {
            const id = typeof i.product === 'object' ? i.product._id : i.product;
            return id === productId && JSON.stringify(i.variant) === JSON.stringify(variant);
          });
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing].quantity += quantity;
            return updated;
          }
          const productObj = typeof product === 'object' ? product : { _id: product };
          return [...prev, { product: productObj, variant: variant || {}, quantity }];
        });
      }
    } finally { setIsLoading(false); }
  };

  const removeItem = async (index: number) => {
    if (token) {
      const cart = await api.delete<any>(`/cart/items/${index}`, token);
      setItems(cart.items || []);
    } else {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateQuantity = async (index: number, quantity: number) => {
    if (token) {
      const cart = await api.put<any>(`/cart/items/${index}`, { quantity }, token);
      setItems(cart.items || []);
    } else {
      setItems(prev => {
        const updated = [...prev];
        if (quantity <= 0) return updated.filter((_, i) => i !== index);
        updated[index].quantity = quantity;
        return updated;
      });
    }
  };

  const saveForLater = async (index: number) => {
    if (token) {
      const cart = await api.post<any>(`/cart/items/${index}/save-for-later`, {}, token);
      setItems(cart.items || []);
      setSavedItems(cart.savedForLater || []);
    }
  };

  const moveToCart = async (index: number) => {
    if (token) {
      const cart = await api.post<any>(`/cart/saved/${index}/move-to-cart`, {}, token);
      setItems(cart.items || []);
      setSavedItems(cart.savedForLater || []);
    }
  };

  const clearCart = () => { setItems([]); localStorage.removeItem('cart'); };

  return (
    <CartContext.Provider value={{
      items, savedItems, itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      addItem, removeItem, updateQuantity, saveForLater, moveToCart, clearCart, isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
