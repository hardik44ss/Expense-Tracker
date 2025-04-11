import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Lazy load components
const Layout = lazy(() => import('./components/Layout'));
const ExpenseDashboard = lazy(() => import('./pages/ExpenseDashboard'));
const Auth = lazy(() => import('./components/Auth').then(module => ({ default: module.Auth })));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <p className="text-lg font-medium text-gray-600">Loading...</p>
  </div>
);

// Path constants
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <ExpenseDashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Auth />
      </Suspense>
    ),
  },
  // Fallback route - redirect to home
  {
    path: '*',
    element: <Navigate to={PATHS.HOME} replace />,
  }
]);
