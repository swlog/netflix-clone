// components/common/Loading.jsx
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* 3D 회전 필름릴 */}
        <div className="film-reel">
          <div className="reel-circle">
            <i className="fas fa-film"></i>
          </div>
          <div className="reel-circle">
            <i className="fas fa-film"></i>
          </div>
        </div>
        
        {/* 로딩 바 */}
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        
        <p className="loading-text">
          <span>영화 정보를 불러오는 중</span>
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Loading;