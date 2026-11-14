import React, { useState } from 'react';
import { X, Lock, Shield, LogIn, Smartphone, Download, AlertCircle } from 'lucide-react';
import { AuthUser, DEMO_USERS, getAdminPassword } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, isNewRegistration?: boolean) => void;
  defaultAdmin?: boolean;
  lang: 'ar' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultAdmin = false,
  lang,
}) => {
  const [isAdminMode, setIsAdminMode] = useState(defaultAdmin);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanIdentifier = identifier.trim().toLowerCase();
      const cleanPassword = password.trim();
      const expectedPass = getAdminPassword();
      const validAdminUsers = ['admin', 'admin@awnyemen.com', '770000001', '+967770000001', '777000000', '+967777000000'];

      if ((validAdminUsers.includes(cleanIdentifier) || cleanIdentifier === '') && cleanPassword === expectedPass) {
        onLoginSuccess(DEMO_USERS.admin);
        onClose();
      } else {
        setError(isAr ? 'اسم المستخدم أو كلمة المرور الخاصة بالمسؤول غير صحيحة!' : 'Invalid Admin username or password');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className={`px-5 py-4 text-white flex items-center justify-between ${isAdminMode ? 'bg-gradient-to-r from-slate-900 to-[#4d0c1f]' : 'bg-[#68142c]'}`}>
          <div className="flex items-center gap-2">
            {isAdminMode ? <Shield size={20} className="text-amber-400" /> : <Smartphone size={20} className="text-amber-300" />}
            <h3 className="font-bold text-base sm:text-lg font-['Cairo']">
              {isAdminMode
                ? (isAr ? 'تسجيل دخول لوحة تحكم الإدارة' : 'Admin Control Panel Login')
                : (isAr ? 'تطبيق عون يمن للجوال' : 'Awn Yemen Mobile App')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {isAdminMode ? (
          /* Admin Login Form */
          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Shield size={16} className="text-amber-600 shrink-0" />
              <span>{isAr ? 'منطقة خاصة بمدير النظام ومشرفي عون يمن فقط.' : 'Restricted to system administrators.'}</span>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'اسم المستخدم أو البريد الإداري:' : 'Admin Identifier:'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAr ? 'كلمة المرور السرية:' : 'Password:'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {loading ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'دخول لوحة التحكم' : 'Login to Admin')}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsAdminMode(false); setError(null); }}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                {isAr ? 'الرجوع لمعلومات المستخدمين' : 'Back to user info'}
              </button>
            </div>
          </form>
        ) : (
          /* Regular User Information & Mobile App Download Guidance */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#68142c] mx-auto flex items-center justify-center border-2 border-amber-300 shadow-inner">
              <Smartphone size={32} />
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900 mb-1.5 font-['Cairo']">
                {isAr ? 'منصة الويب مخصصة للاستعراض والتصفح فقط' : 'Web is for Browsing Only'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'لضمان أمان العمليات والتحقق برمز التحقق (OTP)، تم حصر تسجيل الدخول وإنشاء الحسابات ونشر الإعلانات والتواصل مع المعلنين حصرياً على تطبيق عون يمن للجوال.'
                  : 'For security and verification, account login, ad posting, and direct contact are exclusive to the Awn Yemen Mobile App.'}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-right text-xs space-y-2 text-slate-700">
              <div className="font-bold text-[#68142c] flex items-center gap-1.5">
                <span>📱</span>
                <span>{isAr ? 'مميزات تطبيق عون يمن للجوال:' : 'Mobile App Features:'}</span>
              </div>
              <ul className="space-y-1 text-slate-600 pr-4 list-disc text-[11.5px]">
                <li>{isAr ? 'إنشاء حساب مجاني موثق برقم الهاتف' : 'Free verified phone account'}</li>
                <li>{isAr ? 'نشر الإعلانات وإدارتها فورياً' : 'Post & manage ads instantly'}</li>
                <li>{isAr ? 'مشاهدة أرقام المعلنين والاتصال المباشر والواتساب' : 'Direct calls & WhatsApp'}</li>
                <li>{isAr ? 'ترقية الحسابات والإعلانات المميزة (VIP)' : 'VIP & Featured ad upgrades'}</li>
              </ul>
            </div>

            <a
              href="/downloads/awn-yemen.apk"
              download="awn-yemen.apk"
              className="w-full py-3 bg-[#68142c] hover:bg-[#520f23] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Download size={16} className="text-amber-300" />
              <span>{isAr ? 'تحميل تطبيق عون يمن للأندرويد (APK) 📱' : 'Download Android App (APK)'}</span>
            </a>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{isAr ? 'هل أنت مدير النظام؟' : 'Are you an admin?'}</span>
              <button
                type="button"
                onClick={() => { setIsAdminMode(true); setError(null); }}
                className="text-amber-700 font-bold hover:underline flex items-center gap-1"
              >
                <Shield size={12} />
                <span>{isAr ? 'دخول المشرفين' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
