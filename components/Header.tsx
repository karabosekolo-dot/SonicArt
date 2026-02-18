
import React from 'react';
import { AppRoute } from '../types';

interface HeaderProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, setRoute, cartCount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setRoute(AppRoute.HOME)}
      >
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg flex items-center justify-center font-black text-xl italic group-hover:scale-110 transition-transform">
          S
        </div>
        <span className="text-xl font-bold tracking-tighter hidden sm:block">SONICART</span>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setRoute(AppRoute.STORE)}
          className={`text-sm font-medium transition-colors ${currentRoute === AppRoute.STORE ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
        >
          Explore Music
        </button>
        <button 
          onClick={() => setRoute(AppRoute.CREATIVE_SUITE)}
          className={`text-sm font-medium transition-colors ${currentRoute === AppRoute.CREATIVE_SUITE ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
        >
          Creative Suite
        </button>
        <button 
          onClick={() => setRoute(AppRoute.CART)}
          className="relative p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
