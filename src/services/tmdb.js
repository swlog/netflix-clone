import api from './api';

// 이미지 URL 생성 헬퍼 함수
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${process.env.REACT_APP_TMDB_IMAGE_URL}/${size}${path}`;
};

// 최신 영화 (Now Playing)
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('최신 영화 가져오기 실패:', error);
    throw error;
  }
};

// 인기 영화 (Popular)
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('인기 영화 가져오기 실패:', error);
    throw error;
  }
};

// 높은 평점 영화 (Top Rated)
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('높은 평점 영화 가져오기 실패:', error);
    throw error;
  }
};

// 장르별 영화 검색 (예: 액션)
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('장르별 영화 가져오기 실패:', error);
    throw error;
  }
};

// 영화 검색
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('영화 검색 실패:', error);
    throw error;
  }
};

// 영화 상세 정보
export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('영화 상세 정보 가져오기 실패:', error);
    throw error;
  }
};

// 장르 목록 가져오기
export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('장르 목록 가져오기 실패:', error);
    throw error;
  }
};

// 자주 사용하는 장르 ID
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};