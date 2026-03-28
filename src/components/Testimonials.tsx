import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Heart Surgery Patient",
    content: "The care I received at Jaipur Heart Institute through MedicarePlus was exceptional. The booking process was seamless, and the coordination was perfect.",
    rating: 5,
    hospital: "Jaipur Heart Institute"
  },
  {
    name: "Priya Verma",
    role: "Orthopedic Patient",
    content: "Found the best specialist for my knee surgery. The platform's triage tool really helped me understand which specialist I needed to see first.",
    rating: 5,
    hospital: "Fortis Escorts"
  },
  {
    name: "Amit Gupta",
    role: "Health Checkup",
    content: "The annual executive checkup was arranged so efficiently. No waiting times, direct access to top doctors. Highly recommended clinical service.",
    rating: 5,
    hospital: "SMS Hospital (Premium Wing)"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <p className="text-(--color-accent-blue) font-mono text-[0.6rem] uppercase tracking-[0.4em] mb-4">Patient Perspectives</p>
            <h2 className="font-serif text-4xl md:text-6xl font-black tracking-[-0.03em] uppercase">
              Real Patients <br />
              <span className="text-gradient">Real Stories</span>
            </h2>
          </div>
          <p className="text-(--color-text-muted) max-w-xs text-sm leading-relaxed opacity-60">
            Join 10,000+ patients who found their perfect healthcare path with our advanced network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl glass-panel border border-white/5 hover:border-(--color-accent-blue)/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={40} className="text-(--color-accent-blue)" />
              </div>
              
              <div className="flex gap-1 mb-6 text-(--color-accent-blue)">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>

              <p className="text-white/80 text-lg mb-8 leading-relaxed font-serif italic">
                "{testi.content}"
              </p>

              <div className="flex flex-col">
                <h4 className="text-white font-bold tracking-tight text-lg">{testi.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[0.6rem] font-mono text-gray-500 uppercase tracking-widest">{testi.role}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[0.6rem] font-mono text-(--color-accent-blue) uppercase tracking-widest">{testi.hospital}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
