import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Spline from '@splinetool/react-spline';
import { ArrowRight, Activity, Zap, Stethoscope, Clock, HeartPulse } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import AuthModal from '../components/AuthModal';
import ContactUs from '../components/ContactUs';
import HospitalCarousel from '../components/HospitalCarousel';
import QuickGuide from '../components/QuickGuide';
import Testimonials from '../components/Testimonials';
// Social icons removed to fix Vite export error

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    fetch("https://newsdata.io/api/1/latest?apikey=pub_d0d4862d2dd44cc8a6697f1e9104c75d&country=in&language=hi,en&category=health")
      .then(response => response.json())
      .then(data => {
        if (data && data.results) {
          setNewsData(data.results.slice(0, 3));
        }
        setLoadingNews(false);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        setLoadingNews(false);
      });
  }, []);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "100px"]);
  
  return (
    <div className="relative min-h-screen bg-(--color-primary-base) overflow-hidden">
      {/* Background Ambient Glows */}
      <motion.div style={{ y: yBg }} className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-(--color-accent-blue) rounded-full blur-[150px] opacity-15 pointer-events-none" />
      <motion.div style={{ y: yBg }} className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-(--color-accent-purple) rounded-full blur-[150px] opacity-15 pointer-events-none" />

      {/* Fixed Sticky Spline 3D Integration for Scrollytelling */}
      <div className="fixed inset-0 z-0 h-[100vh] w-full pointer-events-auto">
        <ErrorBoundary fallback={<div className="w-full h-full bg-black/50" />}>
          <Spline scene="https://prod.spline.design/0GYABY-8AcVvARmw/scene.splinecode" />
        </ErrorBoundary>
        {/* Dark overlay to ensure text contrast during scroll */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-(--color-primary-base) to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-(--color-primary-base) via-(--color-primary-base)/70 to-transparent pointer-events-none" />
      </div>

      {/* Overlay Scrollable Content */}
      <div className="relative z-10 font-sans">
      
        {/* Hero Section */}
        <section className="h-screen flex flex-col justify-center px-8 md:px-16 pb-6 pt-20 relative">
          
          {/* Floating Specialization Pills */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
            {[
              { spec: t('specialities.neurology'), top: "15%", right: "10%" },
              { spec: t('specialities.cardiology'), top: "30%", right: "25%" },
              { spec: t('specialities.orthopedics'), top: "45%", right: "8%" },
              { spec: t('specialities.pediatrics'), top: "60%", right: "30%" },
              { spec: t('specialities.oncology'), top: "75%", right: "15%" },
              { spec: t('specialities.dermatology'), top: "20%", right: "35%" },
              { spec: t('specialities.endocrinology'), top: "85%", right: "40%" },
              { spec: t('specialities.psychiatry'), top: "40%", right: "45%" },
              { spec: t('specialities.urology'), top: "10%", right: "20%" },
              { spec: t('specialities.radiology'), top: "55%", right: "20%" },
              { spec: t('specialities.pathology'), top: "70%", right: "45%" },
              { spec: t('specialities.surgery'), top: "85%", right: "5%" },
            ].map((pill, i) => (
              <motion.div
                key={pill.spec}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 0.7, 
                  scale: 1,
                  y: [0, (i % 2 === 0 ? -20 : 20), 0], 
                  x: [0, (i % 3 === 0 ? 15 : -15), 0] 
                }}
                transition={{ 
                  duration: 6 + (i % 4) * 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.2 + 0.5 
                }}
                style={{ top: pill.top, right: pill.right }}
                className="absolute px-4 py-2 rounded-full glass-panel border border-(--color-accent-blue)/20 text-[0.65rem] font-mono tracking-widest text-(--color-accent-blue) shadow-[0_0_15px_rgba(0,229,255,0.15)] flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-(--color-accent-purple) animate-pulse shadow-[0_0_10px_var(--color-accent-purple)]" />
                {pill.spec}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl relative"
          >
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-(--color-accent-blue)/30 bg-(--color-accent-blue)/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-(--color-accent-blue) animate-pulse shadow-[0_0_10px_var(--color-accent-blue)]" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-(--color-accent-blue) drop-shadow-md">{t('hero.badge')}</span>
            </div>
            
            <h1 className="font-serif text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-4 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {t('hero.title_prefix')} <br />
              <span className="text-gradient drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">{t('hero.title_highlight')}</span>
            </h1>
            
            <p className="text-base text-gray-300 font-light leading-relaxed max-w-md mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Jaipur's most trusted platform — book appointments, health checkups & lab tests instantly.
            </p>
            
            <div className="flex flex-col items-start gap-3 mb-5 max-w-[300px]">
              {/* Book Appointment Button */}
              <button onClick={() => setIsAuthOpen(true)} className="relative group px-9 py-4 rounded-md flex items-center gap-3 w-full justify-center overflow-hidden border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer">
                <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-purple) to-(--color-accent-blue) opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <span className="relative text-white font-semibold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                  {t('hero.book_now')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              {/* Health Checkup Button */}
              <button 
                onClick={() => navigate('/book-appointment?mode=checkup')}
                className="relative group px-9 py-4 rounded-md flex items-center gap-3 w-full justify-center overflow-hidden border border-white/10 cursor-pointer bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
              >
                <span className="relative text-(--color-accent-blue) font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={16} />
                  Health Checkup
                </span>
              </button>
              
              {/* Lab Test Button */}
              <button 
                onClick={() => navigate('/lab-booking')}
                className="relative group px-9 py-4 rounded-md flex items-center gap-3 w-full justify-center overflow-hidden border border-(--color-accent-purple)/30 cursor-pointer bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
              >
                <span className="relative text-(--color-accent-purple) font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                  <HeartPulse size={16} />
                  Book Lab Test
                </span>
              </button>

              <a href="#metrics" className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-(--color-accent-blue) transition-colors flex items-center gap-2 group mt-1">
                {t('hero.explore')} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <p onClick={() => navigate('/doctor')} className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-(--color-accent-blue) transition-colors cursor-pointer w-fit flex items-center gap-2 bg-black/20 px-2 py-1.5 rounded border border-transparent hover:border-(--color-accent-blue)/30">
              <Stethoscope size={13} /> {t('hero.physician_gateway')}
            </p>
          </motion.div>


        </section>


        <QuickGuide />

        {/* Local News/Articles Section */}
        <section className="py-24 px-8 md:px-16 container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col items-center text-center"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
              {t('home.intelligence.title')} <span className="text-gradient">{t('home.intelligence.highlight')}</span>
            </h2>
            <p className="text-gray-200 max-w-3xl text-sm md:text-base leading-relaxed font-medium">
              {t('home.intelligence.desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingNews ? (
              <div className="col-span-3 text-center py-12 text-(--color-text-muted) animate-pulse font-mono text-sm tracking-widest uppercase">
                {t('home.intelligence.fetching')}
              </div>
            ) : newsData.length > 0 ? (
              newsData.map((article, idx) => (
                <motion.div 
                  key={article.article_id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="group relative glass-panel p-8 rounded-2xl flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between pointer-events-none">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-(--color-accent-blue)/10 border-(--color-accent-blue)/20 transition-colors">
                      <Activity size={20} className="text-(--color-accent-blue)" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.6rem] font-mono uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-gray-400">{article.source_id || t('home.intelligence.alert')}</span>
                      <span className="text-[0.6rem] font-mono uppercase tracking-widest text-(--color-text-muted)">
                        {new Date(article.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold text-white leading-tight mt-2 line-clamp-3" title={article.title}>{article.title}</h3>
                  <p className="text-(--color-text-muted) font-light leading-relaxed text-sm flex-grow line-clamp-4" title={article.description}>
                    {article.description || t('home.intelligence.no_details')}
                  </p>
                  
                  <a href={article.link} target="_blank" rel="noreferrer" className="mt-4 pt-4 border-t border-white/10 flex items-center text-xs font-semibold uppercase tracking-widest text-(--color-accent-purple) group-hover:text-(--color-accent-blue) transition-colors cursor-pointer w-fit">
                    {t('home.intelligence.read_report')} <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-(--color-text-muted) font-mono text-sm tracking-widest uppercase">
                {t('home.intelligence.no_alerts')}
              </div>
            )}
          </div>
        </section>

        {/* Hospitals Carousel */}
        <ErrorBoundary fallback={null}>
          <HospitalCarousel />
        </ErrorBoundary>

        <Testimonials />

        {/* Contact Us Section */}
        <ErrorBoundary fallback={null}>
          <ContactUs />
        </ErrorBoundary>

        {/* Enhanced Footer */}
        <footer className="border-t border-white/5 pt-12 pb-8 px-8 md:px-16 bg-black/40 backdrop-blur-3xl relative z-20 overflow-hidden text-sm">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-xl font-serif font-black text-white tracking-wider">
                Medicare<span className="text-(--color-accent-blue)">+</span>
              </h3>
              <p className="text-(--color-text-muted) max-w-sm text-xs leading-relaxed">
                Pioneering the future of digital healthcare in Rajasthan. Our platform connects you with the best medical experts using cutting-edge technology and a compassionate approach.
              </p>
              <div className="flex items-center gap-3">
                {[Activity, Activity, Activity, Activity].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-(--color-accent-blue) hover:border-(--color-accent-blue)/40 transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[0.6rem] font-mono uppercase tracking-[0.3em] text-(--color-accent-purple)">Quick Links</h4>
              <ul className="space-y-2 text-xs text-(--color-text-muted)">
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Book Appointment</li>
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Find a Doctor</li>
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Emergency Services</li>
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Health Packages</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[0.6rem] font-mono uppercase tracking-[0.3em] text-(--color-accent-blue)">Legal</h4>
              <ul className="space-y-2 text-xs text-(--color-text-muted)">
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer capitalize">Refund Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 text-center">
            <p className="font-mono text-[0.6rem] tracking-[0.2em] text-(--color-text-muted) uppercase">
              © 2026 MedicarePlus. INNOVATIVE. CONNECTED. COMPASSIONATE. All Rights Reserved.
            </p>
            <p className="font-mono text-[0.5rem] tracking-[0.1em] text-gray-700 uppercase mt-1">
              Powered by Advanced Health Systems • Jaipur Region
            </p>
          </div>
        </footer>
        
      </div>
      
      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
