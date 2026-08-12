import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { isStaff } = useAuth();

  if (!isStaff) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;