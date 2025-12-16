import React from 'react';
import tmdbService from '../services/tmdb';
import './Hero.css';

function Hero({ movie }) {
  if (!movie) return null;

  const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date?.split('-')[0] || '';

  return (
    <div className="hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">{movie.title}</h1>
          
          <div className="hero-meta">
            <span className="hero-rating">
              <i className="fas fa-star"></i>
              {movie.vote_average?.toFixed(1)}
            </span>
            <span className="hero-year">{releaseYear}</span>
          </div>
          
          <p className="hero-overview">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </p>
          
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-play">
              <i className="fas fa-play"></i>
              재생
            </button>
            <button className="hero-btn hero-btn-info">
              <i className="fas fa-info-circle"></i>
              상세 정보
            </button>
            <button className="hero-btn hero-btn-add">
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;