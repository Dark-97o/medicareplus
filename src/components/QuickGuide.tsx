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
    <section className="py-20 relative overflow-hidden bg-black/20">
      <div className="container mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Clipart Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-(--color-accent-blue)/20 to-(--color-accent-purple)/20 blur-[100px] rounded-full" />
            <div className="relative glass-panel rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="/medical_clinical_clipart.png" 
                alt="Medical Support"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-10 left-10 right-10 glass-panel p-8 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-(--color-accent-blue)/20 flex items-center justify-center">
                    <Activity className="text-(--color-accent-blue)" size={32} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg mb-1">Live Support Active</p>
                    <p className="text-gray-200 text-sm font-medium">Aura-AI is monitoring your clinical journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Steps & Mini Metrics */}
          <div className="space-y-12">
            <div>
              <p className="text-(--color-accent-blue) font-mono text-[0.7rem] uppercase tracking-[0.5em] mb-4">Patient Onboarding</p>
              <h2 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6 text-white">
                Healing Starts <br />
                <span className="text-gradient">In Three Steps</span>
              </h2>
              <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                Our advanced clinical OS simplifies the journey from symptoms to recovery. Experience healthcare at the speed of thought.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 group"
                >
                  <div className={`w-14 h-14 rounded-2xl glass-panel flex items-center justify-center border border-white/5 group-hover:border-${step.color}/30 transition-all duration-300 shadow-xl`}>
                    <step.icon className={step.color} size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm md:text-base uppercase tracking-widest mb-2 flex items-center gap-3">
                       {step.title}
                       <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-(--color-accent-blue)" />
                    </h4>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed font-normal">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mini Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/5">
              {miniMetrics.map((metric, index) => (
                <div key={index} className="glass-panel px-4 py-3 rounded-2xl border border-white/5 bg-white/5 flex flex-col gap-1 items-center md:items-start group hover:border-(--color-accent-blue)/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <metric.icon size={14} className={`${metric.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-white font-bold font-mono text-sm md:text-base">{metric.value}</span>
                  </div>
                  <span className="text-gray-300 text-[0.6rem] uppercase tracking-[0.2em] font-bold font-mono whitespace-nowrap">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
