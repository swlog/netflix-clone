import { useState, useEffect, useRef, useCallback } from "react";
import tmdbService from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { useWishlist } from "../hooks/useWishlist";
import toast from "react-hot-toast";
import "./Search.css";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "인기순" },
  { value: "vote_average.desc", label: "평점순" },
  { value: "release_date.desc", label: "최신순" },
  { value: "title.asc", label: "제목순" },
];

const RATING_OPTIONS = [
  { value: 0, label: "전체 평점" },
  { value: 9, label: "⭐ 9점 이상" },
  { value: 8, label: "⭐ 8점 이상" },
  { value: 7, label: "⭐ 7점 이상" },
  { value: 6, label: "⭐ 6점 이상" },
];

const GENRES = [
  { id: 28, name: "액션" },
  { id: 12, name: "모험" },
  { id: 16, name: "애니메이션" },
  { id: 35, name: "코미디" },
  { id: 80, name: "범죄" },
  { id: 18, name: "드라마" },
  { id: 10749, name: "로맨스" },
  { id: 878, name: "SF" },
  { id: 27, name: "공포" },
  { id: 53, name: "스릴러" },
  { id: 14, name: "판타지" },
  { id: 9648, name: "미스터리" },
];

const MAX_RECENT = 5;

const Search = () => {
  /* ================= 상태 ================= */
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  /* ================= 필터 ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [minRating, setMinRating] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]);

  /* ================= 최근 검색 ================= */
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches") || "[]")
  );
  const [showRecent, setShowRecent] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const observerRef = useRef(null);

  /* ================= 데이터 fetch ================= */
  const fetchMovies = useCallback(
    async (pageNum) => {
      try {
        setLoading(true);

        let data;
        if (searchQuery.trim()) {
          data = await tmdbService.searchMovies(searchQuery, pageNum);
        } else {
          const apiKey = localStorage.getItem("TMDb-Key");
          const params = {
            api_key: apiKey,
            language: "ko-KR",
            page: pageNum,
            sort_by: sortBy,
            "vote_average.gte": minRating,
          };

          if (selectedGenres.length > 0) {
            params.with_genres = selectedGenres.join(",");
          }

          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?${new URLSearchParams(
              params
            )}`
          );
          data = await res.json();
        }

        setMovies((prev) =>
          pageNum === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(pageNum < data.total_pages);
      } catch {
        toast.error("영화 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, sortBy, minRating, selectedGenres]
  );

  /* ================= 필터 변경 시 초기화 ================= */
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMovies(1);
  }, [fetchMovies]);

  /* ================= 무한 스크롤 ================= */
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchMovies(page);
  }, [page, fetchMovies]);

  /* ================= Top 버튼 ================= */
  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= 검색 ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter((q) => q !== searchQuery),
    ].slice(0, MAX_RECENT);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleGenreToggle = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>
          <i className="fas fa-search"></i> 찾아보기
        </h1>

        {/* ===== 검색 ===== */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowRecent(true)}
              onBlur={() => setTimeout(() => setShowRecent(false), 150)}
              placeholder="영화 제목을 입력하세요"
            />

            {showRecent && recentSearches.length > 0 && (
              <div className="recent-search-box">
                <div className="recent-header">
                  <span>최근 검색어</span>
                  <button
                    type="button"
                    className="recent-clear"
                    onMouseDown={() => {
                      setRecentSearches([]);
                      localStorage.removeItem("recentSearches");
                    }}
                  >
                    전체 삭제
                  </button>
                </div>

                {recentSearches.map((q, i) => (
                  <div key={i} className="recent-item">
                    <button
                      className="recent-keyword"
                      type="button"
                      onMouseDown={() => setSearchQuery(q)}
                    >
                      <i className="fas fa-history"></i> {q}
                    </button>
                    <button
                      className="recent-delete"
                      type="button"
                      onMouseDown={() => {
                        const updated = recentSearches.filter(
                          (_, idx) => idx !== i
                        );
                        setRecentSearches(updated);
                        localStorage.setItem(
                          "recentSearches",
                          JSON.stringify(updated)
                        );
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="search-submit-btn">검색</button>
        </form>

        {/* ===== 정렬 / 평점 / 장르 ===== */}
        <div className="compact-filter-bar">
          <select
            className="compact-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            className="compact-select"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {RATING_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="compact-genres">
            {GENRES.map((g) => (
              <button
                key={g.id}
                className={selectedGenres.includes(g.id) ? "active" : ""}
                onClick={() => handleGenreToggle(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
          <button
            className="compact-reset"
            onClick={() => {
              setSearchQuery("");
              setSelectedGenres([]);
              setSortBy("popularity.desc");
              setMinRating(0);
              setPage(1);
              setMovies([]);
              setHasMore(true);
            }}
          >
            초기화
          </button>
        </div>
      </div>

      {/* ===== 결과 ===== */}
      <div className="movies-container">
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWishlist={isInWishlist(movie.id)}
              onToggleWishlist={() => toggleWishlist(movie)}
            />
          ))}
        </div>

        {hasMore && (
          <div ref={observerRef} className="loading">
            로딩 중...
          </div>
        )}
      </div>

      {showTopButton && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </div>
  );
};

export default Search;
