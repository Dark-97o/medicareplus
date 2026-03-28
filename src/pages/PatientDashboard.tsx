import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Calendar, Clock, XCircle, RefreshCw, Activity, LogOut, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PatientDashboard() {

  const { t } = useTranslation();
  const { userProfile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('patientId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(apps);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, navigate]);

  const handleCancel = async (appId: string, appDate: string, appTime: string) => {
    if (!confirm("Are you sure you want to cancel this appointment? Refunds are processed via Razorpay based on the 24-hr policy.")) return;
    
    // Calculate 24 hr difference
    const appointmentDateTime = new Date(`${appDate}T${appTime}`);
    const now = new Date();
    const diffHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    const refundPercentage = diffHours > 24 ? 80 : 30;
    
    try {
      await updateDoc(doc(db, 'appointments', appId), {
        status: 'cancelled',
        refundStatus: `Initiated (${refundPercentage}%)`
      });
      alert(`Appointment cancelled. A ${refundPercentage}% Razorpay refund has been initiated.`);
      // Update local state
      setAppointments(prev => prev.map(a => a.id === appId ? { ...a, status: 'cancelled', refundStatus: `Initiated (${refundPercentage}%)` } : a));
    } catch (error) {
      console.error("Cancel failed", error);
      alert("Failed to cancel appointment.");
    }
  };

  const handleRebook = (doctorId: string) => {
    navigate(`/book-appointment?rebookDoc=${doctorId}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-(--color-primary-base) text-white flex items-center justify-center font-mono animate-pulse tracking-widest text-sm uppercase">Loading Secure Portal...</div>;

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status !== 'upcoming');

  return (
    <div className="min-h-screen bg-(--color-primary-base) text-white pt-12 pb-12 px-8 md:px-16 w-full relative overflow-hidden">
      {/* Abstract Background Spline */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none flex items-center justify-center">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/20" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/20" />}>
            <Spline scene="https://prod.spline.design/vwfRpoawpJ6f8SRL/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-(--color-primary-base) via-transparent to-(--color-primary-base) pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-black mb-2">{t('patient.portal')}</h1>
            <p className="text-gray-400 font-light">{t('patient.welcome')} {userProfile?.name || t('admin.patient')}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/book-appointment')} className="bg-(--color-accent-blue) text-black px-6 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              {t('patient.book_new')}
            </button>
            <button onClick={handleSignOut} className="px-5 py-3 rounded border border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-xs uppercase tracking-widest font-semibold flex items-center gap-2 text-gray-300">
              <LogOut size={16} /> {t('patient.sign_out')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upcoming */}
          <div>
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-3"><Activity className="text-(--color-accent-blue)"/> {t('patient.upcoming')}</h2>
            <div className="flex flex-col gap-4">
              {upcoming.length === 0 ? (
                <div className="p-8 border border-white/5 rounded-xl text-center bg-white/5 glass-panel">
                  <p className="text-gray-500 font-mono text-sm">{t('patient.no_upcoming')}</p>
                </div>
              ) : (
                upcoming.map(app => (
                  <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl border border-(--color-accent-blue)/20 flex justify-between items-center group hover:bg-white/5 transition-colors">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white mb-1">{app.doctorName}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm text-(--color-accent-blue) tracking-wider font-mono uppercase">{app.specialization}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-tighter uppercase border ${app.consultationMode === 'online' ? 'bg-(--color-accent-purple)/10 border-(--color-accent-purple)/30 text-(--color-accent-purple)' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {app.consultationMode === 'online' ? t('patient.online') : t('patient.offline')}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {app.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {app.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {app.consultationMode === 'online' && app.status === 'upcoming' && (
                        <button 
                          onClick={() => window.open(app.meetingLink, '_blank')}
                          className="px-4 py-2 bg-(--color-accent-purple) text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
                        >
                          <Video size={14} /> {t('doctor.appointments.video')}
                        </button>
                      )}
                      <button 
                        onClick={() => handleCancel(app.id, app.date, app.time)}
                        className="text-red-400 hover:text-red-300 flex flex-col items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer px-4 py-2 hover:bg-red-500/10 rounded-lg"
                      >
                        <XCircle size={24} /> {t('patient.cancel')}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Past */}
          <div>
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-3 text-gray-400"><Clock className="text-gray-500"/> {t('patient.history')}</h2>
            <div className="flex flex-col gap-4">
              {past.length === 0 ? (
                <div className="p-8 border border-white/5 rounded-xl text-center bg-transparent">
                  <p className="text-gray-500 font-mono text-sm">{t('patient.no_history')}</p>
                </div>
              ) : (
                past.map(app => (
                  <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl border border-white/5 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                    <div>
                      <h3 className="font-serif text-xl font-bold">{app.doctorName}</h3>
                      <p className="text-xs text-gray-500 mb-2 font-mono">{app.date} • <span className={app.status === 'cancelled' ? 'text-red-400' : 'text-green-400'}>{app.status.toUpperCase()}</span></p>
                      {app.refundStatus && <p className="text-xs text-orange-400 font-mono bg-orange-500/10 px-2 py-1 rounded inline-block mt-1">Refund: {app.refundStatus}</p>}
                    </div>
                    {app.status === 'concluded' && (
                      <button 
                        onClick={() => handleRebook(app.doctorId)}
                        className="text-(--color-accent-blue) hover:text-white flex flex-col items-center gap-1 justify-center text-xs uppercase tracking-widest font-bold cursor-pointer hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                      >
                        <RefreshCw size={20} /> {t('patient.rebook')}
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
