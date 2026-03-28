import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative w-12 h-12 rounded-full border-2 border-(--color-accent-blue)/30 p-0.5 overflow-hidden group-hover:border-(--color-accent-blue) transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)]">
        <motion.img 
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          src="https://lh3.googleusercontent.com/pw/AP1GczP3NdIUIWxN0QYXDH4YQyXsiKfcDkgf-jgM_pjB0GgHjwpggjrsjdT85yeV_JDkGSNLFJFH4CtJ9BCjVSrn3WgOR6-quJHKAU1Tx3zije9hh-AwWbrjC7viSDvj6Kr46sJtTGA07gLTIRBT4lFlhHJD=w539-h539-s-no-gm?authuser=0" 
          alt="MedicarePlus Logo" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-black text-white tracking-widest leading-none">
          Medicare<span className="text-(--color-accent-blue)">+</span>
        </h1>
        <p className="text-[0.5rem] font-mono font-bold tracking-[0.2em] text-gray-500 uppercase flex items-center gap-1 group-hover:text-gray-300 transition-colors">
          INNOVATIVE <span className="text-(--color-accent-blue)">•</span> CONNECTED <span className="text-(--color-accent-purple)">•</span> COMPASSIONATE
        </p>
        <p className="text-[0.4rem] font-black tracking-[0.4em] text-(--color-accent-blue) uppercase mt-0.5">
          HEALTH AMPLIFIED
        </p>
      </div>
    </div>
  );
}
