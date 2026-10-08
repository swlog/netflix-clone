import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import tmdbService from "../services/tmdb";
import Hero from "../components/Hero";
import ContentRow from "../components/ContentRow";
import MovieModal from "../components/MovieModal";
import Loading from "../components/Loading";
import { useWishlist } from "../hooks/useWishlist";
import toast from "react-hot-toast";
import "./Home.css";

const {
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  GENRES,
} = tmdbService;

const Home = () => {
  const [rows, setRows] = useState({
    popular: [],
    nowPlaying: [],
    topRated: [],
    upcoming: [],
    action: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { wishlist, isInWishlist, toggleWishlist } = useWishlist();

  const hasShownError = useRef(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const [popular, nowPlaying, topRated, upcoming, action] = await Promise.all([
          getPopularMovies(1),
          getNowPlayingMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1),
          getMoviesByGenre(GENRES.ACTION, 1),
        ]);

        setRows({
          popular: popular.results,
          nowPlaying: nowPlaying.results,
          topRated: topRated.results,
          upcoming: upcoming.results,
          action: action.results,
        });

        hasShownError.current = false;
      } catch (error) {
        console.error("영화 목록 로딩 실패:", error);

        if (!hasShownError.current) {
          hasShownError.current = true;

          toast.error("영화 정보를 불러올 수 없습니다.", {
            duration: 4000,
            position: "top-center",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // 히어로 배너: 인기 영화 상위 10개 중 배경 이미지와 줄거리가 있는 작품을 무작위로 하나 선택
  const heroMovie = useMemo(() => {
    const candidates = rows.popular
      .slice(0, 10)
      .filter((movie) => movie.backdrop_path && movie.overview);
    if (candidates.length === 0) return rows.popular[0] || null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }, [rows.popular]);

  const handleToggleWishlist = (movie) => {
    const added = toggleWishlist(movie);

    if (added) {
      toast.success(`'${movie.title}'을(를) 내가 찜한 콘텐츠에 추가했습니다.`, {
        position: "bottom-right",
        duration: 2000,
      });
    } else {
      toast(`'${movie.title}'을(를) 내가 찜한 콘텐츠에서 삭제했습니다.`, {
        position: "bottom-right",
        duration: 2000,
      });
    }
  };

  const closeModal = useCallback(() => setSelectedMovie(null), []);

  if (loading) {
    return <Loading />;
  }

  const rowList = [
    { id: "popular", title: "넷플릭스 인기 콘텐츠", movies: rows.popular },
    { id: "wishlist", title: "내가 찜한 콘텐츠", movies: wishlist },
    { id: "nowPlaying", title: "지금 극장에서 상영 중인 영화", movies: rows.nowPlaying },
    { id: "topRated", title: "평단의 찬사를 받은 영화", movies: rows.topRated },
    { id: "upcoming", title: "공개 예정 콘텐츠", movies: rows.upcoming },
    { id: "action", title: "짜릿한 액션 영화", movies: rows.action },
  ];

  return (
    <div className="home-container">
      {heroMovie && <Hero movie={heroMovie} onMoreInfo={setSelectedMovie} />}

      <div className="home-rows">
        {rowList.map((row) => (
          <ContentRow
            key={row.id}
            title={row.title}
            movies={row.movies}
            isInWishlist={isInWishlist}
            onSelect={setSelectedMovie}
          />
        ))}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isInWishlist={isInWishlist(selectedMovie.id)}
          onToggleWishlist={handleToggleWishlist}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Home;
