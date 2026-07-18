import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function PrivateRoute({ children }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" />;
}