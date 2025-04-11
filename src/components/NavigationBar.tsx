import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Wallet, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export function NavigationBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // First sign out using the auth context
      await signOut();
      
      // Then navigate to login page
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100); // Small delay to allow state updates
    } catch (error) {
      console.error('Error signing out:', error);
      // If sign out fails, still try to navigate to login
      navigate('/login', { replace: true });
    }
  };

  return (
    <motion.nav 
      className="bg-white shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Expense Tracker</span>
          </div>
          {user && (
            <div className="flex items-center">
              <motion.div 
                className="flex items-center mr-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user.email}
                </span>
              </motion.div>
              <motion.button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
