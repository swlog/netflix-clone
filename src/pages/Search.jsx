import { useState, useEffect, useRef, useCallback } from 'react';
import tmdbService from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';
import './Search.css';

const VIEW_MODES = {
  TABLE: 'table',
  INFINITE: 'infinite',
};

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: '인기순 (높음)', icon: 'fa-fire' },
  { value: 'popularity.asc', label: '인기순 (낮음)', icon: 'fa-fire' },
  { value: 'vote_average.desc', label: '평점 높은순', icon: 'fa-star' },
  { value: 'vote_average.asc', label: '평점 낮은순', icon: 'fa-star' },
  { value: 'release_date.desc', label: '최신순', icon: 'fa-calendar' },
  { value: 'release_date.asc', label: '오래된순', icon: 'fa-calendar' },
];

const GENRES = [
  { id: 28, name: '액션', icon: 'fa-fist-raised' },
  { id: 12, name: '모험', icon: 'fa-compass' },
  { id: 16, name: '애니메이션', icon: 'fa-film' },
  { id: 35, name: '코미디', icon: 'fa-laugh' },
  { id: 80, name: '범죄', icon: 'fa-user-secret' },
  { id: 18, name: '드라마', icon: 'fa-theater-masks' },
  { id: 10751, name: '가족', icon: 'fa-users' },
  { id: 14, name: '판타지', icon: 'fa-hat-wizard' },
  { id: 27, name: '공포', icon: 'fa-ghost' },
  { id: 10749, name: '로맨스', icon: 'fa-heart' },
  { id: 878, name: 'SF', icon: 'fa-rocket' },
  { id: 53, name: '스릴러', icon: 'fa-bolt' },
];

const TABLE_PAGE_SIZE = 20;

const Search = () => {
  // 상태 관리
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [minYear, setMinYear] = useState(1900);
  const [maxYear, setMaxYear] = useState(new Date().getFullYear());
  const [sortBy, setSortBy] = useState('popularity.desc');

  // 아코디언 상태
  const [accordionState, setAccordionState] = useState({
    sort: true,
    genre: true,
    rating: false,
    year: false,
  });

  const { isInWishlist, toggleWishlist } = useWishlist();

  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // 영화 데이터 fetch
  const fetchMovies = useCallback(
    async (page, append = false) => {
      try {
        if (viewMode === VIEW_MODES.INFINITE) {
          append ? setLoadingMore(true) : setLoading(true);
        } else {
          setLoading(true);
        }

        let data;

        // 검색어가 있으면 검색 API 사용
        if (searchQuery.trim()) {
          data = await tmdbService.searchMovies(searchQuery, page);
        } else {
          // 검색어가 없으면 discover API로 필터링
          const apiKey = localStorage.getItem('TMDb-Key');
          
          const params = {
            api_key: apiKey,
            language: 'ko-KR',
            page,
            sort_by: sortBy,
            'vote_average.gte': minRating,
            'primary_release_date.gte': `${minYear}-01-01`,
            'primary_release_date.lte': `${maxYear}-12-31`,
          };

          if (selectedGenres.length > 0) {
            params.with_genres = selectedGenres.join(',');
          }

          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?${new URLSearchParams(params)}`
          );
          data = await response.json();
        }

        const results = data.results || [];

        // 클라이언트 사이드 필터링 (검색 시에만)
        let filteredResults = results;
        if (searchQuery.trim()) {
          filteredResults = results.filter((movie) => {
            const ratingMatch = movie.vote_average >= minRating;
            const yearMatch =
              movie.release_date &&
              new Date(movie.release_date).getFullYear() >= minYear &&
              new Date(movie.release_date).getFullYear() <= maxYear;
            const genreMatch =
              selectedGenres.length === 0 ||
              selectedGenres.some((genreId) =>
                movie.genre_ids?.includes(genreId)
              );

            return ratingMatch && yearMatch && genreMatch;
          });
        }

        setMovies((prev) => (append ? [...prev, ...filteredResults] : filteredResults));
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (error) {
        console.error('영화 검색 실패:', error);
        toast.error('영화 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedGenres, minRating, minYear, maxYear, sortBy, viewMode]
  );

  // 초기 로드
  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1);
  }, [fetchMovies]);

  // View 모드 전환 시
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [viewMode]);

  // 테이블 뷰 표시
  const displayedMovies =
    viewMode === VIEW_MODES.TABLE ? movies.slice(0, TABLE_PAGE_SIZE) : movies;

  // 무한 스크롤
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          currentPage < totalPages
        ) {
          const next = currentPage + 1;
          setCurrentPage(next);
          fetchMovies(next, true);
        }
      },
      { rootMargin: '200px' }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [viewMode, currentPage, totalPages, loadingMore, loading, fetchMovies]);

  // 스크롤 감지
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE) return;

    const onScroll = () => setShowTopButton(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [viewMode]);

  // 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(page);
    if (viewMode === VIEW_MODES.INFINITE) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWishlist = (movie) => {
  const added = toggleWishlist(movie);
  
  if (added) {
    toast.success(`${movie.title} 위시리스트에 추가되었습니다.`, {
      position: "bottom-right",
      icon: "❤️", // ⭐ 하트 아이콘
      duration: 2000,
    });
  } else {
    toast(`${movie.title} 위시리스트에서 제거되었습니다`, {
      position: "bottom-right",
      icon: "💔", // ⭐ 깨진 하트 아이콘
      duration: 2000,
    });
  }
};

  const handleGenreToggle = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setMinRating(0);
    setMinYear(1900);
    setMaxYear(new Date().getFullYear());
    setSortBy('popularity.desc');
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies(1);
  };

  // 아코디언 토글
  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 페이지네이션 번호
  const getPaginationNumbers = () => {
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className={`search-page ${viewMode}-mode`}>
      {/* 헤더 */}
      <div className="search-header">
        <div className="header-top">
          <h1>
            <i className="fas fa-search"></i>
            찾아보기
          </h1>
          <div className="header-actions">
            <button
              className="filter-toggle-btn"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <i className={`fas fa-${filterOpen ? 'times' : 'filter'}`}></i>
              {filterOpen ? '필터 닫기' : '필터 열기'}
            </button>
            <div className="view-toggle">
              <button
                className={viewMode === VIEW_MODES.TABLE ? 'active' : ''}
                onClick={() => setViewMode(VIEW_MODES.TABLE)}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={viewMode === VIEW_MODES.INFINITE ? 'active' : ''}
                onClick={() => setViewMode(VIEW_MODES.INFINITE)}
              >
                <i className="fas fa-stream"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 검색창 */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="영화 제목을 입력하세요..."
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn">
            <i className="fas fa-search"></i>
            검색
          </button>
        </form>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="search-content">
        {/* 필터 사이드바 */}
        <aside className={`filter-sidebar ${filterOpen ? 'open' : 'closed'}`}>
          <div className="filter-header">
            <h3>
              <i className="fas fa-sliders-h"></i>
              필터
            </h3>
            <button className="reset-btn" onClick={handleReset}>
              <i className="fas fa-redo"></i>
              초기화
            </button>
          </div>

          {/* 정렬 - 아코디언 */}
          <div className="filter-section accordion-section">
            <div 
              className="filter-label accordion-header"
              onClick={() => toggleAccordion('sort')}
            >
              <span className="label-text">
                <i className="fas fa-sort"></i>
                정렬
              </span>
              <i className={`fas fa-chevron-${accordionState.sort ? 'up' : 'down'} accordion-icon`}></i>
            </div>
            <div className={`accordion-content ${accordionState.sort ? 'open' : ''}`}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 장르 - 아코디언 */}
          <div className="filter-section accordion-section">
            <div 
              className="filter-label accordion-header"
              onClick={() => toggleAccordion('genre')}
            >
              <span className="label-text">
                <i className="fas fa-tags"></i>
                장르 {selectedGenres.length > 0 && `(${selectedGenres.length})`}
              </span>
              <i className={`fas fa-chevron-${accordionState.genre ? 'up' : 'down'} accordion-icon`}></i>
            </div>
            <div className={`accordion-content ${accordionState.genre ? 'open' : ''}`}>
              <div className="genre-grid">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    className={`genre-btn ${
                      selectedGenres.includes(genre.id) ? 'active' : ''
                    }`}
                    onClick={() => handleGenreToggle(genre.id)}
                  >
                    <i className={`fas ${genre.icon}`}></i>
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 평점 - 아코디언 */}
          <div className="filter-section accordion-section">
            <div 
              className="filter-label accordion-header"
              onClick={() => toggleAccordion('rating')}
            >
              <span className="label-text">
                <i className="fas fa-star"></i>
                최소 평점: {minRating.toFixed(1)}
              </span>
              <i className={`fas fa-chevron-${accordionState.rating ? 'up' : 'down'} accordion-icon`}></i>
            </div>
            <div className={`accordion-content ${accordionState.rating ? 'open' : ''}`}>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="filter-range"
              />
              <div className="range-labels">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* 개봉년도 - 아코디언 */}
          <div className="filter-section accordion-section">
            <div 
              className="filter-label accordion-header"
              onClick={() => toggleAccordion('year')}
            >
              <span className="label-text">
                <i className="fas fa-calendar"></i>
                개봉년도 ({minYear} ~ {maxYear})
              </span>
              <i className={`fas fa-chevron-${accordionState.year ? 'up' : 'down'} accordion-icon`}></i>
            </div>
            <div className={`accordion-content ${accordionState.year ? 'open' : ''}`}>
              <div className="year-inputs">
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={minYear}
                  onChange={(e) => setMinYear(Number(e.target.value))}
                  className="year-input"
                  placeholder="시작"
                />
                <span className="year-separator">~</span>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={maxYear}
                  onChange={(e) => setMaxYear(Number(e.target.value))}
                  className="year-input"
                  placeholder="끝"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* 영화 리스트 */}
        <div className="movies-container">
          {loading && currentPage === 1 ? (
            <div className="loading-spinner">
              <i className="fas fa-film"></i>
              <p>검색 중...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>검색 결과가 없습니다</h3>
              <p>다른 검색어나 필터를 시도해보세요</p>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  <i className="fas fa-film"></i>
                  총 <strong>{movies.length}</strong>개의 영화를 찾았습니다
                </p>
              </div>

              <div className="movies-grid">
                {displayedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isInWishlist={isInWishlist(movie.id)}
                    onToggleWishlist={handleWishlist}
                  />
                ))}
              </div>

              {/* 페이지네이션 (테이블 뷰) */}
              {viewMode === VIEW_MODES.TABLE && totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="pagination-arrow"
                  >
                    이전
                  </button>

                  <div className="pagination-numbers">
                    {getPaginationNumbers().map((page) => (
                      <button
                        key={page}
                        className={page === currentPage ? 'active' : ''}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="pagination-arrow"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}

          {/* 무한 스크롤 로딩 */}
          {viewMode === VIEW_MODES.INFINITE && (
            <div ref={loadingRef} className="infinite-loading">
              {loadingMore && <p>불러오는 중...</p>}
              {currentPage >= totalPages && movies.length > 0 && (
                <p>모든 콘텐츠를 확인했습니다</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Top 버튼 */}
      {viewMode === VIEW_MODES.INFINITE && showTopButton && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Search;