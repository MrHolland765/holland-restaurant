import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { UtensilsCrossed, Shield, Bike, User, ArrowRight, Check } from 'lucide-react';

export const AuthPage = ({ onComplete }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const { language, setLanguage } = useLanguage();
  const isEnglish = language === 'en';

  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'admin' | 'delivery'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('customer@holland.com');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Register form state (from Sketch Page 1)
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleLoginSubmit = async (e) => {
  e.preventDefault();

  if (!loginIdentifier || !loginPassword) {
    showToast('Tafadhali jaza taarifa zote za kuingia', 'error');
    return;
  }

  const result = await login(
    loginIdentifier,
    loginPassword,
    selectedRole
  );

  if (!result.success) {
    showToast(
      result.message || 'Email au password si sahihi',
      'error'
    );
    return;
  }

  showToast(
    `Karibu Holland Restaurant! Umeingia kama ${selectedRole.toUpperCase()}`,
    'success'
  );

  if (onComplete) {
    onComplete(selectedRole);
  }
};

  const handleRegisterSubmit = async (e) => {
  e.preventDefault();

   if (
  !registerData.fullName ||
  !registerData.email ||
  !registerData.phone ||
  !registerData.password
  ) {
    showToast(
      'Tafadhali jaza Jina, Namba ya simu na Nenosiri',
      'error'
    );
    return;
  }

  const result = await register(registerData);

  if (!result.success) {
    showToast(
      result.message || 'Usajili umeshindikana',
      'error'
    );
    return;
  }

  showToast(
    'Usajili umekamilika vizuri! Sasa unaweza kuingia.',
    'success'
  );

  setLoginIdentifier(registerData.email);
  setLoginPassword(registerData.password);
  setAuthMode('login');
};

  const setDemoCredentials = (role) => {
    setSelectedRole(role);
    if (role === 'customer') {
      setLoginIdentifier('customer@holland.com');
      setLoginPassword('123456');
    } else if (role === 'admin') {
      setLoginIdentifier('admin@holland.co.tz');
      setLoginPassword('admin123');
    } else if (role === 'delivery') {
      setLoginIdentifier('0714 555 123');
      setLoginPassword('delivery123');
    }
  };

  const handleDemoLogin = async (role) => {
    const credentials = {
      customer: ['customer@holland.com', '123456'],
      admin: ['admin@holland.co.tz', 'admin123'],
      delivery: ['juma@holland.co.tz', 'delivery123'],
    }[role];
    setDemoCredentials(role);
    const result = await login(credentials[0], credentials[1], role);
    if (!result.success) {
      showToast(result.message || 'Akaunti ya majaribio haijaandaliwa', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/70 via-slate-50 to-orange-50/50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        {/* Sketch Header: WELCOME TO OUR RESTAURANT (HOLLAND RESTAURANT) */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 p-6 text-white text-center relative">
          <select
            aria-label="Language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="absolute right-4 top-4 rounded-lg bg-white/15 border border-white/30 px-2 py-1 text-xs font-bold text-white outline-none"
          >
            <option value="sw" className="text-slate-900">Kiswahili</option>
            <option value="en" className="text-slate-900">English</option>
          </select>
          <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
            {isEnglish ? 'Welcome to Our Restaurant' : 'Karibu kwenye Mkahawa Wetu'}
          </h1>
          <p className="text-amber-100 font-bold text-lg mt-0.5 tracking-wide">
            HOLLAND RESTAURANT
          </p>
          <p className="text-xs text-amber-100/90 mt-2 font-medium">
            {isEnglish ? '* Please sign in to continue:' : '* Tafadhali ingia ili kuendelea:'}
          </p>
        </div>

        {/* Sketch Page 1 Role Tabs: [Customers] [Admin] [Delivery staff] */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setDemoCredentials('customer')}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                selectedRole === 'customer'
                  ? 'bg-white text-amber-600 shadow-sm shadow-slate-200 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{isEnglish ? 'Customers' : 'Wateja'}</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-white text-purple-600 shadow-sm shadow-slate-200 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('delivery')}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                selectedRole === 'delivery'
                  ? 'bg-white text-emerald-600 shadow-sm shadow-slate-200 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span className="truncate">Delivery staff</span>
            </button>
          </div>

          {/* Mode Switcher: Sign In OR Register (as drawn in sketch) */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {isEnglish ? 'Sign In' : 'Ingia'}
            </button>
            <span className="text-xs font-semibold text-slate-400 uppercase">or</span>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {isEnglish ? 'Register' : 'Jisajili'}
            </button>
          </div>

          {/* FORM 1: LOGIN FORM (Exact sketch layout) */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isEnglish ? 'Email or Phone no:' : 'Barua pepe au namba ya simu:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="mfano: 0712345678 au mteja@gmail.com"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isEnglish ? 'Password:' : 'Nenosiri:'}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Sketch button: [Sign In] */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick 1-Click Demo Logins */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="text-xs text-center text-slate-500 mb-2 font-medium">
                  Bonyeza haraka kuingia kwa akaunti za majaribio (Demo):
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      handleDemoLogin('customer');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-medium"
                  >
                    Mteja (Customer)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDemoLogin('admin');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-medium"
                  >
                    Admin (Meneja)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDemoLogin('delivery');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium"
                  >
                    Delivery Staff (Rider)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* FORM 2: REGISTRATION FORM (Direct translation of sketch Page 1: "Registers:") */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Registers: Sajili Akaunti Mpya
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fullname:
                </label>
                <input
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  placeholder="Jina lako kamili"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="barua@pepe.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone:
                </label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="0712 345 678"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address:
                </label>
                <input
                  type="text"
                  value={registerData.address}
                  onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                  placeholder="mfano: Mikocheni B, Mwai Kibaki Road"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Weka nenosiri salama"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Sketch button: [Submit] with arrow to Login */}
              <button
                type="submit"
                className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit Usajili</span>
                <Check className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-amber-600 font-semibold hover:underline"
                >
                  Tayari una akaunti? Rudi kwenye Login Form
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
