import { Navigate } from 'react-router-dom';
import useUserStore from './Store/useStore';

const PrivateRoute = ({ children }) => {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/login" replace state={{ fromPrivateRoute: true }} />;
  }

  return children;
};

export default PrivateRoute;
