import { useState, useEffect, useRef } from 'react';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';
import './Wishlist.css';

const LOAD_SIZE = 20;

const Wishlist = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();

  const [visibleCount, setVisibleCount] = useState(LOAD_SIZE);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadingRef = useRef(null);
  const observerRef = useRef(null);

  /* =========================
     초기 진입
  ========================= */
  useEffect(() => {
    setVisibleCount(LOAD_SIZE);
    window.scrollTo({ top: 0 });
  }, [wishlist]);

  /* =========================
     Infinite Scroll
  ========================= */
  useEffect(() => {
    if (!loadingRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < wishlist.length
        ) {
          setVisibleCount((prev) =>
            Math.min(prev + LOAD_SIZE, wishlist.length)
          );
        }
      },
      { rootMargin: '200px' }
    );

    observerRef.current.observe(loadingRef.current);
    return () => observerRef.current?.disconnect();
  }, [visibleCount, wishlist.length]);

  /* =========================
     Scroll Top Button
  ========================= */
  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* =========================
     Handlers
  ========================= */
  const handleRemove = (movie) => {
    toggleWishlist(movie);

    toast.error(`💔 ${movie.title}을(를) 위시리스트에서 제거했습니다`, {
      position: 'bottom-right',
      duration: 2000,
      style: {
        background: '#141414',
        color: '#fff',
        border: '1px solid rgba(229, 9, 20, 0.6)',
      },
    });
  };

  const confirmClearAll = () => {
    clearWishlist();
    setShowConfirm(false);

    toast.success('🗑️ 위시리스트가 모두 삭제되었습니다', {
      position: 'bottom-right',
      duration: 2000,
      style: {
        background: '#141414',
        color: '#fff',
        border: '1px solid rgba(229, 9, 20, 0.6)',
      },
    });
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="wishlist-page">
      {/* Header */}
      <header className="wishlist-header">
        <h1>
          <i className="fas fa-heart heart-icon"></i>
          내가 찜한 리스트
        </h1>

        {wishlist.length > 0 && (
          <button
            className="clear-all-btn"
            onClick={() => setShowConfirm(true)}
          >
            <i className="fas fa-trash-alt"></i>
            전체 삭제
          </button>
        )}
      </header>

      {/* Content */}
      <main className="wishlist-content">
        {wishlist.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-heart-broken"></i>
            <h2>위시리스트가 비어 있습니다</h2>
            <p>마음에 드는 영화를 찜해보세요</p>
            <a href="/" className="browse-btn">
              <i className="fas fa-search"></i>
              영화 둘러보기
            </a>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {wishlist.slice(0, visibleCount).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWishlist={true}
                  onToggleWishlist={handleRemove}
                />
              ))}
            </div>

            <div ref={loadingRef} className="infinite-loading">
              {visibleCount >= wishlist.length
                ? '모든 영화를 불러왔습니다 🎬'
                : '불러오는 중...'}
            </div>
          </>
        )}
      </main>

      {/* Scroll To Top */}
      {showTopButton && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>정말 삭제하시겠습니까?</h3>
            <p>
              찜한 모든 영화({wishlist.length}개)가 삭제됩니다.
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => setShowConfirm(false)}
              >
                취소
              </button>
              <button
                className="confirm-delete"
                onClick={confirmClearAll}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
