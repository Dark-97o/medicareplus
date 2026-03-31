import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth, type UserProfile } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Mail, Calendar, CheckCircle, XCircle, Clock, Stethoscope, Lock, FileText, Activity, Phone, Award, Building, User, ChevronRight, Video, LogOut } from 'lucide-react';
import emailjs from '@emailjs/browser';

const SPECIALITIES = ["General Physician", "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Oncology", "Psychiatry", "Urology", "Radiology", "Endocrinology"];

export default function DoctorDashboard() {

  const { t } = useTranslation();
  const { user, userProfile, login, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', age: '', degree: '', institution: '',
    experience: '', hospital: '', speciality: 'General Physician', imageUrl: '', proofUrl: '', fees: 500
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [emailModal, setEmailModal] = useState<any>(null);
  const [customEmailBody, setCustomEmailBody] = useState('');
  const [tab, setTab] = useState<'appointments' | 'availability' | 'security'>('appointments'); // Changed from activeTab to tab
  const [availability, setAvailability] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');
  const [savingAvailability, setSavingAvailability] = useState(false);

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'doctors'), where('email', '==', email), where('password', '==', password));
      const snap = await getDocs(q);
      if (snap.empty) throw new Error(t('doctor.auth.invalid_credentials'));
      const docData = snap.docs[0];
      const data = docData.data();
      if (data.status === 'pending') throw new Error(t('doctor.auth.application_pending'));
      const profile: UserProfile = {
        name: data.name, email: data.email, phone: data.phone || 'N/A',
        age: data.age, address: data.hospital, gender: 'N/A', bloodGroup: 'N/A', role: 'doctor'
      };
      login(profile, docData.id);
    } catch (err: any) {
      setError(err.message || t('doctor.auth.failed_authenticate'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'doctors'), where('email', '==', formData.email));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error(t('doctor.auth.email_registered'));
      await addDoc(collection(db, 'doctors'), { ...formData, status: 'pending', appointments: [], createdAt: new Date().toISOString() });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setIsLogin(true); }, 4500);
    } catch (err: any) {
      setError(err.message || t('doctor.auth.registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const loadAppointments = async () => {
    if (!user || userProfile?.role !== 'doctor') return;
    setFetching(true);
    try {
      const q = query(collection(db, 'appointments'), where('doctorId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort client-side to bypass index requirement
      const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAppointments(sorted);
      
      // Also fetch doctor availability
      const dDoc = await getDocs(query(collection(db, 'doctors'), where('email', '==', userProfile.email)));
      if (!dDoc.empty) {
        setAvailability(dDoc.docs[0].data().availability || {});
      }
    } catch (err: any) { 
      console.error('[Dashboard] Fetch Error:', err); 
      alert(`${t('doctor.appointments.fetch_error')}: ${err.message || t('doctor.appointments.check_firestore')}`);
    }
    finally { setFetching(false); }
  };

  useEffect(() => { loadAppointments(); }, [user, userProfile]);

  const handleConclude = async (id: string) => { // Renamed from markDone
    if (!confirm(t('doctor.appointments.confirm_conclude'))) return;
    await updateDoc(doc(db, 'appointments', id), { status: 'concluded' });
    loadAppointments();
  };

  const handleCancel = async (id: string) => { // Renamed from cancelAppointment
    if (!confirm(t('doctor.appointments.confirm_cancel'))) return;
    await updateDoc(doc(db, 'appointments', id), { status: 'cancelled_by_doctor' });
    loadAppointments();
  };

  const sendEmail = async () => {
    if (!emailModal || !customEmailBody) return;
    setLoading(true);
    try {
      await emailjs.send('default_service', 'template_smasli7', {
        to_name: emailModal.patientName, to_email: emailModal.patientEmail,
        doctor_name: userProfile?.name, date: emailModal.date, time: emailModal.time,
        specialization: t('doctor.email.pre_consultation_instructions'), message: customEmailBody
      }, 'nEbb9aPtYh8imCD0M');
      alert(t('doctor.email.sent_success', { email: emailModal.patientEmail }));
      setEmailModal(null); setCustomEmailBody('');
    } catch (e) { alert(t('doctor.email.dispatch_error')); }
    finally { setLoading(false); }
  };

  const toggleSlot = (day: string, time: string) => {
    const currentSlots = availability[day] || [];
    const newSlots = currentSlots.includes(time) 
      ? currentSlots.filter((t: string) => t !== time)
      : [...currentSlots, time].sort();
    setAvailability({ ...availability, [day]: newSlots });
  };

  const saveAvailability = async () => {
    if (!user) return;
    setSavingAvailability(true);
    try {
      await updateDoc(doc(db, 'doctors', user.uid), { availability });
      alert(t('doctor.availability.update_success'));
    } catch (e) { alert(t('doctor.availability.save_error')); }
    finally { setSavingAvailability(false); }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert(t('doctor.security.password_length_error'));
    setLoading(true);
    try {
      if (user) {
        await updateDoc(doc(db, 'doctors', user.uid), { password: newPassword });
        alert(t('doctor.security.password_update_success'));
        setNewPassword('');
      }
    } catch (e) { alert(t('doctor.security.password_change_error')); }
    finally { setLoading(false); }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  /* ─── AUTH SCREEN ─── */
  if (authLoading) return <div className="min-h-screen bg-[#050B14] text-(--color-accent-blue) flex items-center justify-center font-mono tracking-widest text-xs uppercase animate-pulse">Initializing Secure Portal...</div>;

  if (!user || userProfile?.role !== 'doctor') {
    if (success) return (
      <div className="min-h-screen bg-(--color-primary-base) flex items-center justify-center p-4 pt-16 relative overflow-hidden">
        {/* DNA Spline for Professional Login */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
              <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-primary-base) via-transparent to-(--color-primary-base) pointer-events-none" />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel w-full max-w-md p-10 rounded-2xl border border-white/5 shadow-2xl relative z-10">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-serif font-black text-white mb-4">{t('doctor.auth.application_submitted')}</h2>
          <p className="text-gray-400 leading-relaxed mb-6">{t('doctor.auth.application_review_message')}</p>
          <div className="w-full h-1 bg-white/10 rounded overflow-hidden mb-8">
            <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4.5 }} />
          </div>
          <button onClick={handleSignOut} className="w-full py-4 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-[0.2em] text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3">
            <LogOut size={16} /> {t('doctor.auth.sign_out_reset')}
          </button>
        </motion.div>
      </div>
    );

    return (
      <div className="min-h-screen bg-(--color-primary-base) flex items-center justify-center p-4 pt-16 relative overflow-hidden">
        {/* Spline 3D DNA Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
              <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
            </Suspense>
          </ErrorBoundary>
          <div className="absolute inset-0 bg-gradient-to-r from-(--color-primary-base) via-(--color-primary-base)/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary-base) via-transparent to-(--color-primary-base)/40" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-center pt-4 pb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl">

            {/* Header badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-(--color-accent-blue)/30 bg-(--color-accent-blue)/10 backdrop-blur-md">
                <Stethoscope size={16} className="text-(--color-accent-blue)" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-(--color-accent-blue)">{t('doctor.auth.access_gateway')}</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-(--color-accent-blue)/20 shadow-[0_0_60px_rgba(0,229,255,0.1)] overflow-hidden backdrop-blur-xl">
              {/* Tab switcher */}
              <div className="flex border-b border-white/10">
                <button onClick={() => { setIsLogin(true); setError(''); }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-(--color-accent-blue)/15 text-(--color-accent-blue) border-b-2 border-(--color-accent-blue)' : 'text-gray-500 hover:text-gray-300'}`}>
                  {t('doctor.auth.sign_in')}
                </button>
                <button onClick={() => { setIsLogin(false); setError(''); }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-(--color-accent-blue)/15 text-(--color-accent-blue) border-b-2 border-(--color-accent-blue)' : 'text-gray-500 hover:text-gray-300'}`}>
                  {t('doctor.auth.apply_register')}
                </button>
              </div>

              {error && (
                <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }} className="p-8 md:p-10">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/30 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <Lock size={28} className="text-(--color-accent-blue)" />
                        <div className="absolute inset-0 border border-(--color-accent-blue)/20 rounded-full animate-ping" />
                      </div>
                      <h2 className="text-2xl font-serif font-black text-white mb-1">{t('doctor.auth.portal_title')}</h2>
                      <p className="text-gray-400 text-xs tracking-widest uppercase">{t('doctor.auth.secure_access')}</p>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">{t('doctor.auth.registered_email')}</label>
                        <input type="email" required onChange={e => setEmail(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all"
                          placeholder="doctor@hospital.com" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">{t('doctor.auth.secure_password')}</label>
                        <input type="password" required onChange={e => setPassword(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all"
                          placeholder="••••••••" />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full mt-2 py-4 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-black rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <>{t('doctor.auth.access_records')}<ChevronRight size={16}/></>}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }} className="p-8 md:p-10">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-serif font-black text-white mb-1">{t('doctor.auth.partnership_title')} <span className="text-(--color-accent-blue)">{t('doctor.auth.partnership_highlight')}</span></h2>
                      <p className="text-gray-400 text-xs tracking-widest uppercase">{t('doctor.auth.join_network')}</p>
                    </div>
                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                      {/* Section: Credentials */}
                      <div className="flex items-center gap-3 mb-1">
                        <Lock size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">{t('doctor.auth.login_credentials')}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.email_address')}</label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="email" type="email" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="dr.smith@hospital.com" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.password')}</label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="password" type="password" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="••••••••" />
                          </div>
                        </div>
                      </div>

                      {/* Section: Professional */}
                      <div className="flex items-center gap-3 mt-3 mb-1">
                        <User size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">{t('doctor.auth.professional_profile')}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.full_name')}</label>
                          <div className="relative">
                            <User size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="name" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="Dr. Rahul Sharma" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.phone_number')}</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="phone" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="+91 9876543210" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.age')}</label>
                          <input type="number" name="age" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="42" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.experience')}</label>
                          <input type="number" name="experience" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="12" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.specialization')}</label>
                          <select name="speciality" onChange={handleChange} value={formData.speciality} className="w-full bg-[#0a0f1a] border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none appearance-none">
                            {SPECIALITIES.map(s => <option key={s} value={s}>{t(`specialities.${s.toLowerCase().replace(/\s/g, '_')}`)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.consultation_fee')}</label>
                          <input type="number" name="fees" onChange={handleChange} required defaultValue={500} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" />
                        </div>
                      </div>

                      {/* Section: Credentials/Institution */}
                      <div className="flex items-center gap-3 mt-3 mb-1">
                        <Award size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">{t('doctor.auth.qualification_institution')}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.degree')}</label>
                          <input name="degree" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="MBBS, MD" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.institution')}</label>
                          <div className="relative">
                            <Building size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="institution" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="AIIMS Delhi" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.hospital_clinic')}</label>
                          <input name="hospital" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="Jaipur Golden Hospital" />
                        </div>
                      </div>

                      {/* Section: Verification */}
                      <div className="flex items-center gap-3 mt-3 mb-1">
                        <FileText size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">{t('doctor.auth.verification_assets')}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.profile_image_url')}</label>
                          <input name="imageUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">{t('doctor.auth.proof_of_degree_url')}</label>
                          <input name="proofUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="https://..." />
                        </div>
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full mt-4 py-4 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-black rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : t('doctor.auth.submit_application')}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── DOCTOR DASHBOARD ─── */
  const upcoming = appointments.filter(a => a.status === 'upcoming').length;
  const concluded = appointments.filter(a => a.status === 'concluded').length;
  const pending = appointments.filter(a => a.status === 'upcoming'); // For the new pending section

  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      {/* Abstract Dashboard Spline */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none flex items-center justify-center">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/20" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/20" />}>
            <Spline scene="https://prod.spline.design/vwfRpoawpJ6f8SRL/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050B14] pointer-events-none" />
      
      <div className="relative z-10 pt-12">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 bg-[#050B14]/90 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/30 flex items-center justify-center">
            <Stethoscope size={20} className="text-(--color-accent-blue)" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black mb-1">{t('doctor.portal')}</h1>
            <p className="text-gray-400 font-light flex items-center gap-2">{t('doctor.hello')} {userProfile?.name?.split(' ').pop() || 'Physician'}</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="px-5 py-3 rounded border border-white/10 hover:bg-white/5 transition-colors cursor-pointer text-xs uppercase tracking-widest font-semibold flex items-center gap-2 text-gray-300">
          <LogOut size={16} /> {t('doctor.sign_out')}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setTab('appointments')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${tab === 'appointments' ? 'text-(--color-accent-blue)' : 'text-gray-500 hover:text-white'}`}>
            {t('doctor.tabs.pipeline')}
            {tab === 'appointments' && <motion.div layoutId="doc-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-blue)" />}
          </button>
          <button onClick={() => setTab('availability')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${tab === 'availability' ? 'text-(--color-accent-blue)' : 'text-gray-500 hover:text-white'}`}>
            {t('doctor.tabs.slots')}
            {tab === 'availability' && <motion.div layoutId="doc-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-blue)" />}
          </button>
          <button onClick={() => setTab('security')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${tab === 'security' ? 'text-(--color-accent-blue)' : 'text-gray-500 hover:text-white'}`}>
            {t('doctor.tabs.security')}
            {tab === 'security' && <motion.div layoutId="doc-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-blue)" />}
          </button>
        </div>

        {/* Dynamic Viewport */}
        <AnimatePresence mode="wait">
          {tab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <div className="glass-panel border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{t('doctor.stats.total')}</p>
                  <p className="text-2xl font-serif font-black text-white">{appointments.length}</p>
                </div>
                <div className="glass-panel border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{t('doctor.stats.pending')}</p>
                  <p className="text-2xl font-serif font-black text-(--color-accent-blue)">{upcoming}</p>
                </div>
                <div className="glass-panel border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{t('doctor.stats.treated')}</p>
                  <p className="text-2xl font-serif font-black text-green-400">{concluded}</p>
                </div>
              </div>

              <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2"><Clock size={20} className="text-(--color-accent-blue)"/> {t('doctor.appointments.title')}</h2>
              
              {fetching ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-(--color-accent-blue) border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {pending.length === 0 ? (
                    <div className="p-12 border border-white/5 rounded-2xl text-center bg-white/5 glass-panel">
                      <p className="text-gray-500 font-mono text-sm">{t('doctor.appointments.no_apt')}</p>
                    </div>
                  ) : (
                    pending.map(app => ( // Changed apt to app for consistency with diff
                      <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row gap-6 justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-3">
                            <h3 className="text-xl font-bold font-serif text-white mb-1">{app.patientName}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold ${app.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : app.status === 'concluded' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                {app.status}
                              </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-tighter uppercase border ${app.consultationMode === 'online' ? 'bg-(--color-accent-purple)/10 border-(--color-accent-purple)/30 text-(--color-accent-purple)' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                  {app.consultationMode === 'online' ? t('patient.online') : t('patient.offline')}
                                </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-mono mb-4">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-(--color-accent-blue)" />{app.date}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-(--color-accent-blue)" />{app.time}</span>
                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-(--color-accent-blue)" />{app.patientEmail}</span>
                          </div>
                          <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div className="flex items-start gap-2">
                              <FileText size={15} className="text-(--color-accent-blue) shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{t('doctor.appointments.reported_symptoms')}</p>
                                <p className="text-gray-400 text-sm italic">{app.symptoms}</p>
                                {app.aiAssessment && <p className="mt-2 text-xs text-(--color-accent-blue) border-t border-white/10 pt-2"><span className="font-bold">Groq AI:</span> {app.aiAssessment}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        {app.status === 'upcoming' && (
                          <div className="flex flex-row md:flex-col gap-2 md:w-44 shrink-0">
                            <button 
                                  onClick={() => handleConclude(app.id)}
                                  className="px-4 py-2 border border-green-500/30 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all flex items-center gap-2"
                                >
                                  <CheckCircle size={14} /> {t('doctor.appointments.concluded')}
                                </button>
                            {app.consultationMode === 'online' && app.status === 'upcoming' && (
                              <button 
                                onClick={() => window.open(app.meetingLink, '_blank')}
                                className="px-4 py-2 bg-(--color-accent-purple) text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                              >
                                <Video size={14} /> {t('doctor.appointments.video')}
                              </button>
                            )}
                            <button onClick={() => handleCancel(app.id)} className="flex-1 md:flex-none py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                              <XCircle size={13} /> {t('doctor.appointments.cancel')}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'availability' && (
            <motion.div key="availability" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-serif font-black text-white mb-2">{t('doctor.tabs.slots')}</h2>
                  <p className="text-gray-400 text-xs tracking-widest uppercase">{t('doctor.auth.professional_profile')}</p>
                </div>
                <button onClick={saveAvailability} disabled={savingAvailability}
                  className="px-8 py-3 bg-(--color-accent-blue) text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  {savingAvailability ? t('common.saving') : t('doctor.auth.access_records')}
                </button>
              </div>

              <div className="space-y-6">
                {DAYS.map(day => (
                  <div key={day} className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar size={14} className="text-(--color-accent-blue)" />
                      <span className="text-sm font-bold uppercase tracking-widest text-white">{day}</span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                      {TIMES.map(time => {
                        const active = availability[day]?.includes(time);
                        return (
                          <button key={time} onClick={() => toggleSlot(day, time)}
                            className={`py-2 text-[10px] font-mono rounded-lg border transition-all ${active ? 'bg-(--color-accent-blue)/20 border-(--color-accent-blue) text-white' : 'bg-transparent border-white/5 text-gray-600 hover:border-white/20'}`}>
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-xl mx-auto py-10">
                <div className="glass-panel p-10 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6">
                    <Lock size={28} className="text-red-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-white mb-2">{t('doctor.tabs.security')}</h2>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">{t('doctor.security.desc')}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">{t('doctor.security.new_password')}</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 focus:outline-none transition-all"
                        placeholder="Min 6 characters" />
                    </div>
                    <button onClick={changePassword} disabled={loading || !newPassword}
                      className="w-full py-4 bg-red-500/20 text-red-100 border border-red-500/30 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all mt-4">
                      {loading ? 'Securing...' : t('doctor.security.update_cta')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {emailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !loading && setEmailModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel border border-(--color-accent-blue)/30 rounded-2xl p-6 shadow-2xl z-10">
              <h3 className="text-xl font-serif font-bold mb-1 flex items-center gap-2"><Mail className="text-(--color-accent-blue)" /> Email Pre-Requisites</h3>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-6 border-b border-white/10 pb-4">To: {emailModal.patientName} ({emailModal.patientEmail})</p>
              <textarea value={customEmailBody} onChange={e => setCustomEmailBody(e.target.value)}
                placeholder="Type pre-consultation instructions (e.g., 'Please carry fasting blood sugar reports.')"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 min-h-[140px] text-sm focus:border-(--color-accent-blue) focus:outline-none mb-6 resize-none" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setEmailModal(null)} disabled={loading} className="px-5 py-3 border border-white/10 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={sendEmail} disabled={loading || !customEmailBody} className="px-5 py-3 bg-(--color-accent-blue) text-black rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2">
                  {loading ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Send'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
