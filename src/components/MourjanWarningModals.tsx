import React, { useState } from 'react';
import { ShieldAlert, BookOpenCheck } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  onAgree: (dontShowAgain: boolean) => void;
  onDisagree: () => void;
  type: 'scam_warning' | 'publishing_rules';
  lang: 'ar' | 'en';
}

export const MourjanWarningModals: React.FC<WarningModalProps> = ({
  isOpen,
  onAgree,
  onDisagree,
  type,
  lang
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const isScamWarning = type === 'scam_warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 text-center">
        {/* Title */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-2">
            {isScamWarning ? <ShieldAlert size={28} /> : <BookOpenCheck size={28} />}
          </div>
          <h3 className="text-xl font-black text-slate-900 font-['Cairo']">
            {isScamWarning ? (isAr ? 'هام جداً' : 'Important Notice') : (isAr ? 'قوانين النشر' : 'Posting Guidelines')}
          </h3>
        </div>

        {/* Content text matching user attachment */}
        {isScamWarning ? (
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed text-right space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p>
              {isAr
                ? 'يرجى أخذ الحيطة والحذر حيث هنالك محتالون ومنتحلون لصفة فريق عمل عون يمن يقومون بإرسال رسائل نصية أو واتساب سائلين الرد الفوري أو الضغط على روابط مشبوهة.'
                : 'Please exercise caution: scammers may impersonate Awn Yemen support asking for immediate response or clicking on suspicious links.'}
            </p>
            <p className="font-semibold text-rose-800">
              {isAr
                ? 'لذا رجاءً عدم التواصل مع هؤلاء والتبين من احتيالهم. عون يمن وسيط مجاني لا يطلب أية رسوم أو أكواد سرية لتحويل الأموال.'
                : 'Never share verification codes or money transfer PINs. Awn Yemen is free and never requests payment fees.'}
            </p>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed text-right space-y-2 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-900 mb-1">
              {isAr ? 'يرجى الالتزام بالشروط والتعليمات التالية:' : 'Please adhere to the following rules:'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>{isAr ? 'لا تكرر الإعلانات أو قد يتم تعليق حسابك.' : 'Do not duplicate listings.'}</li>
              <li>{isAr ? 'الإعلانات ذات الطابع غير اللائق أو المخالف للآداب ممنوعة.' : 'Inappropriate content is prohibited.'}</li>
              <li>{isAr ? 'الإعلانات غير الشرعية أو غير القانونية ممنوعة.' : 'Illegal goods/services are prohibited.'}</li>
              <li>{isAr ? 'إعلانات التبصير والتنجيم والسحر ممنوعة تماماً.' : 'Fortune-telling and superstitions are banned.'}</li>
              <li>{isAr ? 'الإعلانات التي تحتوي على روابط خارجية احتيالية ممنوعة.' : 'Malicious external links are prohibited.'}</li>
              <li>{isAr ? 'لا تنشر إعلانات كاذبة أو وهمية.' : 'No fake or deceptive ads.'}</li>
            </ul>
          </div>
        )}

        {/* Do not show again checkbox */}
        <label className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded text-[#68142c] focus:ring-[#68142c]"
          />
          <span>{isAr ? 'لا تعرض هذه الشاشة مجدداً' : "Don't show this screen again"}</span>
        </label>

        {/* Action Buttons: Agree / Disagree (Mourjan exact labels) */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => onAgree(dontShowAgain)}
            className="text-amber-700 hover:text-amber-800 font-black text-sm px-4 py-2 hover:bg-amber-50 rounded-lg transition-colors"
          >
            {isAr ? 'موافق' : 'I Agree'}
          </button>
          <button
            onClick={onDisagree}
            className="text-slate-500 hover:text-slate-800 font-bold text-sm px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isAr ? 'غير موافق' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
