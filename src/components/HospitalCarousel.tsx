import { motion } from "framer-motion";

const hospitals = [
  { name: "SMS Hospital", location: "Jaipur", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=2073&ixlib=rb-4.0.3" },
  { name: "Fortis Escorts", location: "Jaipur", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053&ixlib=rb-4.0.3" },
  { name: "Apex Hospital", location: "Jaipur", image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" },
  { name: "Eternal Hospital", location: "Jaipur", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2064&ixlib=rb-4.0.3" },
  { name: "SDMH Hospital", location: "Jaipur", image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=2074&ixlib=rb-4.0.3" },
  { name: "CK Birla", location: "Jaipur", image: "https://images.unsplash.com/photo-1538108149393-fdfd816959d5?auto=format&fit=crop&q=80&w=2102&ixlib=rb-4.0.3" },
];

export default function HospitalCarousel() {
  return (
    <div className="py-10 relative overflow-hidden bg-black/40 border-y border-white/5 backdrop-blur-3xl">
      <div className="container mx-auto px-8 md:px-16 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-black uppercase tracking-tight leading-[1.1] mb-6">
            Engaged with <span className="text-gradient">Jaipur's Finest</span>
          </h2>
          <p className="text-(--color-text-muted) text-xs md:text-sm font-mono uppercase tracking-[0.5em] opacity-80">
            Network of 50+ Top Tier Medical Institutions
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-x-hidden py-8">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...hospitals, ...hospitals].map((hospital, index) => (
            <div key={index} className="mx-4 group cursor-default inline-block relative">
              {/* Neon Underglow - Refined */}
              <div className="absolute inset-0 bg-(--color-accent-blue)/5 blur-[30px] rounded-full scale-50 group-hover:scale-110 group-hover:bg-(--color-accent-blue)/20 transition-all duration-1000 pointer-events-none opacity-0 group-hover:opacity-100" />
              
              <div className="relative w-80 h-44 rounded-2xl overflow-hidden glass-panel border border-white/5 group-hover:border-(--color-accent-blue)/30 transition-all duration-500 shadow-2xl">
                <img 
                  src={hospital.image} 
                  alt={hospital.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h4 className="text-white font-serif font-black text-base tracking-tight mb-0.5">{hospital.name}</h4>
                  <p className="text-[0.6rem] text-(--color-accent-blue) font-mono uppercase tracking-[0.2em] font-bold">{hospital.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
