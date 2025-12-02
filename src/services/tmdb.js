import api from './api';

// 인기 영화
export const getPopularMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

// TODO: 다른 API 함수들 추가 예정