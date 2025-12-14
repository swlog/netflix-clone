// 사용자 인증 관련 유틸리티 함수

export const tryLogin = (email, password, success, fail) => {
  try {
    const usersJson = localStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find(
      (user) => user.id === email && user.password === password
    );

    if (user) {
      // 비밀번호를 TMDB API 키로 저장 (나중에 영화 정보 불러올 때 사용)
      localStorage.setItem('TMDb-Key', user.password);
      localStorage.setItem('currentUser', email);
      localStorage.setItem('isLoggedIn', 'true');
      success(user);
    } else {
      fail('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('Login error:', error);
    fail('로그인 처리 중 오류가 발생했습니다.');
  }
};

export const tryRegister = (email, password, success, fail) => {
  try {
    const usersJson = localStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    const userExists = users.some((existingUser) => existingUser.id === email);

    if (userExists) {
      fail('이미 가입된 이메일입니다.');
      return;
    }

    if (password.length < 6) {
      fail('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    const newUser = {
      id: email,
      password: password, // TMDB API 키로 사용될 비밀번호
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    success(newUser);
  } catch (error) {
    console.error('Register error:', error);
    fail('회원가입 처리 중 오류가 발생했습니다.');
  }
};

export const logout = () => {
  localStorage.removeItem('TMDb-Key');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('savedEmail');
};

export const isLoggedIn = () => {
  const apiKey = localStorage.getItem('TMDb-Key');
  const loggedIn = localStorage.getItem('isLoggedIn');
  return !!(apiKey && loggedIn === 'true');
};

export const getCurrentUser = () => {
  const email = localStorage.getItem('currentUser');
  if (!email) return null;

  const usersJson = localStorage.getItem('users');
  const users = usersJson ? JSON.parse(usersJson) : [];
  
  return users.find((user) => user.id === email) || null;
};

/**
 * 현재 저장된 TMDB API 키 가져오기
 * @returns {string|null} - 저장된 API 키 또는 null
 */
export const getTMDbAPIKey = () => {
  return localStorage.getItem('TMDb-Key');
};