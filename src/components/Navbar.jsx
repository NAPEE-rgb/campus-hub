import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; // Import auth to handle sign out
import { signOut } from 'firebase/auth';

export default function Navbar({ cartCount, onCartClick, user, onAuthClick, hideActions }) {
  
  const handleUserLogout = () => {
    signOut(auth).then(() => {
      // Refresh or state update is handled by the listener in App.jsx
      console.log("User signed out");
    });
  };

  return (
    <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
            Campus<span className="text-orange-600">Hub</span>
          </h1>
        </Link>

        {!hideActions && (
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={onCartClick} className="relative p-2 group">
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            {/* If user is logged in, show Name + Logout Button. Otherwise, show Sign Up */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-[10px] font-black uppercase text-gray-400">
                  Hi, {user.displayName?.split(' ')[0] || 'Member'}
                </span>
                <button 
                  onClick={handleUserLogout}
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="bg-gray-900 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
              >
                Sign Up
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}