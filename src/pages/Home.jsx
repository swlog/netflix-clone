import { useEffect, useState, useRef } from "react";
import tmdbService from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import Hero from "../components/Hero";
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
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ 히어로 배너 인덱스
  const [heroIndex, setHeroIndex] = useState(0);

  const { isInWishlist, toggleWishlist } = useWishlist();

  const hasShownError = useRef(false);
  const sliderRefs = useRef({});
  const heroIntervalRef = useRef(null);

  const scroll = (sectionId, direction) => {
    const slider = sliderRefs.current[sectionId];
    if (!slider) return;
    const scrollAmount = direction === "left" ? -600 : 600;
    slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
          actionData,
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

  // ⭐ 히어로 배너 자동 슬라이드 (10초, 중복 방지)
  useEffect(() => {
    if (popularMovies.length === 0) return;
    if (heroIntervalRef.current) return;

    heroIntervalRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(5, popularMovies.length));
    }, 10000);

    return () => {
      clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = null;
    };
  }, [popularMovies]);

  const handleToggleWishlist = (movie) => {
    const added = toggleWishlist(movie);

    if (added) {
      toast.success(`${movie.title} 위시리스트에 추가되었습니다.`, {
        position: "bottom-right",
        icon: "❤️", // ⭐ 하트 아이콘 추가
        duration: 2000,
      });
    } else {
      toast(`${movie.title} 위시리스트에서 제거되었습니다 `, {
        position: "bottom-right",
        icon: "💔", // ⭐ 깨진 하트 아이콘
        duration: 2000,
      });
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

  const heroMovies = popularMovies.slice(0, 5);
  const currentHeroMovie = heroMovies[heroIndex];

  return (
    <div className="home-container">
      {currentHeroMovie && (
        <Hero
          movie={currentHeroMovie}
          isInWishlist={isInWishlist(currentHeroMovie.id)}
          onToggleWishlist={handleToggleWishlist}
          currentIndex={heroIndex}
          totalSlides={heroMovies.length}
          onSlideChange={setHeroIndex}
        />
      )}
      {/* 인기 영화 */}{" "}
      <section className="movie-section">
        {" "}
        <div className="section-header">
          {" "}
          <h2>
            {" "}
            <i className="fas fa-fire"></i> 인기 영화{" "}
          </h2>{" "}
          <span className="movie-count">{popularMovies.length}개</span>{" "}
        </div>{" "}
        <button
          className="slider-nav-btn prev"
          onClick={() => scroll("popular", "left")}
          aria-label="이전"
        >
          {" "}
          <i className="fas fa-chevron-left"></i>{" "}
        </button>{" "}
        <button
          className="slider-nav-btn next"
          onClick={() => scroll("popular", "right")}
          aria-label="다음"
        >
          {" "}
          <i className="fas fa-chevron-right"></i>{" "}
        </button>{" "}
        <div
          className="movie-grid"
          ref={(el) => (sliderRefs.current["popular"] = el)}
        >
          {" "}
          {popularMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 최신 개봉 영화 */}{" "}
      <section className="movie-section">
        {" "}
        <div className="section-header">
          {" "}
          <h2>
            {" "}
            <i className="fas fa-ticket-alt"></i> 최신 개봉{" "}
          </h2>{" "}
          <span className="movie-count">{nowPlayingMovies.length}개</span>{" "}
        </div>{" "}
        <button
          className="slider-nav-btn prev"
          onClick={() => scroll("nowPlaying", "left")}
          aria-label="이전"
        >
          {" "}
          <i className="fas fa-chevron-left"></i>{" "}
        </button>{" "}
        <button
          className="slider-nav-btn next"
          onClick={() => scroll("nowPlaying", "right")}
          aria-label="다음"
        >
          {" "}
          <i className="fas fa-chevron-right"></i>{" "}
        </button>{" "}
        <div
          className="movie-grid"
          ref={(el) => (sliderRefs.current["nowPlaying"] = el)}
        >
          {" "}
          {nowPlayingMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 평점 높은 영화 */}{" "}
      <section className="movie-section">
        {" "}
        <div className="section-header">
          {" "}
          <h2>
            {" "}
            <i className="fas fa-star"></i> 평점 높은 영화{" "}
          </h2>{" "}
          <span className="movie-count">{topRatedMovies.length}개</span>{" "}
        </div>{" "}
        <button
          className="slider-nav-btn prev"
          onClick={() => scroll("topRated", "left")}
          aria-label="이전"
        >
          {" "}
          <i className="fas fa-chevron-left"></i>{" "}
        </button>{" "}
        <button
          className="slider-nav-btn next"
          onClick={() => scroll("topRated", "right")}
          aria-label="다음"
        >
          {" "}
          <i className="fas fa-chevron-right"></i>{" "}
        </button>{" "}
        <div
          className="movie-grid"
          ref={(el) => (sliderRefs.current["topRated"] = el)}
        >
          {" "}
          {topRatedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 개봉 예정 */}{" "}
      <section className="movie-section">
        {" "}
        <div className="section-header">
          {" "}
          <h2>
            {" "}
            <i className="fas fa-calendar-alt"></i> 개봉 예정{" "}
          </h2>{" "}
          <span className="movie-count">{upcomingMovies.length}개</span>{" "}
        </div>{" "}
        <button
          className="slider-nav-btn prev"
          onClick={() => scroll("upcoming", "left")}
          aria-label="이전"
        >
          {" "}
          <i className="fas fa-chevron-left"></i>{" "}
        </button>{" "}
        <button
          className="slider-nav-btn next"
          onClick={() => scroll("upcoming", "right")}
          aria-label="다음"
        >
          {" "}
          <i className="fas fa-chevron-right"></i>{" "}
        </button>{" "}
        <div
          className="movie-grid"
          ref={(el) => (sliderRefs.current["upcoming"] = el)}
        >
          {" "}
          {upcomingMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* 액션 영화 */}{" "}
      <section className="movie-section">
        {" "}
        <div className="section-header">
          {" "}
          <h2>
            {" "}
            <i className="fas fa-bomb"></i> 액션 영화{" "}
          </h2>{" "}
          <span className="movie-count">{actionMovies.length}개</span>{" "}
        </div>{" "}
        <button
          className="slider-nav-btn prev"
          onClick={() => scroll("action", "left")}
          aria-label="이전"
        >
          {" "}
          <i className="fas fa-chevron-left"></i>{" "}
        </button>{" "}
        <button
          className="slider-nav-btn next"
          onClick={() => scroll("action", "right")}
          aria-label="다음"
        >
          {" "}
          <i className="fas fa-chevron-right"></i>{" "}
        </button>{" "}
        <div
          className="movie-grid"
          ref={(el) => (sliderRefs.current["action"] = el)}
        >
          {" "}
          {actionMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}{" "}
        </div>{" "}
      </section>
    </div>
  );
};

export default Home;
