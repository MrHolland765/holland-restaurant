import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { Menu, ShoppingCart, Search, UtensilsCrossed, User } from 'lucide-react';

export const CustomerNavbar = () => {
  const { currentUser } = useAuth();
  const {
    sidebarOpen,
    setSidebarOpen,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setActiveView,
  } = useRestaurant();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Logo / Restaurant Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            title="Fungua Menyu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">
                Our Restaurant
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight leading-tight">
                HOLLAND RESTAURANT
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search foods bar (Page 3 & 5) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods, snacks, drinks..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border border-transparent text-sm focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Futa
              </button>
            )}
          </div>
        </div>

        {/* Right: Cart & Profile Badge (@username Customer) */}
        <div className="flex items-center gap-2.5">
          {/* Cart Icon & Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-all flex items-center gap-2"
            title="Angalia Carts"
          >
            <ShoppingCart className="w-5 h-5 text-amber-700" />
            <span className="hidden sm:inline text-xs font-bold text-amber-900">
              Cart
            </span>
            {cartCount > 0 && (
              <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Sketch Page 3 Profile Badge: Profile / @username Customer */}
          <button
            onClick={() => setActiveView('personal_info')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all text-left"
            title="Taarifa za Wasifu (Personal Information)"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-700 overflow-hidden shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-xs font-bold text-slate-900 truncate max-w-[110px]">
                {currentUser?.username || '@customer'}
              </span>
              <span className="block text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                Customer
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search foods, snacks, drinks..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border border-transparent text-sm focus:bg-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
};
