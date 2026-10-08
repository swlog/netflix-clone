import React, { useEffect, useState } from 'react';
import tmdbService from '../services/tmdb';
import './Hero.css';

// 국내 관람등급 → 배지 색상
const RATING_COLORS = {
  ALL: '#2a9d3c',
  12: '#e5b50a',
  15: '#e8811a',
  18: '#d6181c',
  19: '#d6181c',
};

// release_dates 응답에서 한국(KR) 관람등급 추출
const getKoreanRating = (releaseDates) => {
  const kr = releaseDates?.results?.find((r) => r.iso_3166_1 === 'KR');
  const cert = kr?.release_dates?.find((d) => d.certification)?.certification;
  if (!cert) return null;
  return cert.toUpperCase() === 'ALL' ? 'ALL' : cert;
};

// 로고 이미지: 한국어 → 영어 → 언어 없음 순으로 선택
const pickLogo = (logos = []) =>
  logos.find((l) => l.iso_639_1 === 'ko') ||
  logos.find((l) => l.iso_639_1 === 'en') ||
  logos[0] ||
  null;

function Hero({ movie, onMoreInfo }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!movie) return;
    let cancelled = false;
    setDetails(null);

    tmdbService
      .getHeroDetails(movie.id)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch(() => {
        // 로고/등급은 부가 정보라 실패해도 텍스트 제목으로 표시
      });

    return () => {
      cancelled = true;
    };
  }, [movie]);

  if (!movie) return null;

  const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'original');
  const logo = pickLogo(details?.images?.logos);
  const rating = getKoreanRating(details?.release_dates);

  return (
    <section className="hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="hero-vignette" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-n">N</span>
          <span className="hero-badge-text">영화</span>
        </div>

        {logo ? (
          <img
            className="hero-logo"
            src={tmdbService.getImageUrl(logo.file_path, 'w500')}
            alt={movie.title}
          />
        ) : (
          <h1 className="hero-title">{movie.title}</h1>
        )}

        <p className="hero-overview">{movie.overview || '줄거리 정보가 없습니다.'}</p>

        <div className="hero-buttons">
          <button className="hero-btn hero-btn-play">
            <i className="fas fa-play"></i>
            재생
          </button>
          <button className="hero-btn hero-btn-info" onClick={() => onMoreInfo(movie)}>
            <i className="fas fa-circle-info"></i>
            상세 정보
          </button>
        </div>
      </div>

      {rating && (
        <div className="hero-maturity">
          <span
            className="hero-maturity-badge"
            style={{ backgroundColor: RATING_COLORS[rating] || '#555' }}
          >
            {rating}
          </span>
        </div>
      )}
    </section>
  );
}

export default Hero;
