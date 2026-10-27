import React, { useState } from 'react';
import { X, Send, Phone, UserCheck, CheckCheck } from 'lucide-react';
import { Listing } from '../data/mockListings';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  lang: 'ar' | 'en';
}

interface ChatMessage {
  id: string;
  sender: 'me' | 'seller';
  text: string;
  time: string;
  isRead: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  listing,
  lang
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'seller',
      text: 'حياك الله أخي الكريم، أهلاً بك في عون يمن. الإعلان متوفر وجاهز للاتفاق أو المعاينة في أي وقت.',
      time: '10:42 ص',
      isRead: true
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const isAr = lang === 'ar';

  if (!isOpen || !listing) return null;

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputVal.trim(),
      time: 'الآن',
      isRead: false
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulate seller reply after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.map((m) => ({ ...m, isRead: true })),
        {
          id: (Date.now() + 1).toString(),
          sender: 'seller',
          text: 'تم استلام استفسارك، يسعدني التفاهم معك هاتفياً أو عبر واتساب أيضاً إذا أحببت.',
          time: 'الآن',
          isRead: true
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[520px] flex flex-col overflow-hidden border border-slate-200">
        {/* Chat Header */}
        <div className="bg-[#68142c] text-white p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-base">
              {listing.sellerName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight">{listing.sellerName}</h4>
              <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{isAr ? 'متصل الآن بخصوص الإعلان' : 'Online'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.location.href = `tel:${listing.contactPhone.replace(/\s+/g, '')}`;
              }}
              className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              title={isAr ? 'اتصال مباشر' : 'Direct Call'}
            >
              <Phone size={17} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Ad Context Banner */}
        <div className="bg-amber-50/80 p-2 px-3 border-b border-amber-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 truncate max-w-[280px]">
            {listing.title}
          </span>
          <span className="font-bold text-[#68142c]">
            {listing.price ? `${listing.price.toLocaleString()} ${listing.currency}` : (isAr ? 'بالاتفاق' : 'Negotiable')}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#68142c] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.time}</span>
                  {isMe && (
                    <CheckCheck size={12} className={msg.isRead ? 'text-blue-500' : 'text-slate-400'} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAr ? 'اكتب رسالتك للمعلن هنا...' : 'Type a message...'}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#68142c]"
          />
          <button
            onClick={handleSend}
            className="p-2.5 bg-[#68142c] hover:bg-[#520f23] text-white rounded-xl shadow-sm transition-colors active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
