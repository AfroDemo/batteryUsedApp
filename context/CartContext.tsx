import { cart } from '@/lib/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

interface CartItem {
  id: string;
  name: string;
  price: string; // e.g., "4,000.00"
  image_url: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch initial cart state
  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await cart.get();
        // cart.get returns an array of items
        setItems(cartData || []);
      } catch (err: any) {
        console.error('Failed to fetch cart:', err);
        Alert.alert('Error', err.message || 'Failed to load cart. Please try again.');
      }
    }
    fetchCart();
  }, []);

  // Update totals when items change
  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price.replace(/,/g, '')) * item.quantity,
      0
    );
    setItemCount(count);
    setTotalPrice(total);
  }, [items]);

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      await cart.addItem(productId, quantity);
      const cartData = await cart.get();
      setItems(cartData || []);
    } catch (err: any) {
      console.error('Add to cart error:', err);
      Alert.alert('Error', err.message || 'Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await cart.removeItem(productId);
      const cartData = await cart.get();
      setItems(cartData || []);
    } catch (err: any) {
      console.error('Remove from cart error:', err);
      Alert.alert('Error', err.message || 'Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      await cart.updateItem(productId, quantity);
      const cartData = await cart.get();
      setItems(cartData || []);
    } catch (err: any) {
      console.error('Update quantity error:', err);
      Alert.alert('Error', err.message || 'Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      await cart.clear();
      setItems([]);
    } catch (err: any) {
      console.error('Clear cart error:', err);
      Alert.alert('Error', err.message || 'Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}