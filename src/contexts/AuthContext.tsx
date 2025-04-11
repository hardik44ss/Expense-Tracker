import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase credentials - consider using environment variables in production
const supabaseUrl = 'https://qikcaqpjikptizgaiwbi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpa2NhcXBqaWtwdGl6Z2Fpd2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg2NTIsImV4cCI6MjA1OTU5NDY1Mn0.EtLIMp9hkahF8TWX8DL3JAzNYSId18ZllOfv9eDAf_s';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// FOR DEMO PURPOSES: Default users for testing (in a real app, never do this!)
const DEMO_USERS = [
  { email: 'user@example.com', password: 'password123', name: 'Demo User' },
  { email: 'test@example.com', password: 'test123', name: 'Test Account' },
  { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
];

// Enable debug mode
const DEBUG = true;

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  devModeSignIn: () => void;
  demoSignIn: (email: string, password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  // Debug logger
  const log = (message: string, data?: any) => {
    if (DEBUG) {
      console.log(`[Auth] ${message}`, data || '');
    }
  };

  // Check for a previously stored user session on component mount
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const storedUser = sessionStorage.getItem('demoUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          log('Found stored user session', parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        log('Error reading from session storage', error);
      }
    };

    // First try to restore from session storage (faster)
    checkStoredUser();
    
    // Then also check Supabase session (more reliable but may be slower)
    const getSession = async () => {
      try {
        log('Checking for existing Supabase session...');
        const { data, error } = await supabase.auth.getSession();
        setConnectionAttempted(true);
        
        if (error) {
          log('Session error', error);
          return;
        }
        
        if (data?.session?.user) {
          log('Found existing Supabase session', data.session.user);
          const { id, email, user_metadata } = data.session.user;
          
          const userData = {
            id,
            email: email || '',
            name: user_metadata?.name || '',
          };
          
          setUser(userData);
        } else {
          log('No active Supabase session found');
        }
      } catch (error) {
        log('Error fetching session', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      log('Auth state changed', { event, user: session?.user });
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const userData = {
          id,
          email: email || '',
          name: user_metadata?.name || '',
        };
        setUser(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        sessionStorage.removeItem('demoUser');
        log('User signed out from Supabase');
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with Supabase
  const signIn = async (email: string, password: string) => {
    try {
      log('Attempting sign in with Supabase', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      log('Sign in response', { data, error });
      
      if (error) {
        // If Supabase fails, try demo login
        return demoSignIn(email, password);
      }
      
      if (data?.user) {
        const { id, email, user_metadata } = data.user;
        const userData = {
          id,
          email: email || '',
          name: user_metadata?.name || '',
        };
        setUser(userData);
        log('User signed in successfully', data.user);
      }
      
      return { error: null };
    } catch (error) {
      log('Sign in exception', error);
      // If Supabase throws exception, try demo login
      return demoSignIn(email, password);
    }
  };

  // Demo sign in (no database needed)
  const demoSignIn = async (email: string, password: string) => {
    log('Attempting demo sign in', { email });
    
    // Check if the email/password match any of our demo users
    const demoUser = DEMO_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (demoUser) {
      log('Demo user found', demoUser);
      const userData = {
        id: `demo-${Date.now()}`,
        email: demoUser.email,
        name: demoUser.name
      };
      
      // Save to session storage for persistence
      try {
        sessionStorage.setItem('demoUser', JSON.stringify(userData));
      } catch (err) {
        log('Failed to save to session storage', err);
      }
      
      setUser(userData);
      return { error: null };
    }
    
    log('Demo sign in failed - invalid credentials');
    return { 
      error: { 
        message: 'Invalid login credentials' 
      } 
    };
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      log('Attempting sign up with Supabase', { email, name });
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: { name },
        }
      });
      
      log('Sign up response', { data, error });
      
      if (error) {
        // For demo purposes, create a demo account
        const userData = {
          id: `demo-signup-${Date.now()}`,
          email,
          name
        };
        try {
          sessionStorage.setItem('demoUser', JSON.stringify(userData));
        } catch (err) {
          log('Failed to save to session storage', err);
        }
        setUser(userData);
        log('Created demo user account', userData);
        return { error: null };
      }
      
      // Note: Supabase usually requires email verification
      if (data?.user) {
        const { id, email } = data.user;
        const userData = {
          id,
          email: email || '',
          name,
        };
        setUser(userData);
        log('User signed up successfully', data.user);
      }
      
      return { error: null };
    } catch (error) {
      log('Sign up exception - falling back to demo mode', error);
      
      // Create a demo account as fallback
      const userData = {
        id: `demo-signup-${Date.now()}`,
        email,
        name
      };
      try {
        sessionStorage.setItem('demoUser', JSON.stringify(userData));
      } catch (err) {
        log('Failed to save to session storage', err);
      }
      setUser(userData);
      
      return { error: null };
    }
  };

  const signOut = async () => {
    log('Signing out user', user);
    
    // First clear local state and storage
    try {
      sessionStorage.removeItem('demoUser');
    } catch (err) {
      log('Failed to remove from session storage', err);
    }
    
    // Then try Supabase signout (if it fails, we've already cleared local state)
    try {
      await supabase.auth.signOut();
      log('Signed out from Supabase successfully');
    } catch (error) {
      log('Error during Supabase sign out (continuing anyway)', error);
    }
    
    // Always reset user state to null, even if Supabase fails
    setUser(null);
    log('User signed out completely');
  };

  // Development helper function
  const devModeSignIn = () => {
    const devUser = { 
      id: 'dev-user-' + Math.random().toString(36).substring(2, 10),
      email: 'dev@example.com', 
      name: 'Development User' 
    };
    log('Setting development mode user', devUser);
    try {
      sessionStorage.setItem('demoUser', JSON.stringify(devUser));
    } catch (err) {
      log('Failed to save to session storage', err);
    }
    setUser(devUser);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    devModeSignIn,
    demoSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
