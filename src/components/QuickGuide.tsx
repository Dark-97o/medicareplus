import { motion } from 'framer-motion';
import { Stethoscope, CheckCircle2, Search, ArrowRight, Activity, Zap, HeartPulse, Clock, Users, Building2, Cpu, FileCheck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "AI Triage",
    desc: "Describe symptoms to our intelligent clinical engine.",
    color: "text-(--color-accent-blue)"
  },
  {
    icon: Stethoscope,
    title: "Specialist Match",
    desc: "Get matched with the top-tier specialists instantly.",
    color: "text-(--color-accent-purple)"
  },
  {
    icon: CheckCircle2,
    title: "Secure Booking",
    desc: "Confirm your slot with one-tap encrypted booking.",
    color: "text-(--color-text-main)"
  }
];

const miniMetrics = [
  { icon: Users, value: "1k+", label: "Patients", color: "text-(--color-accent-blue)" },
  { icon: Stethoscope, value: "100+", label: "Doctors", color: "text-(--color-accent-purple)" },
  { icon: Building2, value: "10+", label: "Hospitals", color: "text-white" },
  { icon: Clock, value: "24/7", label: "Support", color: "text-(--color-accent-blue)" },
  { icon: HeartPulse, value: "Clinical", label: "Booking", color: "text-(--color-accent-purple)" },
  { icon: Zap, value: "0ms", label: "Latency", color: "text-white" },
  { icon: Cpu, value: "SOTA", label: "Tech", color: "text-(--color-accent-blue)" },
  { icon: FileCheck, value: "ISO", label: "Lab Tests", color: "text-(--color-accent-purple)" }
];

export default function QuickGuide() {
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
                    <p className="text-white font-bold text-base mb-1">Live Support Active</p>
                    <p className="text-gray-300 text-[0.65rem] font-medium leading-tight">Aura-AI is monitoring your clinical journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Steps & Mini Metrics */}
          <div className="space-y-4">
            <div>
              <p className="text-(--color-accent-blue) font-mono text-[0.6rem] uppercase tracking-[0.4em] mb-2">Patient Onboarding</p>
              <h2 className="font-serif text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.1] mb-4 text-white">
                Healing Starts <br />
                <span className="text-gradient">In Three Steps</span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-lg font-medium opacity-80">
                Our advanced clinical OS simplifies the journey from symptoms to recovery. Experience healthcare at the speed of thought.
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
                    <span className="text-white font-bold font-mono text-[0.7rem] md:text-xs">{metric.value}</span>
                  </div>
                  <span className="text-gray-400 text-[0.5rem] uppercase tracking-[0.1em] font-bold font-mono whitespace-nowrap">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
