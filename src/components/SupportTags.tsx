import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

export default function SupportTags() {
  return (
    <div className="fixed right-32 bottom-8 z-50 flex flex-row gap-3 pointer-events-none">
      <motion.a 
        href="tel:+911412223344"
        className="pointer-events-auto h-12 flex items-center bg-zinc-900 border border-(--color-accent-blue)/20 rounded-full text-(--color-accent-blue) shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:bg-zinc-800 transition-colors group px-4 overflow-hidden"
        initial="rest"
        whileHover="hovered"
        animate="rest"
      >
        <Phone size={20} className="shrink-0" />
        <motion.span 
          variants={{
            rest: { width: 0, opacity: 0, marginLeft: 0 },
            hovered: { width: 'auto', opacity: 1, marginLeft: 12 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="whitespace-nowrap font-mono text-xs font-bold text-(--color-accent-blue) tracking-tighter"
        >
          +91 141 222 3344
        </motion.span>
      </motion.a>
      
      <motion.a 
        href="https://wa.me/911412223344"
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        className="pointer-events-auto w-12 h-12 rounded-full bg-zinc-900 border border-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all hover:bg-zinc-800"
        title="WhatsApp"
      >
        <MessageCircle size={20} />
      </motion.a>
    </div>
  );
}
