// import { Link, useLocation } from 'react-router-dom';
// import './Header.css';

// export default function Header() {
//   const location = useLocation();
  
//   // 현재 경로인지 확인하는 함수
//   const isActive = (path) => {
//     return location.pathname === path ? 'active' : '';
//   };

//   return (
//     <header className="header">
//       <div className="header-left">
//         {/* 넷플릭스 로고 */}
//         <Link to="/" className="logo">
//           <span className="logo-n">N</span>
//         </Link>
        
//         {/* 네비게이션 메뉴 */}
//         <nav className="nav-menu">
//           <Link to="/" className={`nav-link ${isActive('/')}`}>
//             홈
//           </Link>
//           <Link to="/popular" className={`nav-link ${isActive('/popular')}`}>
//             대세 콘텐츠
//           </Link>
//           <Link to="/wishlist" className={`nav-link ${isActive('/wishlist')}`}>
//             내가 찜한 리스트
//           </Link>
//           <Link to="/search" className={`nav-link ${isActive('/search')}`}>
//             찾아보기
//           </Link>
//         </nav>
//       </div>
      
//       <div className="header-right">
//         {/* 사용자 아이콘 */}
//         <Link to="/signin" className="user-icon">
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
//           </svg>
//         </Link>
//       </div>
//     </header>
//   );
// }

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <Link to="/" className="logo">
          <span className="logo-n">N</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <span>홈</span>
            <span className="nav-underline"></span>
          </Link>
          <Link to="/popular" className={`nav-link ${isActive('/popular')}`}>
            <span>대세 콘텐츠</span>
            <span className="nav-underline"></span>
          </Link>
          <Link to="/wishlist" className={`nav-link ${isActive('/wishlist')}`}>
            <span>내가 찜한 리스트</span>
            <span className="nav-underline"></span>
          </Link>
          <Link to="/search" className={`nav-link ${isActive('/search')}`}>
            <span>찾아보기</span>
            <span className="nav-underline"></span>
          </Link>
        </nav>
      </div>
      
      <div className="header-right">
        <Link to="/signin" className="user-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}