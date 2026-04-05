import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Phone, ArrowRight, X, ShieldAlert } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HELPLINES = [
  { name: 'Vandrevala Foundation', number: '9999 666 555', desc: '24/7 Mental Health Support', color: 'text-blue-400' },
  { name: 'iCall (TISS)', number: '022-25521111', desc: 'Mon-Sat, 8am-10pm', color: 'text-purple-400' },
  { name: 'AASRA', number: '9820466726', desc: '24/7 Suicide Prevention', color: 'text-green-400' },
];

export default function SafetyModal({ isOpen, onClose }: SafetyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#0A0A0A] border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-500"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <Heart className="text-red-500 fill-red-500" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-black text-white leading-tight">You are not alone.</h2>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-mono">Emergency Support Active</p>
                </div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light">
                Your life is precious. We are here to support you. Please reach out to these 24/7 helplines if you need to talk.
              </p>

              <div className="space-y-2 mb-6">
                {HELPLINES.map((help) => (
                  <div key={help.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${help.color}`}>{help.name}</p>
                      <p className="text-[7px] text-gray-500 uppercase font-medium">{help.desc}</p>
                    </div>
                    <a href={`tel:${help.number.replace(/\D/g,'')}`} className="text-xs font-mono font-bold text-white px-3 py-1.5 bg-white/5 rounded-lg hover:bg-red-500 transition-all flex items-center gap-2">
                       <Phone size={10} /> {help.number}
                    </a>
                  </div>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3.5 px-6 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                I'm okay, continue <ArrowRight size={14} />
              </button>
            </div>

            <div className="bg-red-500/5 py-2 px-4 text-center border-t border-red-500/10">
              <p className="text-[8px] text-red-500/40 font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
                <ShieldAlert size={10} /> Confidential Mental Health Support
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
