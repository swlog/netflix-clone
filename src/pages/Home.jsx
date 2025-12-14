import { useEffect, useState, useRef } from 'react';
import { 
  getPopularMovies, 
  getNowPlayingMovies, 
  getMoviesByGenre,
  GENRES 
} from '../services/tmdb';
import toast from 'react-hot-toast';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 중복 에러 토스트 방지
  const hasShownError = useRef(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // 병렬로 영화 데이터 가져오기
        const [popularData, nowPlayingData, actionData] = await Promise.all([
          getPopularMovies(1),
          getNowPlayingMovies(1),
          getMoviesByGenre(GENRES.ACTION, 1),
        ]);

        setPopularMovies(popularData.results);
        setNowPlayingMovies(nowPlayingData.results);
        setActionMovies(actionData.results);
        
        // 성공 시 에러 플래그 리셋
        hasShownError.current = false;
        
      } catch (error) {
        console.error('영화 목록 로딩 실패:', error);
        
        // 에러 토스트를 한 번만 표시
        if (!hasShownError.current) {
          hasShownError.current = true;
          
          if (error.message.includes('유효하지 않은 TMDB API 키')) {
            toast.error('유효하지 않은 TMDB API 키입니다. 올바른 API 키로 다시 가입해주세요.', {
              duration: 5000,
              position: 'top-center',
              id: 'api-key-error', // 고유 ID로 중복 방지
            });
          } else {
            toast.error('영화 정보를 불러올 수 없습니다.', {
              duration: 4000,
              position: 'top-center',
              id: 'movie-fetch-error', // 고유 ID로 중복 방지
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 영화 목록 표시
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🎬 영화 탐색</h1>
      </header>

      {/* 인기 영화 */}
      <section className="movie-section">
        <h2>인기 영화</h2>
        <div className="movie-grid">
          {popularMovies.slice(0, 10).map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p> {movie.vote_average.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 최신 영화 */}
      <section className="movie-section">
        <h2>최신 영화</h2>
        <div className="movie-grid">
          {nowPlayingMovies.slice(0, 10).map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p> {movie.vote_average.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 액션 영화 */}
      <section className="movie-section">
        <h2>액션 영화</h2>
        <div className="movie-grid">
          {actionMovies.slice(0, 10).map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p> {movie.vote_average.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;