// 로그인하지 않은 사용자가 특정 페이지에 접근하는 것을 막고, 자동으로 로그인 페이지로 리다이렉트시킵니다. - 인증(로그인) 보호 기능
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  // 로그인 여부 확인
  if (!isLoggedIn()) {
    // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
    return <Navigate to="/signin" replace />;
  }

  // 로그인되어 있으면 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;