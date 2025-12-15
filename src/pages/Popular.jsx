import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import tmdbService from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';
import './Popular.css';

const VIEW_MODES = {
  TABLE: 'table',
  INFINITE: 'infinite'
};

const Popular = () => {
  // ==================== 상태 관리 ====================
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // ==================== 화면 크기에 따른 카드 개수 계산 ====================
  const calculateVisibleCount = useCallback(() => {
    if (viewMode !== VIEW_MODES.TABLE) return 20;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const headerHeight = 120;
      const paginationHeight = 80;
      const padding = 40;
      
      const availableHeight = window.innerHeight - headerHeight - paginationHeight - padding;
      const availableWidth = window.innerWidth - 32;
      
      const cardMinWidth = 130;
      const cardHeight = 200; // 줄임
      const gap = 12;
      
      const columns = Math.max(Math.floor((availableWidth + gap) / (cardMinWidth + gap)), 2);
      const rows = Math.max(Math.floor((availableHeight + gap) / (cardHeight + gap)), 2);
      
      return Math.min(columns * rows, 20);
    } else {
      const headerHeight = 120;
      const paginationHeight = 100;
      const padding = 40;
      
      const availableHeight = window.innerHeight - headerHeight - paginationHeight - padding;
      const availableWidth = Math.min(window.innerWidth * 0.9, 1600);
      
      const cardMinWidth = 180;
      const cardHeight = 280; // 줄임
      const gap = 20;
      
      const columns = Math.max(Math.floor((availableWidth + gap) / (cardMinWidth + gap)), 4);
      const rows = Math.max(Math.floor((availableHeight + gap) / (cardHeight + gap)), 2);
      
      return Math.min(columns * rows, 20);
    }
  }, [viewMode]);

  // ==================== Resize 핸들러 (Debounce) ====================
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (viewMode === VIEW_MODES.TABLE) {
          const newCount = calculateVisibleCount();
          setVisibleCount(newCount);
        }
      }, 150);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [viewMode, calculateVisibleCount]);

  // ==================== 영화 데이터 fetch ====================
  const fetchMovies = useCallback(async (page, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const data = await tmdbService.getPopularMovies(page);
      const results = data.results || [];
      
      if (append) {
        setMovies(prev => [...prev, ...results]);
      } else {
        setMovies(results);
      }
      
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setTotalResults(data.total_results || 0);
    } catch (error) {
      console.error('인기 영화 로딩 실패:', error);
      toast.error('영화 정보를 불러올 수 없습니다.', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ==================== 테이블 뷰에서 표시할 영화 ====================
  const displayedMovies = useMemo(() => {
    if (viewMode === VIEW_MODES.TABLE) {
      return movies.slice(0, visibleCount);
    }
    return movies;
  }, [viewMode, movies, visibleCount]);

  // ==================== 초기 로드 ====================
  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  // ==================== 뷰 모드 변경 ====================
  useEffect(() => {
    setCurrentPage(1);
    setMovies([]);
    fetchMovies(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (viewMode === VIEW_MODES.TABLE) {
      setTimeout(() => {
        setVisibleCount(calculateVisibleCount());
      }, 100);
    }
  }, [viewMode, fetchMovies, calculateVisibleCount]);

  // ==================== Intersection Observer (무한 스크롤) ====================
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE || loading) return;

    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore && currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMovies(nextPage, true);
      }
    }, options);

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [viewMode, loading, loadingMore, currentPage, totalPages, fetchMovies]);

  // ==================== 스크롤 감지 (Top 버튼) ====================
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };

    if (viewMode === VIEW_MODES.INFINITE) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode]);

  // ==================== 핸들러 ====================
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMovies(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleToggleWishlist = (movie) => {
    const added = toggleWishlist(movie);
    
    if (added) {
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-heart" style={{ color: '#e50914' }}></i>
          <span><strong>{movie.title}</strong>을(를) 위시리스트에 추가했습니다</span>
        </div>,
        {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: 'rgba(20, 20, 20, 0.95)',
            color: '#fff',
            border: '1px solid rgba(229, 9, 20, 0.5)',
          },
        }
      );
    } else {
      toast(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="far fa-heart" style={{ color: '#b3b3b3' }}></i>
          <span><strong>{movie.title}</strong>을(를) 위시리스트에서 제거했습니다</span>
        </div>,
        {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: 'rgba(20, 20, 20, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==================== 렌더링 ====================
  return (
    <div className={`popular-page ${viewMode}-mode`}>
      {/* 헤더 영역 */}
      <div className="page-header">
        <div className="header-left">
          <i className="fas fa-fire"></i>
          <h1>대세 콘텐츠</h1>
        </div>
        
        <div className="header-right">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === VIEW_MODES.TABLE ? 'active' : ''}`}
              onClick={() => handleViewModeChange(VIEW_MODES.TABLE)}
            >
              <i className="fas fa-th"></i>
              <span>테이블 뷰</span>
            </button>
            <button
              className={`toggle-btn ${viewMode === VIEW_MODES.INFINITE ? 'active' : ''}`}
              onClick={() => handleViewModeChange(VIEW_MODES.INFINITE)}
            >
              <i className="fas fa-infinity"></i>
              <span>무한 스크롤</span>
            </button>
          </div>
        </div>
      </div>

      {/* 영화 그리드 */}
      <div className="movies-container">
        {!loading && displayedMovies.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-film"></i>
            <p>표시할 영화가 없습니다</p>
          </div>
        ) : (
          <div className="movies-grid">
            {displayedMovies.map((movie, index) => (
              <div 
                key={`${movie.id}-${index}`} 
                className="movie-item"
                style={{ animationDelay: `${(index % 20) * 0.03}s` }}
              >
                <MovieCard
                  movie={movie}
                  isInWishlist={isInWishlist(movie.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            ))}
          </div>
        )}

        {/* 무한 스크롤 로딩 */}
        {viewMode === VIEW_MODES.INFINITE && (
          <div ref={loadingRef} className="infinite-loading">
            {loadingMore && currentPage < totalPages && (
              <div className="loading-spinner">
                <i className="fas fa-circle-notch fa-spin"></i>
                <p>더 많은 영화를 불러오는 중...</p>
              </div>
            )}
            {currentPage >= totalPages && movies.length > 0 && (
              <div className="end-message">
                <i className="fas fa-check-circle"></i>
                <p>모든 콘텐츠를 확인했습니다</p>
              </div>
            )}
          </div>
        )}

        {/* 테이블 뷰 페이지네이션 */}
        {viewMode === VIEW_MODES.TABLE && !loading && movies.length > 0 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
              <span>이전</span>
            </button>

            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="page-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <span>다음</span>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Top 버튼 */}
      {viewMode === VIEW_MODES.INFINITE && showTopButton && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* 초기 로딩 */}
      {loading && movies.length === 0 && (
        <div className="initial-loading">
          <div className="loading-spinner">
            <i className="fas fa-film fa-spin"></i>
            <p>영화를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popular;