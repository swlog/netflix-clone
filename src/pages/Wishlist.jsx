import { useState, useEffect, useRef } from 'react';
import MovieCard from '../components/MovieCard';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';
import './Wishlist.css';

const VIEW_MODES = {
  TABLE: 'table',
  INFINITE: 'infinite',
};

const SORT_OPTIONS = [
  { value: 'added_desc', label: '최근 추가순', icon: 'fa-clock' },
  { value: 'added_asc', label: '오래된 추가순', icon: 'fa-history' },
  { value: 'rating_desc', label: '평점 높은순', icon: 'fa-star' },
  { value: 'rating_asc', label: '평점 낮은순', icon: 'fa-star' },
  { value: 'title_asc', label: '제목순 (가나다)', icon: 'fa-sort-alpha-down' },
  { value: 'title_desc', label: '제목순 (역순)', icon: 'fa-sort-alpha-up' },
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
const INFINITE_LOAD_SIZE = 20;

const Wishlist = () => {
  // 상태 관리
  const [viewMode, setViewMode] = useState(VIEW_MODES.TABLE);
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [infiniteCount, setInfiniteCount] = useState(INFINITE_LOAD_SIZE);
  const [showTopButton, setShowTopButton] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('added_desc');

  // 아코디언 상태
  const [accordionState, setAccordionState] = useState({
    sort: true,
    genre: false,
    rating: false,
  });

  const { wishlist, isInWishlist, toggleWishlist, clearWishlist } = useWishlist();
  const loadingRef = useRef(null);
  const observerRef = useRef(null);

  // Local Storage에서 위시리스트 로드
  useEffect(() => {
    setWishlistMovies(wishlist);
  }, [wishlist]);

  // 필터링 및 정렬
  useEffect(() => {
    let filtered = [...wishlistMovies];

    // 검색 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 장르 필터
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        selectedGenres.some((genreId) => movie.genre_ids?.includes(genreId))
      );
    }

    // 평점 필터
    filtered = filtered.filter((movie) => movie.vote_average >= minRating);

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'added_desc':
          return (b.addedAt || 0) - (a.addedAt || 0);
        case 'added_asc':
          return (a.addedAt || 0) - (b.addedAt || 0);
        case 'rating_desc':
          return b.vote_average - a.vote_average;
        case 'rating_asc':
          return a.vote_average - b.vote_average;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setDisplayedMovies(filtered);
  }, [wishlistMovies, searchQuery, selectedGenres, minRating, sortBy]);

  // View 모드 전환
  useEffect(() => {
    setCurrentPage(1);
    setInfiniteCount(INFINITE_LOAD_SIZE);
    window.scrollTo({ top: 0 });
  }, [viewMode]);

  // 무한 스크롤
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && infiniteCount < displayedMovies.length) {
          setInfiniteCount((prev) => Math.min(prev + INFINITE_LOAD_SIZE, displayedMovies.length));
        }
      },
      { rootMargin: '200px' }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [viewMode, infiniteCount, displayedMovies.length]);

  // 스크롤 감지
  useEffect(() => {
    if (viewMode !== VIEW_MODES.INFINITE) return;

    const onScroll = () => setShowTopButton(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [viewMode]);

  // 통계 계산
  const stats = {
    total: displayedMovies.length,
    avgRating: displayedMovies.length
      ? (displayedMovies.reduce((sum, m) => sum + m.vote_average, 0) / displayedMovies.length).toFixed(1)
      : 0,
    topGenre: (() => {
      const genreCounts = {};
      displayedMovies.forEach((movie) => {
        movie.genre_ids?.forEach((id) => {
          genreCounts[id] = (genreCounts[id] || 0) + 1;
        });
      });
      const topId = Object.keys(genreCounts).reduce((a, b) =>
        genreCounts[a] > genreCounts[b] ? a : b, null
      );
      return GENRES.find((g) => g.id === Number(topId))?.name || '없음';
    })(),
  };

  // 핸들러
  const handleRemove = (movie) => {
    toggleWishlist(movie);
    toast.error(`${movie.title}을(를) 위시리스트에서 제거했습니다`, {
      position: 'bottom-right',
    });
  };

  const handleClearAll = () => {
    if (window.confirm('정말 모든 영화를 위시리스트에서 삭제하시겠습니까?')) {
      clearWishlist();
      toast.success('위시리스트를 모두 삭제했습니다', {
        position: 'bottom-right',
      });
    }
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setMinRating(0);
    setSortBy('added_desc');
  };

  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 페이지네이션
  const totalPages = Math.ceil(displayedMovies.length / TABLE_PAGE_SIZE);
  const paginatedMovies =
    viewMode === VIEW_MODES.TABLE
      ? displayedMovies.slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE)
      : displayedMovies.slice(0, infiniteCount);

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
    <div className={`wishlist-page ${viewMode}-mode`}>
      {/* 헤더 */}
      <div className="wishlist-header">
        <div className="header-top">
          <h1>
            <i className="fas fa-heart heart-icon"></i>
            내 위시리스트
          </h1>
          <div className="header-actions">
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(!filterOpen)}>
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
        <div className="search-bar">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="영화 제목을 검색하세요..."
              className="search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* 통계 대시보드 */}
        {wishlistMovies.length > 0 && (
          <div className="stats-dashboard">
            <div className="stat-card">
              <i className="fas fa-film"></i>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">총 영화</span>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-star"></i>
              <div className="stat-info">
                <span className="stat-value">{stats.avgRating}</span>
                <span className="stat-label">평균 평점</span>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-trophy"></i>
              <div className="stat-info">
                <span className="stat-value">{stats.topGenre}</span>
                <span className="stat-label">선호 장르</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="wishlist-content">
        {/* 필터 사이드바 */}
        {wishlistMovies.length > 0 && (
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
              <div className="filter-label accordion-header" onClick={() => toggleAccordion('sort')}>
                <span className="label-text">
                  <i className="fas fa-sort"></i>
                  정렬
                </span>
                <i className={`fas fa-chevron-${accordionState.sort ? 'up' : 'down'} accordion-icon`}></i>
              </div>
              <div className={`accordion-content ${accordionState.sort ? 'open' : ''}`}>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
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
              <div className="filter-label accordion-header" onClick={() => toggleAccordion('genre')}>
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
                      className={`genre-btn ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
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
              <div className="filter-label accordion-header" onClick={() => toggleAccordion('rating')}>
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

            {/* 전체 삭제 버튼 */}
            <button className="clear-all-btn" onClick={handleClearAll}>
              <i className="fas fa-trash-alt"></i>
              전체 삭제
            </button>
          </aside>
        )}

        {/* 영화 리스트 */}
        <div className="movies-container">
          {wishlistMovies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-heart-broken"></i>
              </div>
              <h2>위시리스트가 비어있습니다</h2>
              <p>마음에 드는 영화를 찾아 하트를 눌러보세요!</p>
              <a href="/" className="browse-btn">
                <i className="fas fa-search"></i>
                영화 둘러보기
              </a>
            </div>
          ) : displayedMovies.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>검색 결과가 없습니다</h3>
              <p>다른 검색어나 필터를 시도해보세요</p>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  <i className="fas fa-heart"></i>
                  총 <strong>{displayedMovies.length}</strong>개의 영화를 찜했습니다
                </p>
              </div>

              <div className="movies-grid">
                {paginatedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isInWishlist={true}
                    onToggleWishlist={handleRemove}
                  />
                ))}
              </div>

              {/* 페이지네이션 (테이블 뷰) */}
              {viewMode === VIEW_MODES.TABLE && totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="pagination-arrow"
                  >
                    이전
                  </button>
                  <div className="pagination-numbers">
                    {getPaginationNumbers().map((page) => (
                      <button
                        key={page}
                        className={page === currentPage ? 'active' : ''}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="pagination-arrow"
                  >
                    다음
                  </button>
                </div>
              )}

              {/* 무한 스크롤 로딩 */}
              {viewMode === VIEW_MODES.INFINITE && (
                <div ref={loadingRef} className="infinite-loading">
                  {infiniteCount >= displayedMovies.length ? (
                    <p>모든 영화를 확인했습니다</p>
                  ) : (
                    <p>불러오는 중...</p>
                  )}
                </div>
              )}
            </>
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

export default Wishlist;