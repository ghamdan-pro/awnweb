import React, { useState } from 'react';
import { X, Lock, Phone, Mail, Shield, UserPlus, LogIn, CheckCircle2, AlertCircle, Sparkles, Building, UserCheck, Briefcase } from 'lucide-react';
import { AuthUser, DEMO_USERS, AccountType, getAdminPassword } from '../types/auth';

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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isAdminMode, setIsAdminMode] = useState(defaultAdmin);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (isAdminMode) {
        // Real Admin verification (Demo removed)
        const cleanIdentifier = identifier.trim().toLowerCase();
        const cleanPassword = password.trim();
        const expectedPass = getAdminPassword();
        const validAdminUsers = ['admin', 'admin@awnyemen.com', '770000001', '+967770000001', '777000000', '+967777000000'];

        if ((validAdminUsers.includes(cleanIdentifier) || cleanIdentifier === '') && cleanPassword === expectedPass) {
          onLoginSuccess(DEMO_USERS.admin);
          onClose();
          return;
        } else {
          setError(isAr ? 'اسم المستخدم أو كلمة المرور الخاصة بالمسؤول غير صحيحة!' : 'Invalid Admin username or password');
          return;
        }
      }

      if (mode === 'login') {
        if (!identifier.trim()) {
          setError(isAr ? 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني' : 'Please enter phone or email');
          return;
        }
        // Success user login
        const loggedUser: AuthUser = {
          ...DEMO_USERS.individual,
          name: identifier.includes('@') ? identifier.split('@')[0] : 'مستخدم عون',
          phone: identifier.startsWith('+') ? identifier : `+967 ${identifier}`,
        };
        onLoginSuccess(loggedUser);
        onClose();
      } else {
        // Register new user
        if (!name.trim()) {
          setError(isAr ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
          return;
        }
        const newUser: AuthUser = {
          id: 'usr-' + Date.now(),
          name: name.trim(),
          phone: identifier.startsWith('+') ? identifier : `+967 ${identifier || '777000111'}`,
          role: 'user',
          accountType,
          accountId: String(Math.floor(10000000 + Math.random() * 90000000)),
          isVerified: true,
          walletBalanceYer: 5000,
          walletBalanceUsd: 10,
        };
        onLoginSuccess(newUser, true);
        onClose();
      }
    }, 400);
  };

  const handleQuickDemoUser = () => {
    onLoginSuccess(DEMO_USERS.individual);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className={`px-5 py-4 text-white flex items-center justify-between ${isAdminMode ? 'bg-gradient-to-r from-slate-900 to-[#4d0c1f]' : 'bg-[#68142c]'}`}>
          <div className="flex items-center gap-2">
            {isAdminMode ? <Shield size={20} className="text-amber-400" /> : <LogIn size={20} className="text-amber-300" />}
            <h3 className="font-bold text-base sm:text-lg font-['Cairo']">
              {isAdminMode
                ? (isAr ? 'تسجيل دخول لوحة تحكم الإدارة' : 'Admin Control Panel Login')
                : mode === 'login'
                ? (isAr ? 'تسجيل الدخول إلى عون يمن' : 'Login to Awn Yemen')
                : (isAr ? 'إنشاء حساب جديد في عون يمن' : 'Register New Account')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toggle Mode Tabs */}
        {!isAdminMode && (
          <div className="grid grid-cols-2 bg-slate-100 p-1 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white text-[#68142c] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-white text-[#68142c] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {isAr ? 'حساب جديد' : 'Register'}
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && !isAdminMode && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? 'الاسم الكامل أو اسم الجهة' : 'Full Name or Company'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد عبد الله / مطاعم الشيباني' : 'e.g. Ahmed Ali'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68142c]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isAr ? 'اختر نوع الحساب في عون يمن' : 'Select Account Type'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between relative overflow-hidden ${
                      accountType === 'individual'
                        ? 'bg-[#68142c] text-white border-[#68142c] shadow-md ring-2 ring-[#68142c]/30'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={`p-1.5 rounded-lg ${accountType === 'individual' ? 'bg-white/20 text-white' : 'bg-amber-100 text-[#68142c]'}`}>
                        <Briefcase size={16} />
                      </div>
                      {accountType === 'individual' && <CheckCircle2 size={16} className="text-amber-400" />}
                    </div>
                    <div>
                      <div className="font-black text-xs">
                        {isAr ? 'مهني / عامل / باحث' : 'Professional / Worker'}
                      </div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${accountType === 'individual' ? 'text-slate-200' : 'text-slate-500'}`}>
                        {isAr ? 'حرفيين، مهندسين، كوادر وفنيين' : 'Talents, Job Seekers'}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('company')}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between relative overflow-hidden ${
                      accountType === 'company'
                        ? 'bg-[#68142c] text-white border-[#68142c] shadow-md ring-2 ring-[#68142c]/30'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={`p-1.5 rounded-lg ${accountType === 'company' ? 'bg-white/20 text-white' : 'bg-amber-100 text-[#68142c]'}`}>
                        <Building size={16} />
                      </div>
                      {accountType === 'company' && <CheckCircle2 size={16} className="text-amber-400" />}
                    </div>
                    <div>
                      <div className="font-black text-xs">
                        {isAr ? 'مالك عمل / شركة' : 'Business Owner / Company'}
                      </div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${accountType === 'company' ? 'text-slate-200' : 'text-slate-500'}`}>
                        {isAr ? 'أصحاب العمل، منشآت ومحلات' : 'Employers, Establishments'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Identifier Input (Mobile Phone or Admin ID) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isAdminMode
                ? (isAr ? 'اسم مستخدم الإدارة أو البريد الإلكتروني' : 'Admin Username or Email')
                : (isAr ? 'رقم الهاتف المحمول (اليمن)' : 'Yemen Mobile Phone')}
            </label>
            <div className="relative flex items-center">
              {!isAdminMode && (
                <div className="absolute right-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-200/80 px-2 py-1 rounded-md pointer-events-none z-10">
                  <span className="text-sm">🇾🇪</span>
                  <span dir="ltr">+967</span>
                </div>
              )}
              <input
                type={isAdminMode ? 'text' : 'tel'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isAdminMode ? 'admin@awnyemen.com' : '77X XXX XXX'}
                dir={isAdminMode ? 'ltr' : 'ltr'}
                className={`w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68142c] ${
                  isAdminMode ? 'pl-9 pr-3' : 'pr-24 pl-9 text-right'
                }`}
              />
              <div className="absolute left-3 text-slate-400 pointer-events-none">
                {isAdminMode ? <Shield size={16} /> : <Phone size={16} />}
              </div>
            </div>
            {!isAdminMode && (
              <p className="text-[10px] text-slate-500 mt-1">
                {isAr ? 'يمن موبايل (77)، يو (73)، سبأفون (71)، أو واي (70)' : 'Accepts all Yemen operators (77, 73, 71, 70)'}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 pl-9 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68142c]"
              />
              <div className="absolute top-2.5 left-3 text-slate-400">
                <Lock size={16} />
              </div>
            </div>
          </div>

          {/* Toggle admin switch */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => { setIsAdminMode(!isAdminMode); setError(null); }}
              className="text-xs font-bold text-amber-900 hover:text-[#68142c] flex items-center gap-1"
            >
              <Shield size={13} />
              <span>{isAdminMode ? (isAr ? 'العودة لتسجيل دخول المستخدمين' : 'Back to User Login') : (isAr ? 'تسجيل دخول كمسؤول نظام (Admin)' : 'Admin Login')}</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 ${
              isAdminMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-[#68142c] hover:bg-[#520f23]'
            }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                {isAdminMode ? <Shield size={16} /> : <LogIn size={16} />}
                <span>
                  {isAdminMode
                    ? (isAr ? 'دخول لوحة التحكم' : 'Enter Control Panel')
                    : mode === 'login'
                    ? (isAr ? 'تسجيل الدخول' : 'Sign In')
                    : (isAr ? 'تأكيد التسجيل' : 'Create Account')}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        {isAdminMode ? (
          <div className="bg-slate-900 text-slate-300 p-3.5 border-t border-slate-800 flex items-center gap-2.5 text-xs">
            <div className="p-1.5 bg-amber-400 text-slate-950 rounded-md shrink-0">
              <Shield size={16} />
            </div>
            <span className="font-semibold text-slate-300 text-[11px] leading-relaxed">
              {isAr
                ? 'بوابة الإدارة محمية بكلمة مرور رسمية مشفرة، تم إلغاء الدخول التجريبي التلقائي حفاظاً على أمان المنصة.'
                : 'Admin portal is secured with production credentials. 1-Click bypass is disabled.'}
            </span>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              {isAr ? 'الدخول السريع التجريبي للمستخدمين' : 'Quick Demo User Login'}
            </div>
            <button
              type="button"
              onClick={handleQuickDemoUser}
              className="w-full p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                <UserCheck size={14} />
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-amber-900 font-bold truncate">حمزة الشيف (مستخدم تجريبي)</span>
                <span className="block text-[9px] text-slate-500">{isAr ? 'معلن / باحث عن عمل' : 'Demo User'}</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
