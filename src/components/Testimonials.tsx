import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: t('home.testimonials.items.rajesh.role'),
      content: t('home.testimonials.items.rajesh.content'),
      rating: 5,
      hospital: "Jaipur Heart Institute"
    },
    {
      name: "Priya Verma",
      role: t('home.testimonials.items.priya.role'),
      content: t('home.testimonials.items.priya.content'),
      rating: 5,
      hospital: "Fortis Escorts"
    },
    {
      name: "Amit Gupta",
      role: t('home.testimonials.items.amit.role'),
      content: t('home.testimonials.items.amit.content'),
      rating: 5,
      hospital: "SMS Hospital (Premium Wing)"
    }
  ];

  return (
    <section className="py-4 relative overflow-hidden">
      <div className="container mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-3 gap-6">
          <div className="max-w-xl">
            <p className="text-(--color-accent-blue) font-mono text-[0.6rem] uppercase tracking-[0.4em] mb-2">{t('home.testimonials.badge')}</p>
            <h2 className="font-serif text-2xl md:text-3xl font-black uppercase tracking-tight leading-[1.1] mb-2 text-white">
              {t('home.testimonials.title')} <br />
              <span className="text-gradient">{t('home.testimonials.highlight')}</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm text-xs leading-relaxed font-medium opacity-80 mb-1">
            {t('home.testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative p-6 rounded-2xl glass-panel border border-white/5 hover:border-(--color-accent-blue)/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={30} className="text-(--color-accent-blue)" />
              </div>
              
              <div className="flex gap-0.5 mb-2 text-(--color-accent-blue)">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} size={10} fill="currentColor" />
                ))}
              </div>

              <p className="text-white/80 text-sm mb-3 leading-relaxed font-serif italic">
                "{testi.content}"
              </p>

              <div className="flex flex-col">
                <h4 className="text-white font-bold tracking-tight text-base">{testi.name}</h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="text-[0.55rem] font-mono text-gray-500 uppercase tracking-widest">{testi.role}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
                  <span className="text-[0.55rem] font-mono text-(--color-accent-blue) uppercase tracking-widest">{testi.hospital}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
