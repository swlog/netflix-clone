import { useEffect } from 'react';
import tmdbService, { GENRE_NAMES } from '../services/tmdb';
import './MovieModal.css';

// 넷플릭스 "상세 정보" 모달
const MovieModal = ({ movie, isInWishlist, onToggleWishlist, onClose }) => {
  // ESC로 닫기 + 모달이 열린 동안 배경 스크롤 막기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'w1280');
  const releaseYear = movie.release_date?.split('-')[0];
  const genres = (movie.genre_ids || []).map((id) => GENRE_NAMES[id]).filter(Boolean);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-label={movie.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          <i className="fas fa-xmark"></i>
        </button>

        <div
          className="modal-hero"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}
        >
          <div className="modal-hero-content">
            <h2 className="modal-title">{movie.title}</h2>
            <div className="modal-actions">
              <button className="modal-play-btn">
                <i className="fas fa-play"></i>
                재생
              </button>
              <button
                className={`modal-circle-btn ${isInWishlist ? 'active' : ''}`}
                onClick={() => onToggleWishlist(movie)}
                aria-label={isInWishlist ? '내가 찜한 콘텐츠에서 삭제' : '내가 찜한 콘텐츠에 추가'}
                title={isInWishlist ? '내가 찜한 콘텐츠에서 삭제' : '내가 찜한 콘텐츠에 추가'}
              >
                <i className={`fas ${isInWishlist ? 'fa-check' : 'fa-plus'}`}></i>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-meta">
              {movie.vote_average > 0 && (
                <span className="modal-score">평점 {movie.vote_average.toFixed(1)}</span>
              )}
              {releaseYear && <span>{releaseYear}</span>}
            </div>
            <p className="modal-overview">{movie.overview || '줄거리 정보가 없습니다.'}</p>
          </div>

          {genres.length > 0 && (
            <div className="modal-side">
              <span className="modal-label">장르: </span>
              {genres.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
