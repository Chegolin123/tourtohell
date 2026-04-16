import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

export const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Загружаем избранное из localStorage при инициализации
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        const items = JSON.parse(storedWishlist);
        setWishlistItems(items);
        setWishlistCount(items.length);
      } catch (e) {
        console.error('Error parsing wishlist:', e);
      }
    }
  }, []);

  // Сохраняем избранное в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  const addToWishlist = (tour) => {
    setWishlistItems(prev => {
      // Проверяем, есть ли уже такой тур в избранном
      const exists = prev.some(item => item.id === tour.id);
      if (exists) {
        toast.error('Тур уже в избранном', { icon: '❤️' });
        return prev;
      }
      toast.success('Тур добавлен в избранное', { icon: '❤️' });
      return [...prev, tour];
    });
  };

  const removeFromWishlist = (tourId) => {
    setWishlistItems(prev => {
      const newItems = prev.filter(item => item.id !== tourId);
      toast.success('Тур удален из избранного', { icon: '💔' });
      return newItems;
    });
  };

  const toggleWishlist = (tour) => {
    const exists = wishlistItems.some(item => item.id === tour.id);
    if (exists) {
      removeFromWishlist(tour.id);
    } else {
      addToWishlist(tour);
    }
  };

  const isInWishlist = (tourId) => {
    return wishlistItems.some(item => item.id === tourId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Избранное очищено');
  };

  const value = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};