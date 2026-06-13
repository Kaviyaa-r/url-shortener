// Import the React library for rendering elements
import React from 'react';
// Import routing Link from react-router-dom to handle SPA navigation
import { Link } from 'react-router-dom';
// Import LinkIcon and LogOut icons from lucide-react library
import { Link as LinkIcon, LogOut } from 'lucide-react';
// Import the custom authentication hook to access current user context
import { useAuth } from '../context/AuthContext';

// Define the Navbar header component
const Navbar = () => {
  // Retrieve the active user object and logout handler function from auth context
  const { user, logout } = useAuth();

  return (
    // Sticky layout header wrapper styled with dark slate backgrounds and borders
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      {/* Centered navigation container setting max-width constraints */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flexbox row layout mapping logo and actions to opposite sides */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo container brand wrapper */}
          <div className="flex items-center">
            {/* Router link element routing back to home page */}
            <Link to="/" className="flex items-center gap-2 group">
              {/* Brand logo icon container */}
              <div className="bg-indigo-600/10 p-2 rounded-lg group-hover:bg-indigo-600/20">
                {/* Brand logo link icon */}
                <LinkIcon className="h-5 w-5 text-indigo-400" />
              </div>
              {/* Brand name text identifier */}
              <span className="text-xl font-black text-white tracking-wide">
                Snap<span className="text-indigo-400">Link</span>
              </span>
            </Link>
          </div>

          {/* User profile action indicators section */}
          <div className="flex items-center gap-4">
            {/* Render user name display only if user data object exists */}
            {user && (
              // Name text label styled with light grey text colors
              <span className="hidden sm:inline-block text-sm font-medium text-slate-300">
                Hello, <span className="text-white font-semibold">{user.name}</span>
              </span>
            )}
            
            {/* Logout interactive trigger button */}
            <button
              // Bind click trigger to trigger the logout hook routine
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 hover:border-red-500/50 rounded-lg text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10"
            >
              {/* LogOut action icon */}
              <LogOut className="h-3.5 w-3.5" />
              {/* Button display label */}
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

// Export the Navbar header component
export default Navbar;
