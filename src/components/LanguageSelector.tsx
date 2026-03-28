import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-md group"
      >
        <Globe size={14} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">
          {currentLanguage.name}
        </span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 bg-[#0A0F1A]/95 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden z-[100]"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors ${i18n.language === lang.code ? 'text-cyan-400 bg-cyan-500/5' : 'text-gray-400 hover:text-white'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    {lang.name}
                  </span>
                  {i18n.language === lang.code && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
