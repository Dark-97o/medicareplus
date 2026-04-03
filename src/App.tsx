import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorRegistration from './pages/DoctorRegistration';
import LabDashboard from './pages/LabDashboard';
import LabBooking from './pages/LabBooking';
import LabRegistration from './pages/LabRegistration';
import Consultation from './pages/Consultation';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import Logo from './components/Logo';
import QuickEnquiry from './components/QuickEnquiry';
import EmergencyTag from './components/EmergencyTag';
import SupportTags from './components/SupportTags';
import { useAuth } from './contexts/AuthContext';
import AIChatAssistant from './components/AIChatAssistant';
import { useState } from 'react';
import { PhoneCall, ChevronDown, UserCog, FlaskConical, Stethoscope } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const location = useLocation();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const hideFloaters = location.pathname.startsWith('/admin') || 
                       location.pathname.startsWith('/doctor') || 
                       location.pathname.startsWith('/lab');
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return (
    <div className="min-h-screen bg-(--color-primary-base) text-(--color-text-main) font-sans relative overflow-x-hidden selection:bg-(--color-accent-blue) selection:text-white">
      {/* Immersive Dark Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[10001] h-20 flex items-center justify-between px-8 md:px-16 bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          {/* Professional Portals Dropdown */}
          <div className="relative group">
            <button className="relative flex items-center gap-2 px-6 py-2 rounded-full overflow-hidden transition-all duration-300">
              <span className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:border-(--color-accent-blue)/50 transition-colors" />
              <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-text-muted) group-hover:text-white transition-colors flex items-center gap-2">
                Professional <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
              <div className="glass-panel p-2 rounded-2xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-3xl overflow-hidden">
                <Link to="/doctor" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                  <div className="w-8 h-8 rounded-lg bg-(--color-accent-purple)/10 flex items-center justify-center text-(--color-accent-purple)">
                    <Stethoscope size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-white transition-colors">{t('nav.doctor')}</span>
                </Link>
                
                <Link to="/lab" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                    <FlaskConical size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover/item:text-white transition-colors">{t('nav.lab')}</span>
                </Link>

                {(!userProfile || userProfile?.role === 'admin') && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group/item border-t border-white/5 mt-1 pt-2">
                    <div className="w-8 h-8 rounded-lg bg-(--color-accent-blue)/10 flex items-center justify-center text-(--color-accent-blue)">
                      <UserCog size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover/item:text-white transition-colors">{t('nav.admin')}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {!hideFloaters && (
            <div className="relative">
              <button 
                onClick={() => setIsEnquiryOpen(!isEnquiryOpen)}
                className="relative group px-6 py-2 rounded-full overflow-hidden transition-all duration-300 flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-(--color-accent-blue)/10 backdrop-blur-md rounded-full border border-(--color-accent-blue)/20 group-hover:border-(--color-accent-blue)/50 transition-colors" />
                <PhoneCall size={14} className="relative text-(--color-accent-blue)" />
                <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-accent-blue) group-hover:text-white transition-colors">
                  Quick Enquiry
                </span>
              </button>
            </div>
          )}

          <div className="h-6 w-px bg-white/10 hidden md:block" />
          <LanguageSelector />
        </div>
      </nav>

      {/* Application Routes */}
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/lab-booking" element={<LabBooking />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/lab-registration" element={<LabRegistration />} />
          <Route path="/consultation/:roomID" element={<Consultation />} />
        </Routes>
      </main>

      {/* Global Clinical Elements */}
      {!hideFloaters && (
        <>
          <EmergencyTag />
          <SupportTags />
          <QuickEnquiry isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
          <AIChatAssistant />
        </>
      )}
    </div>
  );
}
