import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorRegistration from './pages/DoctorRegistration';

export default function App() {
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
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 flex items-center justify-between px-8 md:px-16">
        <Link to="/" className="font-serif text-2xl font-bold tracking-wide flex items-center gap-2 group">
          MediCare
          <span className="text-gradient font-black group-hover:drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] transition-all">+</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="relative group px-6 py-2 rounded-full overflow-hidden transition-all duration-300">
            <span className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:border-(--color-accent-blue)/50 transition-colors" />
            <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-blue)/0 via-(--color-accent-blue)/20 to-(--color-accent-blue)/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-text-muted) group-hover:text-white transition-colors">
              Admin
            </span>
          </Link>
          <Link to="/doctor" className="relative group px-6 py-2 rounded-full overflow-hidden transition-all duration-300">
            <span className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 group-hover:border-(--color-accent-purple)/50 transition-colors" />
            <span className="absolute inset-0 bg-gradient-to-r from-(--color-accent-purple)/0 via-(--color-accent-purple)/20 to-(--color-accent-purple)/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <span className="relative text-xs font-semibold tracking-[0.2em] uppercase text-(--color-text-muted) group-hover:text-white transition-colors">
              Doctor
            </span>
          </Link>
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
        </Routes>
      </main>
    </div>
  );
}
