import { favorite } from '@/lib/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch initial favorites
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const favoriteData = await favorite.get();
        // Extract product IDs from response
        const favoriteIds = favoriteData.map((item: any) => item.id);
        setFavorites(favoriteIds);
      } catch (err: any) {
        console.error('Failed to fetch favorites:', err);
        Alert.alert('Error', err.message || 'Failed to load favorites. Please try again.');
      }
    }
    fetchFavorites();
  }, []);

  const toggleFavorite = async (productId: string) => {
    try {
      if (favorites.includes(productId)) {
        // Remove from favorites
        await favorite.remove(productId);
        setFavorites(favorites.filter((id) => id !== productId));
      } else {
        // Add to favorites
        await favorite.add(productId);
        setFavorites([...favorites, productId]);
      }
    } catch (err: any) {
      console.error('Toggle favorite error:', err);
      Alert.alert('Error', err.message || 'Failed to update favorites');
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const clearFavorites = async () => {
    try {
      await favorite.clear(); // Corrected to use favorite.clear()
      setFavorites([]);
    } catch (err: any) {
      console.error('Clear favorites error:', err);
      Alert.alert('Error', err.message || 'Failed to clear favorites');
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}