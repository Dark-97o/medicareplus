import { Routes, Route, Link } from 'react-router-dom';
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
import { useState } from 'react';
import { PhoneCall } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
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
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 md:px-16 bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/doctor" className="relative group px-6 py-2 rounded-full overflow-hidden transition-all duration-300">
            <span className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:border-(--color-accent-purple)/50 transition-colors" />
            <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-purple)/0 via-(--color-accent-purple)/20 to-(--color-accent-purple)/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-text-muted) group-hover:text-white transition-colors">
              {t('nav.doctor')}
            </span>
          </Link>

          <Link to="/lab" className="relative group px-6 py-2 rounded-full overflow-hidden transition-all duration-300">
            <span className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:border-(--color-accent-purple)/50 transition-colors" />
            <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-purple)/0 via-(--color-accent-purple)/20 to-(--color-accent-purple)/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-text-muted) group-hover:text-white transition-colors">
              {t('nav.lab')}
            </span>
          </Link>

          {(!userProfile || userProfile?.role === 'admin') && (
            <Link to="/admin" className="relative group px-6 py-2 rounded-full overflow-hidden transition-all duration-300">
              <span className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:border-(--color-accent-blue)/50 transition-colors" />
              <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-blue)/0 via-(--color-accent-blue)/20 to-(--color-accent-blue)/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-text-muted) group-hover:text-white transition-colors">
                {t('nav.admin')}
              </span>
            </Link>
          )}
          
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
            <QuickEnquiry isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block" />
          <LanguageSelector />
        </div>
      </nav>

      {/* Application Routes */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/lab-booking" element={<LabBooking />} />
          <Route path="/lab-registration" element={<LabRegistration />} />
          <Route path="/consultation/:roomID" element={<Consultation />} />
        </Routes>
      </main>

      {/* Global Clinical Elements */}
      <EmergencyTag />
      <SupportTags />
    </div>
  );
}
