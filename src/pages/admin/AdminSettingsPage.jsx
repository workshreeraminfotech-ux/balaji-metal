import React, { useState, useEffect } from 'react';
import { 
  Settings, Phone, Mail, MapPin, 
  Lock, Save, CheckCircle2, Building2, ShieldCheck 
} from 'lucide-react';
import { storageService } from '@/utils/storageService';
import SEO from '@/components/ui/SEO';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    company_name: 'Balaji Metal',
    primary_phone: '+91-76000 60193',
    secondary_phone: '+91-70960 70727',
    whatsapp_number: '+917600060193',
    email: 'Balajimetal5302@gmail.com',
    address: 'Balaji Metal, P. 43/44, Main Road, Ta. Kotda Sangani, Veraval (Shapar - Padavala Industrial Zone), Rajkot, Gujarat - 360025',
    working_hours: 'Mon - Sat: 9:00 AM - 7:00 PM (Sunday: Closed)'
  });

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const saved = storageService.getSettings();
    if (saved && Object.keys(saved).length > 0) {
      setSettings(prev => ({ ...prev, ...saved }));
    }
  }, []);

  const handleSaveCompanyInfo = async (e) => {
    e.preventDefault();
    await storageService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPass.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    const user = storageService.getAuthUser() || { id: 1, name: 'Admin', email: 'admin@balajimetal.com' };
    storageService.setAuthUser({ ...user, password: passwordForm.newPass });

    setPasswordMsg({ type: 'success', text: 'Admin password updated successfully!' });
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      <SEO title="System Settings | Balaji Metal Admin" description="Manage company contact numbers and administrator settings." />

      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <h1 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2.5">
          <Settings size={24} className="text-orange-600" />
          <span>Company & System Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Configure contact numbers, official WhatsApp receiver, address, and admin security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Company Contact Settings (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-heading font-black text-slate-900 flex items-center gap-2">
              <Building2 size={20} className="text-orange-600" />
              <span>Company Information & Contact Channels</span>
            </h2>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCompanyInfo} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Company Legal Name
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Primary Phone (Call CTA)
                </label>
                <input
                  type="text"
                  value={settings.primary_phone}
                  onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={settings.secondary_phone}
                  onChange={(e) => setSettings({ ...settings, secondary_phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  WhatsApp Receiver Number
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Official Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Foundry & Factory Address
              </label>
              <textarea
                rows={3}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Save size={16} />
                <span>Save Company Info</span>
              </button>
            </div>
          </form>
        </div>

        {/* Admin Password & Security (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-heading font-black text-slate-900 flex items-center gap-2">
              <Lock size={20} className="text-orange-600" />
              <span>Admin Security</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Change administrator login password
            </p>
          </div>

          {passwordMsg.text && (
            <div className={`p-3 rounded-2xl text-xs font-bold ${
              passwordMsg.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-300 shadow-xs"
              >
                <ShieldCheck size={16} className="text-orange-600" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
