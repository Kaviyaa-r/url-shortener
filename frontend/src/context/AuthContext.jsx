// Import required React core components and hooks
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import routing navigation hook from react-router-dom
import { useNavigate } from 'react-router-dom';

// Create the context container initialized to null
const AuthContext = createContext(null);

// Define the provider component wrapper to inject auth states
export const AuthProvider = ({ children }) => {
  // Local state to store current authenticated user profile object
  const [user, setUser] = useState(null);
  // Local state to store active JWT session token string
  const [token, setToken] = useState(null);
  // Local state to track loading state while storage sync occurs
  const [loading, setLoading] = useState(true);
  // Instantiate router navigation helper
  const navigate = useNavigate();

  // Run initial state checks once on component mount
  useEffect(() => {
    // Check if a token exists in localStorage
    const storedToken = localStorage.getItem('token');
    // Check if user credentials object is saved in localStorage
    const storedUser = localStorage.getItem('user');

    // If both tokens and credentials exist, parse and assign them to local state
    if (storedToken && storedUser) {
      // Set the token state
      setToken(storedToken);
      // Parse JSON string back to JavaScript object and set state
      setUser(JSON.parse(storedUser));
    }
    // Turn off loading spinner since local storage checks are complete
    setLoading(false);
  }, []);

  // Login action to assign token/user parameters and save them to localStorage
  const login = (userData, userToken) => {
    // Write session token to localStorage
    localStorage.setItem('token', userToken);
    // Write user info to localStorage as a serialized string
    localStorage.setItem('user', JSON.stringify(userData));
    // Assign JWT token to React state
    setToken(userToken);
    // Assign user profile details to React state
    setUser(userData);
  };

  // Logout action to wipe session records from storage and redirect to login page
  const logout = () => {
    // Delete session token from localStorage
    localStorage.removeItem('token');
    // Delete user details from localStorage
    localStorage.removeItem('user');
    // Reset session token React state to null
    setToken(null);
    // Reset user profile React state to null
    setUser(null);
    // Navigate user path back to login page
    navigate('/login');
  };

  // Render a clean spinner screen matching dark theme if loading checks are active
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        {/* Animated spinner element styled with indigo accent border */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        {/* Loading text parameter */}
        <p className="mt-4 text-slate-400 text-sm font-medium">Initializing SnapLink...</p>
      </div>
    );
  }

  // Provide user, token, login, and logout hooks to children elements
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth custom hook for clean context consumptions
export const useAuth = () => {
  // Retrieve target provider variables via useContext hook
  return useContext(AuthContext);
};
