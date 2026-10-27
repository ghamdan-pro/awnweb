import React, { useState } from 'react';
import { X, User, Building, Briefcase, Award, Wallet, Shield, Phone, CheckCircle, Edit3 } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [accountType, setAccountType] = useState<'individual' | 'company' | 'agency' | 'advertiser'>('individual');
  const [name, setName] = useState('حمزة الشيف اليمني');
  const [phone, setPhone] = useState('+967 777 123 456');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header (Mourjan blue/maroon style) */}
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
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{isAr ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully'}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-slate-300 border-4 border-[#68142c]/20 flex items-center justify-center text-slate-500 relative shadow-inner overflow-hidden">
              <User size={54} className="text-slate-400" />
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1">
              <Edit3 size={13} />
              <span>{isAr ? 'تعديل الصورة الشخصية' : 'Edit Avatar'}</span>
            </button>
          </div>

          {/* Account ID card (like in screenshot) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">{isAr ? 'حسابي:' : 'My Account:'}</span>
              <span className="font-mono font-bold text-[#68142c] text-sm">رقم: 12178548</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">{isAr ? 'حالة التوثيق:' : 'Verification:'}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Shield size={12} />
                <span>{isAr ? 'موثق عبر رقم الهاتف (+967)' : 'Phone Verified (+967)'}</span>
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
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900"
            />
          </div>

          {/* Account Type Selection (Screenshot style) */}
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
                <span className="text-lg font-black text-slate-900">15,000 ر.ي / 50 $</span>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#68142c] hover:bg-[#500d21] text-white text-xs font-bold rounded-lg transition-colors">
              {isAr ? 'شحن الرصيد' : 'Top Up'}
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
