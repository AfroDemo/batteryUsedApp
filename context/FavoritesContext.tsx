import React, { createContext, useContext, useState } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      // Remove from favorites
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      // Add to favorites
      setFavorites([...favorites, productId]);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites
    }}>
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