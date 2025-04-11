import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Loading your dashboard...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <NavigationBar />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </motion.div>
  );
};

export default Layout;
