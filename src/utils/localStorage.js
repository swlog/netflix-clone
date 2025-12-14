// 찜 목록 가져오기
export const getWishlist = () => {
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

// 찜 목록 저장
export const saveWishlist = (wishlist) => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
};

// 찜 목록에 추가
export const addToWishlist = (movie) => {
  const wishlist = getWishlist();
  const exists = wishlist.find((item) => item.id === movie.id);
  
  if (!exists) {
    wishlist.push(movie);
    saveWishlist(wishlist);
    return true;
  }
  return false;
};

// 찜 목록에서 제거
export const removeFromWishlist = (movieId) => {
  const wishlist = getWishlist();
  const filtered = wishlist.filter((item) => item.id !== movieId);
  saveWishlist(filtered);
};

// 찜 목록에 있는지 확인
export const isInWishlist = (movieId) => {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.id === movieId);
};