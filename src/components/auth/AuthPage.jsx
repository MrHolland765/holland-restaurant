import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { RestaurantLogo } from '../common/RestaurantLogo';
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS,
} from '../../utils/passwordValidation';
import { requestPasswordReset, resetPassword, testBackend } from '../../API';

export const AuthPage = ({ onComplete }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const { language, setLanguage } = useLanguage();
  const isEnglish = language === 'en';

   // 'customer' | 'admin' | 'delivery'
  const resetToken = new URLSearchParams(window.location.search).get('resetToken');
  const [authMode, setAuthMode] = useState(resetToken ? 'reset' : 'login');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [showRegistrationPassword, setShowRegistrationPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    testBackend().catch((error) => {
      console.warn('Backend warm-up failed:', error.message);
    });
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLoginIdentifier('');
    setLoginPassword('');
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();

    try {
      await requestPasswordReset(resetEmail.trim());
      showToast(
        isEnglish
          ? 'If an account exists for that email, a password reset link has been sent.'
          : 'Kama akaunti ipo kwa barua pepe hiyo, kiungo cha kubadilisha nenosiri kimetumwa.',
        'success'
      );
      setAuthMode('login');
    } catch (error) {
      showToast(
        error.message || (isEnglish ? 'Could not send reset email.' : 'Imeshindikana kutuma barua pepe.'),
        'error'
      );
    }
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    if (!isStrongPassword(newPassword)) {
      showToast(
        isEnglish
          ? 'Password must have at least 8 characters, uppercase and lowercase letters, a number, and a special character.'
          : 'Nenosiri liwe na angalau herufi 8, herufi kubwa na ndogo, namba na alama maalum.',
        'error'
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast(
        isEnglish ? 'Passwords do not match.' : 'Manenosiri hayafanani.',
        'error'
      );
      return;
    }

    try {
      await resetPassword(resetToken, newPassword);
      sessionStorage.removeItem('holland_token');
      showToast(
        isEnglish
          ? 'Password updated. Please sign in with your new password.'
          : 'Nenosiri limebadilishwa. Tafadhali ingia kwa kutumia nenosiri jipya.',
        'success'
      );
      window.location.replace(window.location.pathname);
    } catch (error) {
      showToast(
        error.message || (isEnglish ? 'Could not reset password.' : 'Imeshindikana kubadilisha nenosiri.'),
        'error'
      );
    }
  };

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

  if (isLoggingIn) return;

  if (!loginIdentifier || !loginPassword) {
    showToast('Tafadhali jaza taarifa zote za kuingia', 'error');
    return;
  }

  setIsLoggingIn(true);
  try {
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
      isEnglish
        ? 'Welcome to Holland Restaurant!'
        : 'Karibu Holland Restaurant!',
      'success'
    );

    if (onComplete) {
      onComplete(result.user?.role);
    }
  } finally {
    setIsLoggingIn(false);
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

  if (!isStrongPassword(registerData.password)) {
    showToast(
      isEnglish
        ? 'Password must have at least 8 characters, uppercase and lowercase letters, a number, and a special character.'
        : 'Nenosiri liwe na angalau herufi 8, herufi kubwa na ndogo, namba na alama maalum.',
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/70 via-slate-50 to-orange-50/50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
        {/* Sketch Header: WELCOME TO (HOLLAND RESTAURANT) */}
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
          <RestaurantLogo className="w-16 h-16 mx-auto mb-3 border-2 border-amber-300 shadow-md" />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
            {isEnglish ? 'Welcome to Holland Restaurant' : 'Karibu kwenye Mkahawa Wetu'}
          </h1>
          <p className="text-amber-100 font-bold text-lg mt-0.5 tracking-wide">
            HOLLAND RESTAURANT
          </p>
          <p className="text-xs text-amber-100/90 mt-2 font-medium">
            {isEnglish ? '* Please sign in to continue:' : '* Tafadhali ingia ili kuendelea:'}
          </p>
        </div>
        
        {!['forgot', 'reset'].includes(authMode) && (
          <>
         {/* ROLE SELECTOR */}
<div className="flex items-center justify-center gap-2 mb-5">
  <button
    type="button"
    onClick={() => handleRoleChange('customer')}
    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      selectedRole === 'customer'
        ? 'bg-amber-500 text-white shadow-md'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    Customer
  </button>

  <button
    type="button"
    onClick={() => handleRoleChange('admin')}
    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      selectedRole === 'admin'
        ? 'bg-amber-500 text-white shadow-md'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    Admin
  </button>

  <button
    type="button"
    onClick={() => handleRoleChange('delivery')}
    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      selectedRole === 'delivery'
        ? 'bg-amber-500 text-white shadow-md'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    Delivery
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
          </>
        )}

          {/* FORM 1: LOGIN FORM (Exact sketch layout) */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isEnglish ? 'Email or Phone no:' : 'Barua pepe au namba ya simu:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="account-identifier"
                    autoComplete="off"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="+255 657281070    OR    holland@gmail.com"
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
                  name="account-password"
                  autoComplete="new-password"
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
                disabled={isLoggingIn}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {isLoggingIn
                    ? (isEnglish ? 'Connecting...' : 'Inaunganisha...')
                    : (isEnglish ? 'Sign In' : 'Ingia')}
                </span>
                {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {isEnglish ? 'Forgot password?' : 'Umesahau nenosiri?'}
                </button>
              </div>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">
                {isEnglish ? 'Reset your password' : 'Badilisha nenosiri lako'}
              </h2>
              <p className="text-sm text-slate-600">
                {isEnglish
                  ? 'Enter the email address linked to your account and we will send you a reset link.'
                  : 'Weka barua pepe ya akaunti yako, tutakutumia kiungo cha kubadilisha nenosiri.'}
              </p>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isEnglish ? 'Email address' : 'Barua pepe'}
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                {isEnglish ? 'Send reset link' : 'Tuma kiungo'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-sm font-semibold text-amber-700 hover:underline"
              >
                {isEnglish ? 'Back to sign in' : 'Rudi kwenye kuingia'}
              </button>
            </form>
          )}

          {authMode === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">
                {isEnglish ? 'Choose a new password' : 'Weka nenosiri jipya'}
              </h2>
              <label className="block text-xs font-bold text-slate-700">
                {isEnglish ? 'New password' : 'Nenosiri jipya'}
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                {isEnglish ? 'Confirm new password' : 'Thibitisha nenosiri jipya'}
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="mt-1.5 w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
              <p className="text-xs text-slate-500">
                {isEnglish
                  ? 'Use at least 8 characters, uppercase and lowercase letters, a number, and a symbol.'
                  : 'Tumia angalau herufi 8, herufi kubwa na ndogo, namba na alama maalum.'}
              </p>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                {isEnglish ? 'Update password' : 'Badilisha nenosiri'}
              </button>
            </form>
          )}

          {/* FORM 2: REGISTRATION FORM (Direct translation of sketch Page 1: "Registers:") */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-3.5">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Registers: As new Account,
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fullname:
                </label>
                <input
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  placeholder="Eg: Abdullhamid Khamis Abdalla"
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
                  placeholder="abdullhamidkhamis765@gmail.com"
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
                  placeholder="+255 657281070"
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
                  placeholder="Magharib A,  Mjini Magharib,  Zanzibar."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showRegistrationPassword ? 'text' : 'password'}
                    name="registration-password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder={isEnglish ? 'Create a strong password' : 'Tengeneza nenosiri imara'}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegistrationPassword((visible) => !visible)}
                    aria-label={showRegistrationPassword
                      ? (isEnglish ? 'Hide password' : 'Ficha nenosiri')
                      : (isEnglish ? 'Show password' : 'Onyesha nenosiri')}
                    aria-pressed={showRegistrationPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-800"
                  >
                    {showRegistrationPassword
                      ? <EyeOff className="h-5 w-5" />
                      : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <ul className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                  {PASSWORD_REQUIREMENTS.map(({ key, test, sw, en }) => {
                    const passed = test(registerData.password);
                    return (
                      <li
                        key={key}
                        className={passed ? 'text-emerald-700' : 'text-slate-500'}
                      >
                        {passed ? '✓' : '○'} {isEnglish ? en : sw}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Sketch button: [Submit] with arrow to Login */}
              <button
                type="submit"
                className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Submit</span>
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
  );
};
