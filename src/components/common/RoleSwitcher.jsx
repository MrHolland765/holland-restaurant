import React from 'react';
import { Languages, LogOut, Shield, UserRound, Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const roleIcon = { customer: UserRound, admin: Shield, delivery: Bike };

export const RoleSwitcher = () => {
  const { currentRole, currentUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const RoleIcon = roleIcon[currentRole] || UserRound;

  return (
    <aside aria-label="System controls" className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-wide text-amber-400 uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Holland Restaurant
        </span>
        <span className="hidden md:inline-block text-slate-400">|</span>
        <span className="hidden md:flex items-center gap-1.5 text-slate-300">
          <RoleIcon className="w-3.5 h-3.5" />
          {t('signedInAs')}: <strong>{currentUser?.fullName || t(currentRole)}</strong> ({t(currentRole)})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-slate-200" title={t('language')}>
          <Languages className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline font-semibold">{t('language')}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-medium outline-none focus:ring-2 focus:ring-amber-500">
            <option value="sw">Kiswahili</option>
            <option value="en">English</option>
          </select>
        </label>
        <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors font-semibold">
          <LogOut className="w-3.5 h-3.5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};
