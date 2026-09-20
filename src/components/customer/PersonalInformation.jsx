import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Camera, Lock, Save, CheckCircle2 } from 'lucide-react';

export const PersonalInformation = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '@customer',
    fullName: currentUser?.fullName || 'Holland Customer',
    email: currentUser?.email || 'customer@holland.co.tz',
    phone: currentUser?.phone || '0712 345 678',
    address: currentUser?.address || 'Mikocheni B, Mwai Kibaki Road, House #45',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = () => {
    // Alternate sample avatars for quick testing
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    ];
    const nextAvatar = avatars[(avatars.indexOf(formData.avatar) + 1) % avatars.length];
    setFormData({ ...formData, avatar: nextAvatar });
    showToast('Picha ya wasifu imebadilishwa!', 'info', 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordData.newPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showToast('Nenosiri jipya na uthibitisho haviendani!', 'error');
        return;
      }
      if (!passwordData.oldPassword) {
        showToast('Tafadhali weka Old Password ili kubadilisha nenosiri', 'error');
        return;
      }
    }

    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Taarifa binafsi (Personal Information) zimehifadhiwa kikamilifu!', 'success');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header matching Sketch Page 7: Personal Information */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Holland Restaurant
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Personal Information.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Badilisha taarifa zako binafsi, anwani ya kufikishiwa chakula, na nenosiri lako.
        </p>
      </div>

      {/* Main Profile Form Card matching Sketch Page 7 */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200/90 shadow-sm space-y-6"
      >
        {/* Profile Circle & Change Profile link (Sketch Page 7) */}
        <div className="flex flex-col items-center justify-center space-y-2 border-b border-slate-100 pb-5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-400 shadow-md bg-slate-100">
              <img
                src={formData.avatar}
                alt={formData.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleAvatarChange}
              className="absolute bottom-0 right-0 p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md transition-all"
              title="Change Profile"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Profile
          </span>
          <button
            type="button"
            onClick={handleAvatarChange}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
          >
            Change profile (Bofya kubadilisha picha)
          </button>
        </div>

        {/* Inputs (Sketch Page 7: @Username, Full name, Email, Phone, Address) */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              @Username:
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full name:
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone:
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Address (Mahali pa kufikishiwa):
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Password Section (Sketch Page 7: Password: Old Password, New password, Confirm password) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Password:
            </span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Old Password:
              </label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  New password:
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Confirm password:
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button matching Sketch Page 7: [SAVE] */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Inahifadhi...' : 'SAVE'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
