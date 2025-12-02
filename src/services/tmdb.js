import api from './api';

// 인기 영화
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

// 현재 상영작
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('현재 상영작 가져오기 실패:', error);
    throw error;
  }
};

// 높은 평점 영화
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

// 영화 검색
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('영화 검색 실패:', error);
    throw error;
  }
};