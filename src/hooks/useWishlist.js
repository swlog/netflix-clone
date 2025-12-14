import { useState, useEffect } from 'react';

const WISHLIST_KEY = 'netflix_wishlist';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // 초기 로드
  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error('위시리스트 로드 실패:', error);
        setWishlist([]);
      }
    }
  }, []);

  // wishlist 변경 시 저장
  useEffect(() => {
    if (wishlist.length > 0 || localStorage.getItem(WISHLIST_KEY)) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const isInWishlist = (movieId) => {
    return wishlist.some(movie => movie.id === movieId);
  };

  const toggleWishlist = (movie) => {
    if (isInWishlist(movie.id)) {
      // 제거
      setWishlist(prev => prev.filter(m => m.id !== movie.id));
      return false;
    } else {
      // 추가
      setWishlist(prev => [...prev, movie]);
      return true;
    }
  };

  const removeFromWishlist = (movieId) => {
    setWishlist(prev => prev.filter(m => m.id !== movieId));
  };

  return {
    wishlist,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist
  };
};