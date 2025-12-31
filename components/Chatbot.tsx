
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2, BrainCircuit, Loader2 } from 'lucide-react';
import { chatWithAnalyst } from '../services/geminiService';
import { Language } from '../types';

interface ChatbotProps {
  language?: Language;
}

export const Chatbot: React.FC<ChatbotProps> = ({ language = Language.FRENCH }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const translations = {
    [Language.ENGLISH]: {
      greeting: "Mugi-Solo online. I have synced the 2000-year historical ledger and security operational feeds. Ask me about the 'Ground Truth' in any constituency",
      placeholder: "Query Ground Truth...",
      loading: "Mugi-Solo is processing local SITREPS...",
      synced: "Hyper-Local Intel Synced"
    },
    [Language.FRENCH]: {
      greeting: "Mugi-Solo en ligne. J'ai synchronisé le registre historique de 2000 ans et les flux opérationnels de sécurité. Interrogez-moi sur la 'Vérité Terrain'.",
      placeholder: "Interroger la vérité terrain...",
      loading: "Mugi-Solo traite les rapports de situation locaux...",
      synced: "Intel Local Synchronisé"
    },
    [Language.KIRUNDI]: {
      greeting: "Mugi-Solo ndahari. Nashize hamwe amakuru y'imyaka 2000 n'ivyerekeye umutekano. Mbaza ico ushaka kumenya mu gihugu.",
      placeholder: "Baza amakuru y'ukuri...",
      loading: "Mugi-Solo aracyari mu gusesengura amakuru...",
      synced: "Amakuru y'imisozi arahari"
    }
  }[language];

  const [messages, setMessages] = useState<{role: 'user' | 'model', text: any}[]>([
    { role: 'model', text: translations.greeting }
  ]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: 'model', text: translations.greeting }]);
    }
  }, [language]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Robust cleaner to remove markdown artifacts as requested
  const cleanContent = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[\*#\[\]]/g, '') // Remove *, #, [, ]
      .replace(/_{1,2}/g, '')    // Remove underscores
      .trim();
  };

  const renderContent = (content: any) => {
    if (typeof content === 'string') return cleanContent(content);
    if (typeof content === 'number' || typeof content === 'boolean') return String(content);
    return JSON.stringify(content, null, 2);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: typeof m.text === 'string' ? m.text : JSON.stringify(m.text) }]
    }));

    const response = await chatWithAnalyst(history, userMsg, language);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-fade-in"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'w-72 h-14' : 'w-96 sm:w-[480px] h-[650px]'}`}>
      
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <BrainCircuit size={20} className="text-blue-400" />
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs leading-none">Mugi-Solo Core</span>
            <div className="flex items-center gap-1 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
               <span className="text-[10px] text-green-400 uppercase font-bold">{translations.synced}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-slate-400 hover:text-white p-1">
             {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
             <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none font-serif shadow-inner'
                }`}>
                  <div className="whitespace-pre-wrap font-inherit">{renderContent(msg.text)}</div>
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg rounded-tl-none flex items-center gap-2 text-slate-400 text-sm">
                    <Loader2 size={14} className="animate-spin" />
                    {translations.loading}
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={translations.placeholder}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
