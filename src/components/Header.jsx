import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // ✅ 수정된 사용자 정보 처리
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


  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('TMDb-Key');

    setMenuOpen(false);
    navigate('/signin');
  };

  return (
    <header className={`netflix-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* 왼쪽 영역: 로고 + 네비게이션 */}
        <div className="header-left">
          <Link to="/" className="netflix-logo">
            NETFLIX
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">홈</Link>
            <Link to="/popular" className="nav-link">대세 콘텐츠</Link>
            <Link to="/search" className="nav-link">찾아보기</Link>
            <Link to="/wishlist" className="nav-link">내가 찜한 리스트</Link>
          </nav>
        </div>

        {/* 오른쪽 영역: 로그인/사용자 정보 */}
        <div className="header-right">
          {isLoggedIn ? (
            <div className="profile-wrapper">
              {/* 사용자 아이디 표시 */}
              <span className="user-email">{userEmail}</span>
              
              {/* 프로필 아이콘 */}
              <div 
                className="user-icon" 
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
              </div>

              {/* 드롭다운 메뉴 */}
              {menuOpen && (
                <div className="profile-menu">
                  <button onClick={handleLogout} className="logout-btn">
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="signin-link">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}