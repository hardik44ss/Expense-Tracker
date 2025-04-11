import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, Bug, Key } from 'lucide-react';

interface SignInProps {
  onToggleAuth: () => void;
}

export function SignIn({ onToggleAuth }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signIn, devModeSignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Sign-in error:", error);
        setError(error.message || 'Login failed. Please check your credentials.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Sign-in exception:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login helpers
  const setDemoUser = (email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" },
    blur: { scale: 1, boxShadow: "none" }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-2xl font-bold text-gray-800 mb-6"
        variants={itemVariants}
      >
        Welcome Back
      </motion.h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" 
          role="alert"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded" 
        >
          <p>Login successful!</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        <motion.div className="mb-4" variants={itemVariants}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <motion.div 
            className="relative"
            whileHover="focus"
            initial="blur"
            variants={inputVariants}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </motion.div>
        </motion.div>
        
        <motion.div className="mb-6" variants={itemVariants}>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <motion.div 
            className="relative"
            whileHover="focus"
            initial="blur"
            variants={inputVariants}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </motion.div>
          <div className="flex justify-end mt-2">
            <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot Password?
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex justify-center items-center"
            whileHover={{ scale: 1.03, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                Sign In <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </motion.button>
        </motion.div>
      </form>
      
      {/* Demo accounts section */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 border-t pt-4"
      >
        <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => setDemoUser('user@example.com')}
            className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
          >
            <Key className="h-3 w-3 mr-1 text-blue-500" />
            Demo User
          </motion.button>
          
          <motion.button
            onClick={() => setDemoUser('admin@example.com')}
            className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
          >
            <Key className="h-3 w-3 mr-1 text-purple-500" />
            Admin User
          </motion.button>
        </div>
      </motion.div>

      {/* Development mode shortcut */}
      <motion.div 
        variants={itemVariants}
        className="mt-4"
      >
        <motion.button
          onClick={devModeSignIn}
          className="w-full flex items-center justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none"
          whileHover={{ scale: 1.03, backgroundColor: "#dbeafe" }}
          whileTap={{ scale: 0.97 }}
        >
          <Bug className="h-5 w-5 mr-2 text-blue-500" />
          Quick Login (No Password)
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="mt-8 text-center"
        variants={itemVariants}
      >
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <motion.button 
            onClick={onToggleAuth}
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create one now
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}
