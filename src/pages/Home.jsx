// // import React from 'react';

// // function Home() {
// //   return (
// //     <div className="home-page">
// //       <h1>홈</h1>
// //       <section>
// //         <h2>최신 영화</h2>
// //         {/* 나중에 영화 목록 추가 */}
// //       </section>
// //       <section>
// //         <h2>액션 영화</h2>
// //         {/* 나중에 영화 목록 추가 */}
// //       </section>
// //     </div>
// //   );
// // }

// // export default Home;

// import React, { useState, useEffect } from 'react';
// import { getNowPlayingMovies, getMoviesByGenre, GENRES } from '../services/tmdb';
// import MovieCard from '../components/MovieCard';
// import './Home.css';

// function Home() {
//   const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
//   const [actionMovies, setActionMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchMovies();
//   }, []);

//   const fetchMovies = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // 최신 영화와 액션 영화를 동시에 가져오기
//       const [nowPlayingData, actionData] = await Promise.all([
//         getNowPlayingMovies(),
//         getMoviesByGenre(GENRES.ACTION),
//       ]);

//       setNowPlayingMovies(nowPlayingData.results);
//       setActionMovies(actionData.results);
//     } catch (err) {
//       setError('영화 정보를 불러오는데 실패했습니다.');
//       console.error('영화 데이터 로딩 실패:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWishlistToggle = (movie) => {
//     console.log('찜하기 토글:', movie.title);
//     // 나중에 localStorage에 저장하는 로직 추가
//   };

//   if (loading) {
//     return (
//       <div className="home-page">
//         <div className="loading">로딩 중...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="home-page">
//         <div className="error">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="home-page">
//       <h1>홈</h1>

//       {/* 최신 영화 섹션 */}
//       <section className="movie-section">
//         <h2>최신 영화</h2>
//         <div className="movie-grid">
//           {nowPlayingMovies.map((movie) => (
//             <MovieCard
//               key={movie.id}
//               movie={movie}
//               onWishlistToggle={handleWishlistToggle}
//             />
//           ))}
//         </div>
//       </section>

//       {/* 액션 영화 섹션 */}
//       <section className="movie-section">
//         <h2>액션 영화</h2>
//         <div className="movie-grid">
//           {actionMovies.map((movie) => (
//             <MovieCard
//               key={movie.id}
//               movie={movie}
//               onWishlistToggle={handleWishlistToggle}
//             />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;

import React, { useState, useEffect } from 'react';
import { getNowPlayingMovies, getMoviesByGenre, GENRES } from '../services/tmdb';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import './Home.css';

function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // 최신 영화와 액션 영화를 동시에 가져오기
      const [nowPlayingData, actionData] = await Promise.all([
        getNowPlayingMovies(),
        getMoviesByGenre(GENRES.ACTION),
      ]);

      setNowPlayingMovies(nowPlayingData.results);
      setActionMovies(actionData.results);
      
      // 첫 번째 영화를 Hero 배너로 사용
      setFeaturedMovie(nowPlayingData.results[0]);
    } catch (err) {
      setError('영화 정보를 불러오는데 실패했습니다.');
      console.error('영화 데이터 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = (movie) => {
    console.log('찜하기 토글:', movie.title);
    // 나중에 localStorage에 저장하는 로직 추가
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero 배너 추가 */}
      <Hero movie={featuredMovie} />

      <div className="home-content">
        {/* 최신 영화 섹션 */}
        <section className="movie-section">
          <h2>최신 영화</h2>
          <div className="movie-grid">
            {nowPlayingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </section>

        {/* 액션 영화 섹션 */}
        <section className="movie-section">
          <h2>액션 영화</h2>
          <div className="movie-grid">
            {actionMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;