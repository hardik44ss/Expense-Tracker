import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Layers, User, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Auth() {
  const [showSignIn, setShowSignIn] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If we're already logged in, redirect to the dashboard
  useEffect(() => {
    if (user) {
      // Get the intended destination or default to the root
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const toggleAuth = () => {
    setShowSignIn(!showSignIn);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      {/* Left side - Branding/Info Section */}
      <div className="w-full md:w-1/2 max-w-md text-white mb-10 md:mb-0 md:pr-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <motion.div 
            className="mb-6 flex justify-center md:justify-start items-center"
            whileHover={{ scale: 1.05 }}
          >
            <DollarSign className="h-12 w-12 text-white mr-2" />
            <h1 className="text-4xl font-bold">ExpenseTracker</h1>
          </motion.div>
          
          <p className="text-xl mb-8">Track your expenses smarter, save more effectively.</p>
          
          <div className="space-y-6">
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Visualize Your Spending</h3>
                <p className="text-white text-opacity-80">Interactive charts help you understand where your money goes.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Personalized Insights</h3>
                <p className="text-white text-opacity-80">Get customized tips based on your spending habits.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Auth Form Section */}
      <div className="w-full md:w-1/2 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="relative">
            <div className="flex">
              <button
                onClick={() => setShowSignIn(true)}
                className={`w-1/2 py-4 text-center transition-colors duration-300 ${
                  showSignIn ? 'bg-blue-600 text-white font-bold' : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignIn(false)}
                className={`w-1/2 py-4 text-center transition-colors duration-300 ${
                  !showSignIn ? 'bg-blue-600 text-white font-bold' : 'text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={showSignIn ? 'signin' : 'signup'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                {showSignIn ? (
                  <SignIn onToggleAuth={toggleAuth} />
                ) : (
                  <SignUp onToggleAuth={toggleAuth} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
