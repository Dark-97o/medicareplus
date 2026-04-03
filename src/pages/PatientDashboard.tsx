import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Calendar, Clock, XCircle, RefreshCw, Activity, LogOut, Video, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sendProviderCancellationAlert, sendPatientCancellationNotice } from '../lib/emailService';

export default function PatientDashboard() {

  const { t } = useTranslation();
  const { userProfile, user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [labBookings, setLabBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'doctor' | 'lab'>('doctor');
  const [reportModal, setReportModal] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('patientId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(apps);

        const labQ = query(
          collection(db, 'lab_bookings'),
          where('patientId', '==', user.uid)
        );
        const labSnap = await getDocs(labQ);
        const labs = labSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLabBookings(labs);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const handleCancel = async (app: any) => {
    if (!confirm("Are you sure you want to cancel this appointment? Refunds are processed via Razorpay based on the 24-hr policy.")) return;
    
    // Calculate 24 hr difference
    const appointmentDateTime = new Date(`${app.date}T${app.time}`);
    const now = new Date();
    const diffHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    const refundPercentage = diffHours > 24 ? 90 : 30;
    
    try {
      await updateDoc(doc(db, 'appointments', app.id), {
        status: 'cancelled',
        refundStatus: `Initiated (${refundPercentage}%)`
      });
      alert(`Appointment cancelled. A ${refundPercentage}% Razorpay refund has been initiated.`);
      // Update local state
      setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, status: 'cancelled', refundStatus: `Initiated (${refundPercentage}%)` } : a));

      try {
        await sendProviderCancellationAlert({
          provider_email: 'doctor@example.com',
          provider_name: app.doctorName,
          patient_name: app.patientName || userProfile?.name || 'Patient',
          service_type: 'Doctor Appointment',
          date: app.date,
        });

        await sendPatientCancellationNotice({
          to_email: app.patientEmail || userProfile?.email || user?.email || '',
          to_name: app.patientName || userProfile?.name || 'Patient',
          service_type: 'Doctor Appointment',
          provider_name: app.doctorName,
          date: app.date,
          refund_amount: `${refundPercentage}%`,
        });
      } catch (e) {
        console.error("Failed to send cancellation email", e);
      }
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
    <div className="min-h-screen bg-(--color-primary-base) text-white pt-44 pb-12 px-8 md:px-16 w-full relative overflow-hidden">
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
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/book-appointment')} className="bg-(--color-accent-blue)/10 text-(--color-accent-blue) border border-(--color-accent-blue)/30 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-(--color-accent-blue) hover:text-black transition-all cursor-pointer">
              {t('patient.book_new')}
            </button>
            <button onClick={() => navigate('/lab-booking')} className="bg-(--color-accent-purple)/10 text-(--color-accent-purple) border border-(--color-accent-purple)/30 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-(--color-accent-purple) hover:text-white transition-all cursor-pointer">
              {t('lab.book_test')}
            </button>
            <button onClick={handleSignOut} className="px-5 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 text-gray-400">
              <LogOut size={14} /> {t('patient.sign_out')}
            </button>
          </div>
        </div>

        <div className="flex gap-8 border-b border-white/5 mb-12">
          <button 
            onClick={() => setActiveTab('doctor')}
            className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'doctor' ? 'text-(--color-accent-blue)' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Doctor Consultations
            {activeTab === 'doctor' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-blue)" />}
          </button>
          <button 
            onClick={() => setActiveTab('lab')}
            className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'lab' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Lab & Diagnostics
            {activeTab === 'lab' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
          </button>
        </div>

        {activeTab === 'doctor' ? (
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
                    <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl border border-(--color-accent-blue)/20 flex justify-between items-center group hover:bg-white/5 transition-colors gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                          {app.doctorImageUrl ? (
                            <img src={app.doctorImageUrl} alt={app.doctorName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                               <Activity size={24} className="shrink-0" />
                            </div>
                          )}
                        </div>
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
                          onClick={() => handleCancel(app)}
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
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                          {app.doctorImageUrl ? (
                            <img src={app.doctorImageUrl} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-800">
                              <Activity size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold">{app.doctorName}</h3>
                          <p className="text-xs text-gray-500 mb-2 font-mono">{app.date} • <span className={app.status === 'cancelled' ? 'text-red-400' : 'text-green-400'}>{app.status.toUpperCase()}</span></p>
                          {app.refundStatus && <p className="text-xs text-orange-400 font-mono bg-orange-500/10 px-2 py-1 rounded inline-block mt-1">Refund: {app.refundStatus}</p>}
                        </div>
                      </div>
                      {app.status === 'concluded' && (
                        <div className="flex items-center gap-2">
                          {(app.diagnosis || app.prescription) && (
                            <button 
                              onClick={() => setReportModal(app)}
                              className="text-green-400 hover:text-green-300 flex flex-col items-center gap-1 justify-center text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:bg-green-500/10 px-4 py-2 rounded-lg transition-colors"
                            >
                              <FileText size={20} /> {t('patient.view_report')}
                            </button>
                          )}
                          <button 
                            onClick={() => handleRebook(app.doctorId)}
                            className="text-(--color-accent-blue) hover:text-white flex flex-col items-center gap-1 justify-center text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
                          >
                            <RefreshCw size={20} /> {t('patient.rebook')}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-3"><Activity className="text-(--color-accent-purple)"/> {t('lab.bookings')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labBookings.length === 0 ? (
                <div className="col-span-full p-12 border border-white/5 rounded-2xl text-center bg-white/5 glass-panel">
                   <p className="text-gray-500 font-mono text-sm">No lab bookings found.</p>
                   <button onClick={() => navigate('/lab-booking')} className="mt-4 text-(--color-accent-purple) hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                     Book your first test →
                   </button>
                </div>
              ) : (
                labBookings.map(lab => (
                  <motion.div key={lab.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-6 rounded-2xl border border-(--color-accent-purple)/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-white mb-1">{lab.testName}</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{lab.hospitalName}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center text-(--color-accent-purple)">
                        <Activity size={20} className="shrink-0" />
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} className="text-gray-600" />
                        <span>{lab.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-(--color-accent-purple) font-bold">
                        <span>₹{lab.charges}</span>
                        <span className="text-[8px] bg-(--color-accent-purple)/10 px-2 py-0.5 rounded border border-(--color-accent-purple)/20 uppercase tracking-tighter ml-2">Paid via Razorpay</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                        Confirmed
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {reportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setReportModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel border border-(--color-accent-blue)/30 rounded-2xl p-6 shadow-2xl z-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white mb-1 flex items-center gap-2">
                    <FileText className="text-(--color-accent-blue)" /> {t('patient.report_title')}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
                    Dr. {reportModal.doctorName} • {reportModal.date}
                  </p>
                </div>
                <button onClick={() => setReportModal(null)} className="text-gray-500 hover:text-white">
                  <XCircle size={20} />
                </button>
              </div>

              {reportModal.diagnosis && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest mb-2 border-l-2 border-(--color-accent-blue) pl-2">
                    {t('patient.diagnosis')}
                  </h4>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {reportModal.diagnosis}
                  </div>
                </div>
              )}

              {reportModal.prescription && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 border-l-2 border-green-400 pl-2">
                    {t('patient.prescription')}
                  </h4>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {reportModal.prescription}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
