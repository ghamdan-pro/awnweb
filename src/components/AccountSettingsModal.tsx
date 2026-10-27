import React, { useState, useEffect } from 'react';
import { X, User, Building, Briefcase, Award, Wallet, Shield, Phone, CheckCircle, Edit3, LogOut, LogIn } from 'lucide-react';
import { AuthUser, AccountType } from '../types/auth';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onUpdateUser?: (updated: AuthUser) => void;
  onOpenLogin: () => void;
  lang: 'ar' | 'en';
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onUpdateUser,
  onOpenLogin,
  lang,
}) => {
  const [accountType, setAccountType] = useState<AccountType>(currentUser?.accountType || 'individual');
  const [name, setName] = useState(currentUser?.name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAccountType(currentUser.accountType);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (currentUser && onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name: name.trim() || currentUser.name,
        accountType,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  // If NOT logged in (Guest state)
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-900 mx-auto flex items-center justify-center">
            <User size={32} />
          </div>
          <h3 className="font-bold text-lg text-slate-900 font-['Cairo']">
            {isAr ? 'لم تقم بتسجيل الدخول بعد' : 'Not Logged In'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isAr
              ? 'يرجى تسجيل الدخول أو إنشاء حساب جديد للوصول إلى بيانات حسابك، رصيد المحفظة، وإدارة إعلاناتك.'
              : 'Please sign in or create an account to view profile, balance and manage your listings.'}
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full py-2.5 bg-[#68142c] hover:bg-[#520f23] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              <span>{isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-slate-600 hover:text-slate-800 text-xs font-bold transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#68142c] text-white px-5 py-3.5 flex items-center justify-between">
          <h3 className="font-bold text-base sm:text-lg font-['Cairo']">
            {isAr ? 'إعدادات الحساب والملف الشخصي' : 'Account & Profile Settings'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{isAr ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully'}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-22 h-22 rounded-full bg-slate-200 border-4 border-[#68142c]/20 flex items-center justify-center text-slate-500 relative shadow-inner overflow-hidden">
              <User size={48} className="text-slate-400" />
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1">
              <Edit3 size={13} />
              <span>{isAr ? 'تعديل الصورة الشخصية' : 'Edit Avatar'}</span>
            </button>
          </div>

          {/* Account ID card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">{isAr ? 'حسابي:' : 'My Account:'}</span>
              <span className="font-mono font-bold text-[#68142c] text-sm">رقم : {currentUser.accountId}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">{isAr ? 'حالة التوثيق:' : 'Verification:'}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Shield size={12} />
                <span>{currentUser.isVerified ? (isAr ? 'موثق عبر رقم الهاتف (+967)' : 'Phone Verified (+967)') : (isAr ? 'غير موثق' : 'Unverified')}</span>
              </span>
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isAr ? 'الاسم أو اسم الشركة' : 'Full Name or Company Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#68142c]"
            />
          </div>

          {/* Account Type Selection */}
          <div>
            <label className="text-xs font-bold text-amber-900 block mb-2">
              {isAr ? 'نوع الحساب' : 'Account Type'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  accountType === 'individual'
                    ? 'bg-[#68142c] text-white border-[#68142c] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'حساب شخصي' : 'Personal'}
              </button>

              <button
                type="button"
                onClick={() => setAccountType('company')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  accountType === 'company'
                    ? 'bg-[#68142c] text-white border-[#68142c] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'شركة' : 'Company'}
              </button>

              <button
                type="button"
                onClick={() => setAccountType('agency')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  accountType === 'agency'
                    ? 'bg-[#68142c] text-white border-[#68142c] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'وكالة توظيف' : 'Agency'}
              </button>

              <button
                type="button"
                onClick={() => setAccountType('advertiser')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  accountType === 'advertiser'
                    ? 'bg-[#68142c] text-white border-[#68142c] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAr ? 'معلن تجاري' : 'Advertiser'}
              </button>
            </div>
          </div>

          {/* Wallet Balance Strip */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
                <Wallet size={20} />
              </div>
              <div>
                <span className="text-xs text-amber-900 font-bold block">{isAr ? 'رصيد الحساب الحالي' : 'Current Balance'}</span>
                <span className="text-lg font-black text-slate-900">
                  {currentUser.walletBalanceYer.toLocaleString()} ر.ي / {currentUser.walletBalanceUsd} $
                </span>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#68142c] hover:bg-[#500d21] text-white text-xs font-bold rounded-lg transition-colors">
              {isAr ? 'شحن الرصيد' : 'Top Up'}
            </button>
          </div>

          {/* Logout Section */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-rose-200"
            >
              <LogOut size={15} />
              <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Logout from Account'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-lg transition-colors"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#68142c] hover:bg-[#520f23] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
