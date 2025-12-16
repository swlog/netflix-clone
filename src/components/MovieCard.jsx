import { useState } from 'react';
import tmdbService from '../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, isInWishlist, onToggleWishlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // ⭐ 카드 클릭 시 위시리스트 토글
  const handleCardClick = () => {
    onToggleWishlist(movie);
  };


  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4ecca3';
    if (rating >= 6) return '#ffd93d';
    return '#ff6b6b';
  };

  // tmdbService의 getImageUrl 사용
  const posterUrl = tmdbService.getImageUrl(movie.poster_path, 'w500');

  return (
    <div 
      className={`movie-card ${isInWishlist ? 'in-wishlist' : ''}`}
      onClick={handleCardClick}
    >
      {/* 포스터 이미지 */}
      <div className="movie-poster">
        {!imageLoaded && (
          <div className="image-skeleton">
            <i className="fas fa-film"></i>
          </div>
        )}
        {posterUrl && (
          <img 
            src={posterUrl} 
            alt={movie.title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        )}
        
        {/* 호버 오버레이 */}
        <div className="movie-overlay">
          <div className="overlay-content">
            {/* ⭐ 제목 제거됨 - 하단에만 표시 */}
            
            {/* 장르만 표시 */}
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="genres">
                {movie.genre_ids.slice(0, 3).map(genreId => (
                  <span key={genreId} className="genre-tag">
                    {getGenreName(genreId)}
                  </span>
                ))}
              </div>
            )}

            {/* 줄거리 */}
            <p className="movie-overview">
              {movie.overview 
                ? movie.overview.length > 120 
                  ? movie.overview.substring(0, 120) + '...' 
                  : movie.overview
                : '줄거리 정보가 없습니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* 카드 하단 정보 - 제목은 여기에만 표시 */}
      <div className="movie-info">
        <h4 className="movie-title-bottom">{movie.title}</h4>
        
        {/* 평점과 개봉일을 한 줄에 */}
        <div className="rating-date-row">
          <div className="rating-bottom" style={{ color: getRatingColor(movie.vote_average) }}>
            <i className="fas fa-star"></i>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>

          {/* 개봉일 표시 (년도만) */}
          {movie.release_date && (
            <div className="release-date-bottom">
              <i className="far fa-calendar-alt"></i>
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 장르 ID를 이름으로 변환
const getGenreName = (genreId) => {
  const genres = {
    28: '액션',
    12: '모험',
    16: '애니메이션',
    35: '코미디',
    80: '범죄',
    99: '다큐멘터리',
    18: '드라마',
    10751: '가족',
    14: '판타지',
    36: '역사',
    27: '공포',
    10402: '음악',
    9648: '미스터리',
    10749: '로맨스',
    878: 'SF',
    10770: 'TV 영화',
    53: '스릴러',
    10752: '전쟁',
    37: '서부'
  };
  return genres[genreId] || '기타';
};

export default MovieCard;