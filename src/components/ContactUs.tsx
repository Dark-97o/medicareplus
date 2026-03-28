import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactUs() {
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
    <section className="py-24 px-8 md:px-16 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-(--color-accent-purple)/30 bg-(--color-accent-purple)/10">
            <span className="w-2 h-2 rounded-full bg-(--color-accent-purple) animate-pulse" />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-(--color-accent-purple)">Get In Touch</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Connect with our <span className="text-gradient">Healthcare Experts</span>
          </h2>
          <p className="text-(--color-text-muted) max-w-lg mb-12 leading-relaxed">
            Have questions about our services, specialists, or corporate partnerships? Drop us a message and we'll get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-(--color-accent-blue) group-hover:bg-(--color-accent-blue)/10 transition-colors">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gray-400 mb-1">Emergency 24x7</p>
                <p className="text-xl font-serif font-bold text-white">+91 141 222 3344</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-(--color-accent-purple) group-hover:bg-(--color-accent-purple)/10 transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gray-400 mb-1">Email Support</p>
                <p className="text-xl font-serif font-bold text-white">care@medicareplus.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-(--color-accent-blue) opacity-5 blur-[100px] -mr-32 -mt-32" />
          
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">Message Sent Successfully</h3>
              <p className="text-(--color-text-muted) max-w-xs mx-auto">Thank you for reaching out. We've received your inquiry and will respond via email shortly.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-8 px-8 py-3 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-5 text-gray-500" size={16} />
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all group disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
