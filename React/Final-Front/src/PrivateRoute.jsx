import { Navigate } from 'react-router-dom';
import useUserStore from './Store/useStore';

const PrivateRoute = ({ children }) => {
  const { user, isLoggingOut } = useUserStore();

  if (!user) {
    // 로그아웃 중인 경우, 메시지 없이 로그인 페이지로 이동
    if (isLoggingOut) {
      return <Navigate to="/login" replace />;
    }
    // 세션 만료 등 다른 이유로 로그인이 풀린 경우, 메시지와 함께 이동
    return <Navigate to="/login" replace state={{ fromPrivateRoute: true }} />;
  }

  return children;
};

export default PrivateRoute;
