import React from 'react';
import { getImageUrl } from '../services/tmdb';
import './MovieCard.css';

function MovieCard({ movie, onWishlistToggle }) {
  const posterUrl = getImageUrl(movie.poster_path);
  const backdropUrl = getImageUrl(movie.backdrop_path);

  // 개봉 연도 추출
  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';

  // 평점 (10점 만점 -> 별점 표시)
  const rating = movie.vote_average?.toFixed(1) || 'N/A';

  return (
    <div className="movie-card">
      <div className="movie-card-image">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} />
        ) : (
          <div className="no-image">이미지 없음</div>
        )}
        
        <div className="movie-card-overlay">
          <button 
            className="wishlist-btn"
            onClick={() => onWishlistToggle && onWishlistToggle(movie)}
            aria-label="찜하기"
          >
            ❤️
          </button>
        </div>
      </div>
      
      <div className="movie-card-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-details">
          <span className="movie-year">{releaseYear}</span>
          <span className="movie-rating">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;