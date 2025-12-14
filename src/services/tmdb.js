import axios from 'axios';
import { getTMDbAPIKey } from '../utils/auth';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// 장르 상수
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

/**
 * axios 인스턴스 생성
 */
const createAxiosInstance = () => {
  const apiKey = getTMDbAPIKey();

  if (!apiKey) {
    throw new Error('TMDB API 키가 없습니다. 로그인해주세요.');
  }

  const instance = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: apiKey,
      language: 'ko-KR',
    },
  });

  // 응답 인터셉터: API 키 오류 처리
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        throw new Error('유효하지 않은 TMDB API 키입니다. 올바른 API 키를 사용해주세요.');
      }
      throw error;
    }
  );

  return instance;
};

/**
 * 이미지 URL 생성
 * @param {string} path - 이미지 경로
 * @param {string} size - 이미지 크기 (w500, original 등)
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * 인기 영화 목록 가져오기
 * @param {number} page - 페이지 번호
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('인기 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 현재 상영중인 영화 목록 가져오기
 * @param {number} page - 페이지 번호
 */
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('현재 상영중 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 개봉 예정 영화 목록 가져오기
 * @param {number} page - 페이지 번호
 */
export const getUpcomingMovies = async (page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('개봉 예정 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 최고 평점 영화 목록 가져오기
 * @param {number} page - 페이지 번호
 */
export const getTopRatedMovies = async (page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('최고 평점 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 장르별 영화 목록 가져오기
 * @param {number} genreId - 장르 ID
 * @param {number} page - 페이지 번호
 */
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('장르별 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 영화 상세 정보 가져오기
 * @param {number} movieId - 영화 ID
 */
export const getMovieDetails = async (movieId) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('영화 상세 정보 로딩 실패:', error);
    throw error;
  }
};

/**
 * 영화 검색
 * @param {string} query - 검색어
 * @param {number} page - 페이지 번호
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('영화 검색 실패:', error);
    throw error;
  }
};

/**
 * 장르 목록 가져오기
 */
export const getGenres = async () => {
  try {
    const api = createAxiosInstance();
    const response = await api.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('장르 목록 로딩 실패:', error);
    throw error;
  }
};

/**
 * 영화 크레딧 정보 가져오기
 * @param {number} movieId - 영화 ID
 */
export const getMovieCredits = async (movieId) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error('영화 크레딧 로딩 실패:', error);
    throw error;
  }
};

/**
 * 비슷한 영화 목록 가져오기
 * @param {number} movieId - 영화 ID
 * @param {number} page - 페이지 번호
 */
export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/movie/${movieId}/similar`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('비슷한 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 영화 동영상 정보 가져오기 (트레일러 등)
 * @param {number} movieId - 영화 ID
 */
export const getMovieVideos = async (movieId) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  } catch (error) {
    console.error('영화 동영상 로딩 실패:', error);
    throw error;
  }
};

/**
 * 트렌딩 영화 가져오기
 * @param {string} timeWindow - 'day' 또는 'week'
 */
export const getTrendingMovies = async (timeWindow = 'week') => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('트렌딩 영화 로딩 실패:', error);
    throw error;
  }
};

/**
 * 영화 추천 가져오기
 * @param {number} movieId - 영화 ID
 * @param {number} page - 페이지 번호
 */
export const getRecommendations = async (movieId, page = 1) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('추천 영화 로딩 실패:', error);
    throw error;
  }
};

const tmdbService = {
  getImageUrl,
  getPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getMovieDetails,
  searchMovies,
  getGenres,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos,
  getTrendingMovies,
  getRecommendations,
  GENRES,
};

export default tmdbService;
