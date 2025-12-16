import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import tmdbService from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { useWishlist } from "../hooks/useWishlist";
import toast from "react-hot-toast";
import "./Popular.css";

const VIEW_MODES = {
  TABLE: "table",
  INFINITE: "infinite",
};

const TABLE_PAGE_SIZE = 6;// CSS가 알아서 화면에 맞게 배치

const Popular = () => {
  /* ==================== 상태 ==================== */
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();

  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  /* ==================== 데이터 fetch ==================== */
  const fetchMovies = useCallback(
    async (page, append = false) => {
      try {
        if (viewMode === VIEW_MODES.INFINITE) {
          append ? setLoadingMore(true) : setLoading(true);
        }

        const data = await tmdbService.getPopularMovies(page);
        const results = data.results || [];

        setMovies((prev) => (append ? [...prev, ...results] : results));
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (e) {
        toast.error("영화 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [viewMode]
  );

  /* ==================== 초기 로드 ==================== */
  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  /* ==================== 뷰 전환 ==================== */
  useEffect(() => {
    setCurrentPage(1);
    setMovies([]);
    fetchMovies(1);
    window.scrollTo({ top: 0 });
  }, [viewMode, fetchMovies]);

  /* ==================== 테이블 뷰 표시 ==================== */
  const displayedMovies = useMemo(() => {
    if (viewMode === VIEW_MODES.TABLE) {
      return movies.slice(0, TABLE_PAGE_SIZE);
    }
    return movies;
  }, [movies, viewMode]);

  /* ==================== 무한 스크롤 ==================== */
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          currentPage < totalPages
        ) {
          const next = currentPage + 1;
          setCurrentPage(next);
          fetchMovies(next, true);
        }
      },
      { rootMargin: "200px" }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [viewMode, currentPage, totalPages, loadingMore, loading, fetchMovies]);

  /* ==================== 스크롤 감지 ==================== */
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE) return;

    const onScroll = () => setShowTopButton(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [viewMode]);

  /* ==================== 핸들러 ==================== */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(page);
    if (viewMode === VIEW_MODES.INFINITE) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ⭐ 하트 아이콘 toast 알림 추가
  const handleWishlist = (movie) => {
    const added = toggleWishlist(movie);
    
    if (added) {
      toast.success(`${movie.title} 위시리스트에 추가되었습니다.`, {
        position: "bottom-right",
        icon: "❤️", // ⭐ 하트 아이콘 추가
        duration: 2000,
      });
    } else {
      toast(`${movie.title} 위시리스트에서 제거되었습니다`, {
        position: "bottom-right",
        icon: "💔", // ⭐ 깨진 하트 아이콘
        duration: 2000,
      });
    }
  };

  /* ==================== 페이지네이션 번호 계산 ==================== */
  const getPaginationNumbers = () => {
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  /* ==================== 렌더 ==================== */
  return (
    <div className={`popular-page ${viewMode}-mode`}>
      {/* 헤더 */}
      <div className="page-header">
        <h1>대세 콘텐츠</h1>
        <div className="view-toggle">
          <button
            className={viewMode === VIEW_MODES.TABLE ? "active" : ""}
            onClick={() => setViewMode(VIEW_MODES.TABLE)}
          >
            테이블 뷰
          </button>
          <button
            className={viewMode === VIEW_MODES.INFINITE ? "active" : ""}
            onClick={() => setViewMode(VIEW_MODES.INFINITE)}
          >
            무한 스크롤
          </button>
        </div>
      </div>

      {/* 영화 리스트 */}
      <div className="movies-container">
        {loading ? (
          <div className="loading-spinner">불러오는 중...</div>
        ) : (
          <>
            <div className="movies-grid">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWishlist={isInWishlist(movie.id)}
                  onToggleWishlist={handleWishlist}
                />
              ))}
            </div>

            {/* 페이지네이션 (테이블 뷰) */}
            {viewMode === VIEW_MODES.TABLE && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="pagination-arrow"
                >
                  이전
                </button>

                <div className="pagination-numbers">
                  {getPaginationNumbers().map((page) => (
                    <button
                      key={page}
                      className={page === currentPage ? "active" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="pagination-arrow"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        {/* 무한 스크롤 로딩 */}
        {viewMode === VIEW_MODES.INFINITE && (
          <div ref={loadingRef} className="infinite-loading">
            {loadingMore && <p>불러오는 중...</p>}
            {currentPage >= totalPages && <p>모든 콘텐츠를 확인했습니다</p>}
          </div>
        )}
      </div>

      {/* Top 버튼 */}
      {viewMode === VIEW_MODES.INFINITE && showTopButton && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Popular;