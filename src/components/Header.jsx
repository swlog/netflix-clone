import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  // --- 1. Hook 및 상태 선언 ---
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 로그인 상태 확인 (원격 브랜치에서 가져온 로직)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // --- 2. useEffect (스크롤 감지 로직) ---
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

  // --- 3. 핸들러 함수 (로그아웃 로직) ---
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('TMDb-Key');

    setMenuOpen(false);
    navigate('/signin');
  };

  // --- 4. JSX 렌더링 (당신의 디자인 + 로그인 로직 통합) ---
  return (
    // 당신의 헤더 디자인 클래스를 사용 (netflix-header)
    <header className={`netflix-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* 왼쪽 영역: 당신의 내비게이션 메뉴 */}
        <div className="header-left">
          <Link to="/" className="netflix-logo">
            NETFLIX
          </Link>
          <nav className="main-nav">
            <Link to="/">홈</Link>
            <Link to="/popular">시리즈1</Link>
            <Link to="/popular">영화</Link>
            <Link to="/popular">NEW! 요즘 대세 콘텐츠</Link>
            <Link to="/wishlist">내가 찜한 리스트</Link>
            <Link to="/search">언어별로 찾아보기</Link>
          </nav>
        </div>

        {/* 오른쪽 영역: 원격 브랜치에서 가져온 로그인 상태에 따른 분기 로직 */}
        <div className="header-right">
          {isLoggedIn ? (
            // 로그인 상태일 때: 프로필 아이콘과 로그아웃 드롭다운
            <div className="profile-wrapper">
              <div 
                className="user-icon" 
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {/* 사용자 아이콘 SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
              </div>

              {menuOpen && (
                <div className="profile-menu">
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            // 로그아웃 상태일 때: 로그인 페이지 링크 (당신의 로직에서 가져옴)
            <div className="profile-menu">
                <Link to="/signin" className="profile-avatar">
                  <img src="https://i.pravatar.cc/150?img=12" alt="프로필" />
                </Link>
            </div>
          )}
          
          {/* 당신이 추가했던 검색/알림 버튼은 필요하다면 여기에 다시 통합할 수 있습니다. */}
          {/* 현재는 로그인/로그아웃 로직만 우선 통합했습니다. */}
        </div>
      </div>
    </header>
  );
}