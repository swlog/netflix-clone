import React from 'react';
import { getImageUrl } from '../services/tmdb';
import './Hero.css';

function Hero({ movie }) {
  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date?.split('-')[0] || '';

  return (
    <div className="hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">{movie.title}</h1>
          <div className="hero-meta">
            <span className="hero-year">{releaseYear}</span>
            <span className="hero-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>
          <p className="hero-overview">{movie.overview}</p>
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-play">
              ▶ 재생
            </button>
            <button className="hero-btn hero-btn-info">
              ℹ 상세 정보
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;