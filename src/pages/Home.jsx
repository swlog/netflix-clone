import { useEffect, useState, useRef } from 'react';
import tmdbService from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import Hero from '../components/Hero';  // ⭐ Hero 추가
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';
import './Home.css';

const { 
  getPopularMovies, 
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  GENRES 
} = tmdbService;

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { wishlist, isInWishlist, toggleWishlist } = useWishlist();
  const hasShownError = useRef(false);
  const sliderRefs = useRef({});

  const scroll = (sectionId, direction) => {
    const slider = sliderRefs.current[sectionId];
    if (!slider) return;
    const scrollAmount = direction === 'left' ? -600 : 600;
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const [
          popularData, 
          nowPlayingData, 
          topRatedData,
          upcomingData,
          actionData
        ] = await Promise.all([
          getPopularMovies(1),
          getNowPlayingMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1),
          getMoviesByGenre(GENRES.ACTION, 1),
        ]);

        setPopularMovies(popularData.results);
        setNowPlayingMovies(nowPlayingData.results);
        setTopRatedMovies(topRatedData.results);
        setUpcomingMovies(upcomingData.results);
        setActionMovies(actionData.results);
        
        hasShownError.current = false;
        
      } catch (error) {
        console.error('영화 목록 로딩 실패:', error);
        
        if (!hasShownError.current) {
          hasShownError.current = true;
          
          if (error.message.includes('유효하지 않은 TMDB API 키')) {
            toast.error('유효하지 않은 TMDB API 키입니다. 올바른 API 키로 다시 가입해주세요.', {
              duration: 5000,
              position: 'top-center',
              id: 'api-key-error',
            });
          } else {
            toast.error('영화 정보를 불러올 수 없습니다.', {
              duration: 4000,
              position: 'top-center',
              id: 'movie-fetch-error',
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-film"></i>
        </div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  // ⭐ 히어로 배너에 표시할 영화 (인기 영화 1위)
  const heroMovie = popularMovies[0];

  return (
    <div className="home-container">
      {/* ⭐ 히어로 배너 - 기존 hero-section 대체 */}
      {heroMovie && (
        <Hero 
          movie={heroMovie} 
          isInWishlist={isInWishlist(heroMovie.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 메인 콘텐츠 - 기존 슬라이더 그대로 유지 */}
      <div className="home-content">
        
        {/* 내 위시리스트 */}
        {wishlist.length > 0 && (
          <section className="movie-section wishlist-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-heart"></i>
                내 위시리스트
              </h2>
              <span className="movie-count">{wishlist.length}개</span>
            </div>
            
            <button 
              className="slider-nav-btn prev"
              onClick={() => scroll('wishlist', 'left')}
              aria-label="이전"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="slider-nav-btn next"
              onClick={() => scroll('wishlist', 'right')}
              aria-label="다음"
            >
              <i className="fas fa-chevron-right"></i>
            </button>

            <div 
              className="movie-grid"
              ref={(el) => sliderRefs.current['wishlist'] = el}
            >
              {wishlist.slice(0, 20).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWishlist={true}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* 인기 영화 */}
        <section className="movie-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-fire"></i>
              인기 영화
            </h2>
            <span className="movie-count">{popularMovies.length}개</span>
          </div>
          
          <button 
            className="slider-nav-btn prev"
            onClick={() => scroll('popular', 'left')}
            aria-label="이전"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="slider-nav-btn next"
            onClick={() => scroll('popular', 'right')}
            aria-label="다음"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div 
            className="movie-grid"
            ref={(el) => sliderRefs.current['popular'] = el}
          >
            {popularMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWishlist={isInWishlist(movie.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </section>

        {/* 최신 개봉 영화 */}
        <section className="movie-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-ticket-alt"></i>
              최신 개봉
            </h2>
            <span className="movie-count">{nowPlayingMovies.length}개</span>
          </div>
          
          <button 
            className="slider-nav-btn prev"
            onClick={() => scroll('nowPlaying', 'left')}
            aria-label="이전"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="slider-nav-btn next"
            onClick={() => scroll('nowPlaying', 'right')}
            aria-label="다음"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div 
            className="movie-grid"
            ref={(el) => sliderRefs.current['nowPlaying'] = el}
          >
            {nowPlayingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWishlist={isInWishlist(movie.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </section>

        {/* 평점 높은 영화 */}
        <section className="movie-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-star"></i>
              평점 높은 영화
            </h2>
            <span className="movie-count">{topRatedMovies.length}개</span>
          </div>
          
          <button 
            className="slider-nav-btn prev"
            onClick={() => scroll('topRated', 'left')}
            aria-label="이전"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="slider-nav-btn next"
            onClick={() => scroll('topRated', 'right')}
            aria-label="다음"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div 
            className="movie-grid"
            ref={(el) => sliderRefs.current['topRated'] = el}
          >
            {topRatedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWishlist={isInWishlist(movie.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </section>

        {/* 개봉 예정 */}
        <section className="movie-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-calendar-alt"></i>
              개봉 예정
            </h2>
            <span className="movie-count">{upcomingMovies.length}개</span>
          </div>
          
          <button 
            className="slider-nav-btn prev"
            onClick={() => scroll('upcoming', 'left')}
            aria-label="이전"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="slider-nav-btn next"
            onClick={() => scroll('upcoming', 'right')}
            aria-label="다음"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div 
            className="movie-grid"
            ref={(el) => sliderRefs.current['upcoming'] = el}
          >
            {upcomingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWishlist={isInWishlist(movie.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </section>

        {/* 액션 영화 */}
        <section className="movie-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-bomb"></i>
              액션 영화
            </h2>
            <span className="movie-count">{actionMovies.length}개</span>
          </div>
          
          <button 
            className="slider-nav-btn prev"
            onClick={() => scroll('action', 'left')}
            aria-label="이전"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="slider-nav-btn next"
            onClick={() => scroll('action', 'right')}
            aria-label="다음"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div 
            className="movie-grid"
            ref={(el) => sliderRefs.current['action'] = el}
          >
            {actionMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWishlist={isInWishlist(movie.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;