import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Activity, Truck } from 'lucide-react';

export default function EmergencyTag() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Emergency Stack on Right */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            className="glass-panel p-6 rounded-2xl w-72 border border-red-500/20 shadow-[0_20px_50px_rgba(239,68,68,0.2)] pointer-events-auto mb-2"
          >
            <h3 className="text-red-500 font-serif text-lg font-black uppercase tracking-tighter flex items-center gap-2 mb-4">
              <AlertTriangle size={20} />
              Emergency Services
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-between">
                <div>
                  <p className="text-[0.6rem] font-mono uppercase tracking-widest text-gray-400">Primary Hotline</p>
                  <p className="text-xl font-black text-white">102 / 108</p>
                </div>
                <a href="tel:102" className="p-3 rounded-full bg-red-500 text-white hover:scale-110 transition-transform">
                  <Phone size={18} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 text-center">
                  <Truck size={16} className="text-red-400" />
                  <p className="text-[0.55rem] font-bold text-gray-300 uppercase">Ambulance</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 text-center">
                  <Activity size={16} className="text-red-400" />
                  <p className="text-[0.55rem] font-bold text-gray-300 uppercase">ICU on Wheels</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group pointer-events-auto"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-2xl ${isExpanded ? 'bg-zinc-900 border-red-500/40 rotate-90' : 'bg-red-500 border-white/20'}`}>
          <AlertTriangle size={28} className={isExpanded ? 'text-red-500' : 'text-white'} />
        </div>
      </motion.button>
    </div>
  );
}
