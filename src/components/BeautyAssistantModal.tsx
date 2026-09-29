import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ShoppingBag, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, Product, AIChatMessage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { generateBeautyAdvice } from '../services/aiBeautyAdvisor';

interface BeautyAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const BeautyAssistantModal: React.FC<BeautyAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  products,
  onAddToCart,
  onQuickView,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: t.aiAssistantWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: isRtl
        ? ['ما هي درجة الفاونديشن المناسبة لي؟', 'مستحضرات للبشرة الدهنية', 'أفضل روج ثابت من Miss2m', 'كيف أحصل على خصم 20%؟']
        : ['Foundation shade matching', 'Oily skin routine', 'Best long-wear lipstick', 'How to get 20% discount'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI consultation thinking and streaming reply
    setTimeout(() => {
      const result = generateBeautyAdvice(query, language, products);
      const assistantMsg: AIChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: result.suggestedProductIds,
        quickReplies: result.quickReplies,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'assistant',
        text: t.aiAssistantWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: isRtl
          ? ['ما هي درجة الفاونديشن المناسبة لي؟', 'مستحضرات للبشرة الدهنية', 'أفضل روج ثابت من Miss2m', 'كيف أحصل على خصم 20%؟']
          : ['Foundation shade matching', 'Oily skin routine', 'Best long-wear lipstick', 'How to get 20% discount'],
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="ai-beauty-assistant-modal"
        className="bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[85vh] max-h-[720px]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#4d1633] via-[#661e44] to-[#4d1633] text-white border-b border-rose-300/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-300 via-rose-300 to-pink-200 text-[#4d1633] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 fill-[#4d1633] animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-rose-50">
                  {t.aiAssistantModalTitle}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-400/25 text-rose-200 border border-rose-300/30 uppercase tracking-wider">
                  AI Beauty
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5">
                {t.aiAssistantModalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-rose-100 transition-colors"
              title={language === 'ar' ? 'مسح المحادثة' : 'Clear Chat'}
              aria-label="Clear chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-[#fdf9f7] via-[#faf5f2] to-[#fbf6f3]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const matchedProducts = (msg.suggestedProductIds || [])
              .map((id) => products.find((p) => p.id === id))
              .filter(Boolean) as Product[];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-200`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow-xs ${
                    isUser
                      ? 'bg-[#2c1c18] text-white'
                      : 'bg-gradient-to-tr from-[#6b1d48] to-[#9c3669] text-rose-100'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#2c1c18] text-[#faf2ee] rounded-tr-xs'
                        : 'bg-white text-[#2b1814] border border-[#ebdcd5] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1.5 ${
                        isUser ? 'text-[#d6c1b8] text-end' : 'text-[#8f756e]'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Product Recommendation Cards inside chat */}
                  {matchedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-extrabold text-[#7a493e] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#9c513e]" />
                        <span>{language === 'ar' ? 'مستحضرات Miss2m الموصى بها:' : 'Recommended Miss2m Products:'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {matchedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-2xl p-2.5 border border-[#ebdcd5] shadow-xs flex items-center gap-2.5 group hover:border-[#c55d42] transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={language === 'ar' ? prod.nameAr : prod.nameEn}
                              className="w-12 h-12 rounded-xl object-cover border border-[#f0e3dc] flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-extrabold text-xs text-[#261714] truncate">
                                {language === 'ar' ? prod.nameAr : prod.nameEn}
                              </h5>
                              <div className="font-black text-[#9c4c37] text-xs mt-0.5">
                                {prod.price.toFixed(2)} {t.currency}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <button
                                  onClick={() => onQuickView(prod)}
                                  className="text-[10px] font-bold text-[#694f47] hover:text-[#261714] underline"
                                >
                                  {language === 'ar' ? 'تفاصيل' : 'Details'}
                                </button>
                                <button
                                  onClick={() => onAddToCart(prod)}
                                  className="px-2 py-0.5 rounded-lg bg-[#2c1c18] hover:bg-[#432720] text-white text-[10px] font-extrabold flex items-center gap-1"
                                >
                                  <ShoppingBag className="w-2.5 h-2.5" />
                                  <span>{language === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Prompts Chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(reply)}
                          className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50/80 text-[#632044] border border-rose-200/90 text-[11px] font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 text-start"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-[#7d655f] text-xs animate-pulse p-2">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-[#632044] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>{language === 'ar' ? 'خبيرتنا بالذكاء الاصطناعي تكتب إجابتك...' : 'AI Advisor is thinking...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#ebdcd5]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.aiAssistantPlaceholder}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#faf5f2] border border-[#ebdcd5] focus:outline-hidden focus:border-[#852758] focus:ring-2 focus:ring-[#852758]/20 text-xs sm:text-sm text-[#261714] placeholder-[#8f756e]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 sm:px-5 rounded-2xl bg-gradient-to-r from-[#6b1d48] to-[#9c3669] hover:from-[#581639] hover:to-[#832c57] disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-[#6b1d48]/25 flex items-center justify-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
              aria-label="Send query"
            >
              <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span className="hidden sm:inline">{t.aiSendBtn}</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-[#9c847d] mt-2 px-1">
            <span>Miss2m Jordan • AI Beauty Advisor</span>
            <span>{language === 'ar' ? 'استشارة مجانية فورية' : 'Free Instant Consultation'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
