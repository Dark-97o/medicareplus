import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactUs() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-8 md:px-16 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-(--color-accent-purple)/30 bg-(--color-accent-purple)/10">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent-purple) animate-pulse" />
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-(--color-accent-purple)">{t('home.contact.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6 text-white">
            {t('home.contact.title')} <br />
            <span className="text-gradient leading-tight">{t('home.contact.highlight')}</span>
          </h2>
          <p className="text-gray-200 max-w-lg mb-10 leading-relaxed text-sm md:text-base font-medium opacity-80">
            {t('home.contact.desc')}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-(--color-accent-blue) group-hover:bg-(--color-accent-blue)/10 transition-colors">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-gray-400 mb-0.5">{t('home.contact.emergency')}</p>
                <p className="text-lg font-serif font-bold text-white tracking-tight">+91 141 222 3344</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-(--color-accent-purple) group-hover:bg-(--color-accent-purple)/10 transition-colors">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-gray-400 mb-0.5">{t('home.contact.email_support')}</p>
                <p className="text-lg font-serif font-bold text-white tracking-tight">care@medicareplus.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-(--color-accent-blue) opacity-5 blur-[80px] -mr-24 -mt-24" />
          
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">{t('home.contact.success.title')}</h3>
              <p className="text-(--color-text-muted) max-w-xs mx-auto text-xs">{t('home.contact.success.desc')}</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 px-6 py-2.5 rounded-full border border-white/10 text-[0.65rem] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                {t('home.contact.success.cta')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 ml-1">{t('home.contact.form.name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                      placeholder={t('home.contact.form.placeholder_name')}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 ml-1">{t('home.contact.form.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 ml-1">{t('home.contact.form.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 ml-1">{t('home.contact.form.message')}</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-gray-500" size={14} />
                  <textarea 
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors resize-none"
                    placeholder={t('home.contact.form.placeholder_message')}
                  />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-white font-bold text-[0.65rem] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all group disabled:opacity-50 mt-2"
              >
                {isSubmitting ? t('home.contact.form.sending') : t('home.contact.form.cta')}
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
