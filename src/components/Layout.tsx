import { Outlet, Navigate } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <Outlet />
    </div>
  );
};

export default Layout;
