import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, User, Send, CheckCircle2, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendAdminEnquiryAlert } from '../lib/emailService';

interface QuickEnquiryProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function QuickEnquiry({ isOpen: externalOpen, onClose: externalClose }: QuickEnquiryProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = (val: boolean) => {
    if (externalClose !== undefined && !val) {
      externalClose();
    } else {
      setInternalOpen(val);
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      try {
        await sendAdminEnquiryAlert({
          admin_email: 'admin@medicareplus.com',
          user_name: formData.name,
          user_email: formData.phone, 
          message: `Preferred Callback Time: ${formData.preferredTime}. Please call back on ${formData.phone}.`
        });
      } catch (emailErr) {
        console.error('Failed to send admin email alert:', emailErr);
      }

      setIsSuccess(true);
      setFormData({ name: '', phone: '', preferredTime: '' });
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: -20, originX: 1, originY: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed top-24 right-8 md:right-16 z-[10002] w-[320px] glass-panel border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden backdrop-blur-[80px]"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-(--color-accent-blue)/10 to-(--color-accent-purple)/10 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-black text-white text-lg tracking-tight">Quick Enquiry</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-green-400 font-bold">Fast Callback</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 bg-black/20">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-white font-bold mb-2">Request Received!</h4>
                <p className="text-(--color-text-muted) text-xs">A healthcare specialist will contact you shortly on your preferred time.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">Preferred Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <select 
                      required
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                      className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-(--color-accent-blue)/50 transition-colors appearance-none"
                    >
                      <option value="" disabled className="bg-zinc-900">Select Time Slot</option>
                      <option value="Morning (9 AM - 12 PM)" className="bg-zinc-900">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)" className="bg-zinc-900">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)" className="bg-zinc-900">Evening (4 PM - 8 PM)</option>
                      <option value="As soon as possible" className="bg-zinc-900">As soon as possible</option>
                    </select>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-(--color-accent-blue)/30 text-white font-bold text-[0.65rem] uppercase tracking-widest flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Request Callback'}
                  <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    );
}
