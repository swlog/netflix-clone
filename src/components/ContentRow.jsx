import { useRef } from 'react';
import tmdbService from '../services/tmdb';
import './ContentRow.css';

// 넷플릭스 스타일 가로형(16:9) 카드
const RowCard = ({ movie, isInWishlist, onSelect }) => {
  const imageUrl =
    tmdbService.getImageUrl(movie.backdrop_path, 'w780') ||
    tmdbService.getImageUrl(movie.poster_path, 'w500');

  return (
    <button className="row-card" onClick={() => onSelect(movie)} aria-label={movie.title}>
      {imageUrl ? (
        <img src={imageUrl} alt="" loading="lazy" />
      ) : (
        <div className="row-card-fallback" />
      )}
      <span className="row-card-title">{movie.title}</span>
      {isInWishlist && (
        <span className="row-card-wish" aria-label="찜한 콘텐츠">
          <i className="fas fa-check"></i>
        </span>
      )}
    </button>
  );
};

const ContentRow = ({ title, movies, isInWishlist, onSelect }) => {
  const trackRef = useRef(null);

  // 화면에 보이는 너비만큼 한 페이지씩 이동
  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.92, behavior: 'smooth' });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="content-row">
      <h2 className="row-title">{title}</h2>

      <div className="row-slider">
        <button className="row-arrow prev" onClick={() => scroll(-1)} aria-label="이전">
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="row-track" ref={trackRef}>
          {movies.map((movie) => (
            <RowCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onSelect={onSelect}
            />
          ))}
        </div>

        <button className="row-arrow next" onClick={() => scroll(1)} aria-label="다음">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ContentRow;
