import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { BATTERIES } from '../constants/mockData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Update totals when items change
  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setItemCount(count);
    setTotalPrice(total);
  }, [items]);

  const addToCart = (productId: string, quantity = 1) => {
    // Find product in our data
    const product = BATTERIES.find(b => b.id === productId);
    if (!product) {
      Alert.alert('Error', 'Product not found');
      return;
    }

    // Check if the item is already in the cart
    const existingItemIndex = items.findIndex(item => item.id === productId);

    if (existingItemIndex !== -1) {
      // Item exists, update quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      // Item doesn't exist, add it
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      };
      setItems([...items, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice
    }}>
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