import { useEffect } from 'react';
import { getPopularMovies } from './services/tmdb';
import './App.css';

function App() {
  useEffect(() => {
    // API 테스트
    const testAPI = async () => {
      try {
        const data = await getPopularMovies();
        console.log('✅ API 연동 성공!');
        console.log('인기 영화:', data.results);
      } catch (error) {
        console.error('❌ API 연동 실패:', error);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="App">
      <h1>Netflix Clone</h1>
      <p>개발자 도구(F12)의 Console을 확인하세요!</p>
    </div>
  );
}

export default App;