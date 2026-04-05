import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Calendar, Clock, XCircle, RefreshCw, Activity, LogOut, Video, FileText, MessageSquare, Star } from 'lucide-react';
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
  const [feedbackModal, setFeedbackModal] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  const handleSystemRefund = async (app: any) => {
    try {
      await updateDoc(doc(db, 'appointments', app.id), {
        refundStatus: 'Initiated (100%)'
      });
      alert('100% Refund Initiated successfully.');
      setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, refundStatus: 'Initiated (100%)' } : a));
    } catch(e) { console.error(); }
  };

  const submitFeedback = async () => {
    if(!feedbackModal || !feedbackText) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'appointments', feedbackModal.id), {
        reviewText: feedbackText,
        reviewRating: feedbackRating,
        reviewedAt: new Date().toISOString()
      });
      alert('Thank you for your feedback!');
      setAppointments(prev => prev.map(a => a.id === feedbackModal.id ? {...a, reviewText: feedbackText} : a));
      setFeedbackModal(null);
      setFeedbackText('');
    } catch (e) {
      alert('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-(--color-primary-base) text-white pt-28 pb-12 px-8 md:px-16 w-full relative overflow-hidden">
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-serif font-black mb-1">{t('patient.portal')}</h1>
            <p className="text-xs text-gray-400 font-light">{t('patient.welcome')} {userProfile?.name || t('admin.patient')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/book-appointment')} className="bg-(--color-accent-blue)/10 text-(--color-accent-blue) border border-(--color-accent-blue)/30 px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-(--color-accent-blue) hover:text-black transition-all cursor-pointer">
              {t('patient.book_new')}
            </button>
            <button onClick={() => navigate('/lab-booking')} className="bg-(--color-accent-purple)/10 text-(--color-accent-purple) border border-(--color-accent-purple)/30 px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-(--color-accent-purple) hover:text-white transition-all cursor-pointer">
              {t('lab.book_test')}
            </button>
            <button onClick={handleSignOut} className="px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5 text-gray-400">
              <LogOut size={12} /> {t('patient.sign_out')}
            </button>
          </div>
        </div>

        <div className="flex gap-8 border-b border-white/5 mb-8">
          <button 
            onClick={() => setActiveTab('doctor')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'doctor' ? 'text-(--color-accent-blue)' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Doctor Consultations
            {activeTab === 'doctor' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-blue)" />}
          </button>
          <button 
            onClick={() => setActiveTab('lab')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'lab' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Lab & Diagnostics
            {activeTab === 'lab' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
          </button>
        </div>

        {activeTab === 'doctor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming */}
            <div>
              <h2 className="text-xl font-serif mb-4 flex items-center gap-2"><Activity className="text-(--color-accent-blue)" size={18}/> {t('patient.upcoming')}</h2>
              <div className="flex flex-col gap-3">
                {upcoming.length === 0 ? (
                  <div className="p-6 border border-white/5 rounded-xl text-center bg-white/5 glass-panel">
                    <p className="text-gray-500 font-mono text-xs">{t('patient.no_upcoming')}</p>
                  </div>
                ) : (
                  upcoming.map(app => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 rounded-xl border border-(--color-accent-blue)/20 flex justify-between items-center group hover:bg-white/5 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                          {app.doctorImageUrl ? (
                            <img src={app.doctorImageUrl} alt={app.doctorName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                               <Activity size={20} className="shrink-0" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-bold text-white leading-tight mb-0.5">{app.doctorName}</h3>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] text-(--color-accent-blue) tracking-wider font-mono uppercase">{app.specialization}</p>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-tighter uppercase border ${app.consultationMode === 'online' ? 'bg-(--color-accent-purple)/10 border-(--color-accent-purple)/30 text-(--color-accent-purple)' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                              {app.consultationMode === 'online' ? t('patient.online') : t('patient.offline')}
                            </span>
                          </div>
                          <div className="flex gap-3 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {app.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12}/> {app.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {app.consultationMode === 'online' && app.status === 'upcoming' && (
                          <button 
                            onClick={() => window.open(app.meetingLink, '_blank')}
                            className="px-3 py-1.5 bg-(--color-accent-purple) text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
                          >
                            <Video size={12} /> Join
                          </button>
                        )}
                        <button 
                          onClick={() => handleCancel(app)}
                          className="text-red-400 hover:text-red-300 flex flex-col items-center justify-center gap-1 text-[9px] uppercase tracking-widest font-bold opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer px-3 py-1.5 hover:bg-red-500/10 rounded-lg"
                        >
                          <XCircle size={18} /> {t('patient.cancel')}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Past */}
            <div>
              <h2 className="text-xl font-serif mb-4 flex items-center gap-2 text-gray-400"><Clock className="text-gray-500" size={18}/> {t('patient.history')}</h2>
              <div className="flex flex-col gap-3">
                {past.length === 0 ? (
                  <div className="p-6 border border-white/5 rounded-xl text-center bg-transparent">
                    <p className="text-gray-500 font-mono text-xs">{t('patient.no_history')}</p>
                  </div>
                ) : (
                  past.map(app => (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                          {app.doctorImageUrl ? (
                            <img src={app.doctorImageUrl} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-800">
                              <Activity size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-bold leading-tight">{app.doctorName}</h3>
                          <p className="text-[10px] text-gray-500 mb-1 font-mono uppercase">{app.date} • <span className={app.status === 'cancelled' ? 'text-red-400' : 'text-green-400'}>{app.status.toUpperCase()}</span></p>
                          {app.refundStatus && <p className="text-[9px] text-orange-400 font-mono bg-orange-500/10 px-1.5 py-0.5 rounded inline-block mt-0.5">Refund: {app.refundStatus}</p>}
                        </div>
                      </div>
                          {app.status === 'system_cancelled' && !app.refundStatus && (
                            <div className="flex flex-col gap-1.5 p-2 bg-red-500/10 border border-red-500/20 rounded-lg items-end">
                              <p className="text-[9px] uppercase text-red-300 font-bold tracking-widest text-right leading-tight max-w-[150px]">Doctor unavailable.</p>
                              <div className="flex gap-1.5">
                                <button onClick={() => handleSystemRefund(app)} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 px-2 py-1 rounded-[4px] text-[8px] font-bold uppercase transition-colors">Refund</button>
                                <button onClick={() => navigate(`/book-appointment?specialty=${encodeURIComponent(app.specialization || 'General Physician')}&freeRescheduleId=${app.id}`)} className="bg-(--color-accent-blue) text-black hover:bg-white px-2 py-1 rounded-[4px] text-[8px] font-bold uppercase transition-colors shadow-[0_0_10px_rgba(0,229,255,0.3)]">Reschedule</button>
                              </div>
                            </div>
                          )}

                      {app.status === 'concluded' && (
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            if (!app.date || !app.time) return null;
                            const scheduled = new Date(`${app.date}T${app.time}`).getTime();
                            const now = new Date().getTime();
                            if (now - scheduled > 5 * 60 * 60 * 1000 && !app.reviewText) {
                              return (
                                <button 
                                  onClick={() => setFeedbackModal(app)}
                                  className="text-yellow-400 hover:text-yellow-300 flex flex-col items-center gap-0.5 justify-center text-[8px] uppercase tracking-widest font-bold cursor-pointer hover:bg-yellow-500/10 px-3 py-2 rounded-lg transition-colors"
                                >
                                  <MessageSquare size={16} /> Feedback
                                </button>
                              );
                            }
                            return null;
                          })()}
                          {(app.diagnosis || app.prescription) && (
                            <button 
                              onClick={() => setReportModal(app)}
                              className="text-green-400 hover:text-green-300 flex flex-col items-center gap-0.5 justify-center text-[8px] uppercase tracking-widest font-bold cursor-pointer hover:bg-green-500/10 px-3 py-2 rounded-lg transition-colors"
                            >
                              <FileText size={16} /> Report
                            </button>
                          )}
                          <button 
                            onClick={() => handleRebook(app.doctorId)}
                            className="text-(--color-accent-blue) hover:text-white flex flex-col items-center gap-0.5 justify-center text-[8px] uppercase tracking-widest font-bold cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                          >
                            <RefreshCw size={16} /> Rebook
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
          <div className="space-y-6">
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2"><Activity className="text-(--color-accent-purple)" size={18}/> {t('lab.bookings')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labBookings.length === 0 ? (
                <div className="col-span-full p-8 border border-white/5 rounded-2xl text-center bg-white/5 glass-panel">
                   <p className="text-gray-500 font-mono text-xs">No lab bookings found.</p>
                   <button onClick={() => navigate('/lab-booking')} className="mt-2 text-(--color-accent-purple) hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                     Book your first test →
                   </button>
                </div>
              ) : (
                labBookings.map(lab => (
                  <motion.div key={lab.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4 rounded-2xl border border-(--color-accent-purple)/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white leading-tight mb-0.5">{lab.testName}</h3>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest font-mono truncate max-w-[150px]">{lab.hospitalName}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center text-(--color-accent-purple)">
                        <Activity size={16} className="shrink-0" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <Calendar size={12} className="text-gray-600" />
                        <span>{lab.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-(--color-accent-purple) font-bold">
                        <span>₹{lab.charges}</span>
                        <span className="text-[7px] bg-(--color-accent-purple)/10 px-1.5 py-0.5 rounded border border-(--color-accent-purple)/20 uppercase tracking-tighter ml-1">Paid</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
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
              className="relative w-full max-w-lg glass-panel border border-(--color-accent-blue)/30 rounded-2xl p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-5 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-0.5 flex items-center gap-2">
                    <FileText className="text-(--color-accent-blue)" size={18} /> {t('patient.report_title')}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    Dr. {reportModal.doctorName} • {reportModal.date}
                  </p>
                </div>
                <button onClick={() => setReportModal(null)} className="text-gray-500 hover:text-white transition-colors">
                  <XCircle size={18} />
                </button>
              </div>

              {reportModal.diagnosis && (
                <div className="mb-5">
                  <h4 className="text-[10px] font-bold text-(--color-accent-blue) uppercase tracking-widest mb-1.5 border-l-2 border-(--color-accent-blue) pl-2">
                    {t('patient.diagnosis')}
                  </h4>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {reportModal.diagnosis}
                  </div>
                </div>
              )}

              {reportModal.prescription && (
                <div className="mb-2">
                  <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1.5 border-l-2 border-green-400 pl-2">
                    {t('patient.prescription')}
                  </h4>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {reportModal.prescription}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setFeedbackModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel border border-yellow-500/30 rounded-2xl p-5 shadow-2xl z-10">
              <div className="flex justify-between items-start mb-5 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-0.5 flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={18} /> Share Feedback
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    Dr. {feedbackModal.doctorName}
                  </p>
                </div>
                <button onClick={() => setFeedbackModal(null)} className="text-gray-500 hover:text-white transition-colors">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setFeedbackRating(star)} 
                      className={`p-1.5 rounded-lg transition-colors ${feedbackRating >= star ? 'text-yellow-400' : 'text-gray-700'}`}
                    >
                      <Star size={20} className={feedbackRating >= star ? 'fill-yellow-400' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Review</label>
                <textarea 
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="How was your consultation experience?"
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs focus:border-yellow-500 focus:outline-none min-h-[100px] resize-none text-white transition-all"
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button onClick={() => setFeedbackModal(null)} className="px-4 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={submitFeedback} disabled={!feedbackText || loading} className="px-4 py-2.5 bg-yellow-500 text-black rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all disabled:opacity-50">
                   {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
