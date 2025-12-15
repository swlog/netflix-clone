import { useState, useEffect } from 'react';

const WISHLIST_KEY = 'wishlist';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // 초기 로드
  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse wishlist:', error);
        setWishlist([]);
      }
    }
  }, []);

  // Local Storage에 저장
  const saveToStorage = (list) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    setWishlist(list);
  };

  // 위시리스트에 있는지 확인
  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  // 위시리스트 토글 (추가/제거)
  const toggleWishlist = (movie) => {
    if (isInWishlist(movie.id)) {
      // 제거
      const updated = wishlist.filter((m) => m.id !== movie.id);
      saveToStorage(updated);
      return false; // 제거됨
    } else {
      // 추가 - addedAt 타임스탬프 포함
      const movieWithTimestamp = {
        ...movie,
        addedAt: Date.now(),
      };
      const updated = [movieWithTimestamp, ...wishlist];
      saveToStorage(updated);
      return true; // 추가됨
    }
  };

  // 전체 삭제
  const clearWishlist = () => {
    saveToStorage([]);
  };

  // 위시리스트에 추가 (토글 없이 무조건 추가)
  const addToWishlist = (movie) => {
    if (!isInWishlist(movie.id)) {
      const movieWithTimestamp = {
        ...movie,
        addedAt: Date.now(),
      };
      const updated = [movieWithTimestamp, ...wishlist];
      saveToStorage(updated);
    }
  };

  // 위시리스트에서 제거 (토글 없이 무조건 제거)
  const removeFromWishlist = (movieId) => {
    const updated = wishlist.filter((m) => m.id !== movieId);
    saveToStorage(updated);
  };

  return {
    wishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    addToWishlist,
    removeFromWishlist,
  };
};