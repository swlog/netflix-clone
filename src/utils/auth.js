// 로그인 체크
export const isLoggedIn = () => {
  return localStorage.getItem('user') !== null;
};

// 로그인
export const login = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// 로그아웃
export const logout = () => {
  localStorage.removeItem('user');
};

// 현재 사용자 정보
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};