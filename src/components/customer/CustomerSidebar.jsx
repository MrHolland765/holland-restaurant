import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  Utensils,
  Clock,
  RefreshCw,
  UserCheck,
  MoreHorizontal,
  LogOut,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const CustomerSidebar = () => {
  const { sidebarOpen, setSidebarOpen, activeView, setActiveView, orders, cartCount } = useRestaurant();
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    showToast('Umetoka kwenye akaunti kwa usalama.', 'info');
  };

  // Nav items from Sketch Page 3
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'my_bill',
      label: 'My bill',
      icon: Receipt,
      badge: cartCount > 0 ? `${cartCount} items` : null,
    },
    {
      id: 'foods_drinks_snacks',
      label: 'Foods & Drinks & Snacks',
      icon: Utensils,
      badge: null,
    },
    {
      id: 'my_orders',
      label: 'My Orders',
      icon: Clock,
      badge: orders.length > 0 ? orders.length : null,
    },
    {
      id: 'updates_orders',
      label: 'Updates orders',
      icon: RefreshCw,
      badge: null,
    },
    {
      id: 'personal_info',
      label: 'Personal information',
      icon: UserCheck,
      badge: null,
    },
    {
      id: 'others',
      label: 'Others (Kuhusu sisi & Msaada)',
      icon: MoreHorizontal,
      badge: null,
    },
  ];

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Sidebar Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in">
        {/* Drawer Header (Sketch: MENU: [X]) */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-500/10">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
              Holland Restaurant
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              MENU:
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors"
            title="Funga Menyu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <div className="w-11 h-11 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser?.fullName?.[0] || 'C'
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {currentUser?.fullName || 'Holland Customer'}
            </h3>
            <p className="text-xs text-amber-600 font-semibold truncate">
              {currentUser?.username || '@customer'}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-amber-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer: Log out (Sketch Page 3) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
