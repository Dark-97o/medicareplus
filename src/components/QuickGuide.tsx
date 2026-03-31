import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Stethoscope, CheckCircle2, Search, ArrowRight, Activity, Zap, HeartPulse, Clock, Users, Building2, Cpu, FileCheck } from 'lucide-react';

export default function QuickGuide() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Search,
      title: t('home.guide.steps.triage.title'),
      desc: t('home.guide.steps.triage.desc'),
      color: "text-(--color-accent-blue)"
    },
    {
      icon: Stethoscope,
      title: t('home.guide.steps.match.title'),
      desc: t('home.guide.steps.match.desc'),
      color: "text-(--color-accent-purple)"
    },
    {
      icon: CheckCircle2,
      title: t('home.guide.steps.booking.title'),
      desc: t('home.guide.steps.booking.desc'),
      color: "text-(--color-text-main)"
    }
  ];

  const miniMetrics = [
    { icon: Users, value: "1k+", label: t('home.metrics.patients'), color: "text-(--color-accent-blue)" },
    { icon: Stethoscope, value: "100+", label: t('home.metrics.doctors'), color: "text-(--color-accent-purple)" },
    { icon: Building2, value: "10+", label: t('home.metrics.hospitals'), color: "text-white" },
    { icon: Clock, value: "24/7", label: t('home.metrics.support'), color: "text-(--color-accent-blue)" },
    { icon: HeartPulse, value: "Clinical", label: t('home.metrics.booking'), color: "text-(--color-accent-purple)" },
    { icon: Zap, value: "0ms", label: t('home.metrics.latency'), color: "text-white" },
    { icon: Cpu, value: "SOTA", label: t('home.metrics.tech'), color: "text-(--color-accent-blue)" },
    { icon: FileCheck, value: "ISO", label: t('home.metrics.lab_tests'), color: "text-(--color-accent-purple)" }
  ];

  return (
    <section className="py-6 relative overflow-hidden bg-black/20">
      <div className="container mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Clipart Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative scale-90"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-(--color-accent-blue)/20 to-(--color-accent-purple)/20 blur-[80px] rounded-full" />
            <div className="relative glass-panel rounded-[30px] overflow-hidden border border-white/10 shadow-xl">
              <img 
                src="/medical_clinical_clipart.png" 
                alt="Medical Support"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 glass-panel p-5 rounded-2xl border border-white/10 backdrop-blur-3xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-(--color-accent-blue)/20 flex items-center justify-center">
                    <Activity className="text-(--color-accent-blue)" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base mb-1">{t('home.guide.support_title')}</p>
                    <p className="text-gray-300 text-[0.65rem] font-medium leading-tight">{t('home.guide.support_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Steps & Mini Metrics */}
          <div className="space-y-4">
            <div>
              <p className="text-(--color-accent-blue) font-mono text-[0.6rem] uppercase tracking-[0.4em] mb-2">{t('home.guide.badge')}</p>
              <h2 className="font-serif text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-4 text-white">
                {t('home.guide.title')} <br />
                <span className="text-gradient">{t('home.guide.highlight')}</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-lg font-medium opacity-80">
                {t('home.guide.desc')}
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex gap-4 group"
                >
                  <div className={`w-12 h-12 rounded-xl glass-panel flex items-center justify-center border border-white/5 group-hover:border-${step.color}/30 transition-all duration-300 shadow-lg shrink-0`}>
                    <step.icon className={step.color} size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                       {step.title}
                       <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-(--color-accent-blue)" />
                    </h4>
                    <p className="text-gray-400 text-[0.7rem] md:text-xs leading-relaxed font-normal">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mini Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
              {miniMetrics.map((metric, index) => (
                <div key={index} className="glass-panel px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-0.5 items-center md:items-start group hover:border-(--color-accent-blue)/20 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <metric.icon size={12} className={`${metric.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-white font-bold font-mono text-[0.7rem] md:text-xs whitespace-nowrap">{metric.value}</span>
                  </div>
                  <span className="text-gray-400 text-[0.5rem] uppercase tracking-[0.05em] font-bold font-mono whitespace-nowrap">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
