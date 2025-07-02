import { Navigate } from 'react-router';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  if (Cookies.get('access_token')) {
    return <>{children}</>
  } else {
    return <Navigate to="/signup" />
  }
};

export default ProtectedRoute;