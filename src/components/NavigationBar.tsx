import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function NavigationBar() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Expense Tracker</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Dashboard</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Expenses</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Reports</a>
              <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Settings</a>
            </div>
          </div>
          <div className="flex items-center">
            {user && (
              <>
                <span className="px-3 py-2 text-sm">{user.email}</span>
                <button 
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
