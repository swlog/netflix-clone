import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  /* 사용자 정보 */
  let userEmail = '';
  const storedUser = localStorage.getItem('currentUser');

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      userEmail = parsed.email || '';
    } catch {
      userEmail = storedUser;
    }
  }

  /* 스크롤 감지 */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('TMDb-Key');
    setMenuOpen(false);
    navigate('/signin');
  };

  return (
    <>
      <header className={`netflix-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* 왼쪽 */}
          <div className="header-left">
            <Link to="/" className="netflix-logo">
              NETFLIX
            </Link>

            {/* PC 네비 */}
            <nav className="main-nav">
              <Link to="/" className="nav-link">홈</Link>
              <Link to="/popular" className="nav-link">대세 콘텐츠</Link>
              <Link to="/search" className="nav-link">찾아보기</Link>
              <Link to="/wishlist" className="nav-link">내가 찜한 리스트</Link>
            </nav>
          </div>

          {/* 오른쪽 */}
          <div className="header-right">
            {isLoggedIn ? (
              <div className="profile-wrapper">
                <span className="user-email">{userEmail}</span>

                <div
                  className="user-icon"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <Link to="/signin" className="signin-link">
                로그인
              </Link>
            )}

            {/* 📱 햄버거 버튼 */}
            <button
              className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="메뉴 열기"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* 📱 모바일 메뉴 */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>홈</Link>
          <Link to="/popular" onClick={() => setMenuOpen(false)}>대세 콘텐츠</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)}>찾아보기</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>내가 찜한 리스트</Link>

          {isLoggedIn && (
            <button onClick={handleLogout} className="mobile-logout">
              로그아웃
            </button>
          )}
        </div>
      )}
    </>
  );
}
