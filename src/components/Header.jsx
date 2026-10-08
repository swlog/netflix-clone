import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

const NAV_ITEMS = [
  { to: '/', label: '홈' },
  { to: '/popular', label: 'NEW! 요즘 대세 콘텐츠' },
  { to: '/wishlist', label: '내가 찜한 콘텐츠' },
];

export default function Header() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

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

  /* 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  /* 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('TMDb-Key');
    setMenuOpen(false);
    setProfileOpen(false);
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
              {NAV_ITEMS.map(({ to, label }) => (
                <NavLink key={to} to={to} end className="nav-link">
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* 오른쪽 */}
          <div className="header-right">
            <Link to="/search" className="header-icon" aria-label="검색">
              <i className="fas fa-search"></i>
            </Link>
            <span className="header-icon" aria-hidden="true">
              <i className="fas fa-bell"></i>
            </span>

            {isLoggedIn ? (
              <div className="profile-container" ref={profileRef}>
                <div
                  className="profile-wrapper"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  {/* ⭐ 이메일 표시 제거 - 드롭다운 안에만 표시 */}

                  <div className="user-icon">
                    <i className="fas fa-face-smile"></i>
                  </div>

                  <i className={`fas fa-caret-down dropdown-arrow ${profileOpen ? 'open' : ''}`}></i>
                </div>

                {/* 프로필 드롭다운 메뉴 */}
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-user-info">
                      <i className="fas fa-user-circle"></i>
                      <span>{userEmail}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-logout">
                      <i className="fas fa-sign-out-alt"></i>
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
          {isLoggedIn && userEmail && (
            <div className="mobile-user-info">
              <i className="fas fa-user-circle"></i>
              <span>{userEmail}</span>
            </div>
          )}
          
          {NAV_ITEMS.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <Link to="/search" onClick={() => setMenuOpen(false)}>찾아보기</Link>

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