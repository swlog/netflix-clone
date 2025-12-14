import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';

/**
 * 보호된 라우트 컴포넌트
 * 로그인되지 않은 사용자는 /signin 페이지로 리다이렉트
 */
const ProtectedRoute = ({ children }) => {
  // 로그인 상태 확인
  if (!isLoggedIn()) {
    // 로그인되지 않았으면 로그인 페이지로 리다이렉트
    return <Navigate to="/signin" replace />;
  }

  // 로그인되어 있으면 요청한 페이지 렌더링
  return children;
};

export default ProtectedRoute;