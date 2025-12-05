import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={`netflix-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* 왼쪽 영역 */}
        <div className="header-left">
          <Link to="/" className="netflix-logo">
            NETFLIX
          </Link>
          <nav className="main-nav">
            <Link to="/">홈</Link>
            <Link to="/popular">시리즈</Link>
            <Link to="/popular">영화</Link>
            <Link to="/popular">NEW! 요즘 대세 콘텐츠</Link>
            <Link to="/wishlist">내가 찜한 리스트</Link>
            <Link to="/search">언어별로 찾아보기</Link>
          </nav>
        </div>

        {/* 오른쪽 영역 */}
        <div className="header-right">
          <button className="search-btn" aria-label="검색">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="notification-btn" aria-label="알림">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="profile-menu">
            <Link to="/signin" className="profile-avatar">
              <img src="https://i.pravatar.cc/150?img=12" alt="프로필" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;