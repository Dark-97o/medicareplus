import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useAuth, type UserProfile } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, orderBy, addDoc } from 'firebase/firestore';
import { Mail, Calendar, CheckCircle, XCircle, Clock, Stethoscope, Lock, FileText, Activity, Phone, Award, Building, User, ChevronRight, Video } from 'lucide-react';
import emailjs from '@emailjs/browser';

const SPECIALITIES = ["General Physician", "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Oncology", "Psychiatry", "Urology", "Radiology", "Endocrinology"];

export default function DoctorDashboard() {
  const { user, userProfile, login, signOut } = useAuth();
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
  const [activeTab, setActiveTab] = useState<'appointments' | 'availability' | 'security'>('appointments');
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
      if (snap.empty) throw new Error("Invalid doctor credentials.");
      const docData = snap.docs[0];
      const data = docData.data();
      if (data.status === 'pending') throw new Error("Application is still under review by Administration.");
      const profile: UserProfile = {
        name: data.name, email: data.email, phone: data.phone || 'N/A',
        age: data.age, address: data.hospital, gender: 'N/A', bloodGroup: 'N/A', role: 'doctor'
      };
      login(profile, docData.id);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
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
      if (!snap.empty) throw new Error("Email already registered.");
      await addDoc(collection(db, 'doctors'), { ...formData, status: 'pending', appointments: [], createdAt: new Date().toISOString() });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setIsLogin(true); }, 4500);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const loadAppointments = async () => {
    if (!user || userProfile?.role !== 'doctor') return;
    setFetching(true);
    try {
      const q = query(collection(db, 'appointments'), where('doctorId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      // Also fetch doctor availability
      const dDoc = await getDocs(query(collection(db, 'doctors'), where('email', '==', userProfile.email)));
      if (!dDoc.empty) {
        setAvailability(dDoc.docs[0].data().availability || {});
      }
    } catch (err) { console.error(err); }
    finally { setFetching(false); }
  };

  useEffect(() => { loadAppointments(); }, [user, userProfile]);

  const markDone = async (id: string) => {
    if (!confirm("Mark this appointment as Concluded?")) return;
    await updateDoc(doc(db, 'appointments', id), { status: 'concluded' });
    loadAppointments();
  };

  const cancelAppointment = async (id: string) => {
    if (!confirm("Cancel this appointment? The patient will be refunded.")) return;
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
        specialization: "Pre-Consultation Instructions", message: customEmailBody
      }, 'nEbb9aPtYh8imCD0M');
      alert(`Instructions sent to ${emailModal.patientEmail}`);
      setEmailModal(null); setCustomEmailBody('');
    } catch (e) { alert("Error dispatching Email."); }
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
      alert("Weekly availability updated successfully.");
    } catch (e) { alert("Failed to save availability."); }
    finally { setSavingAvailability(false); }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert("Password must be 6+ characters.");
    setLoading(true);
    try {
      if (user) {
        await updateDoc(doc(db, 'doctors', user.uid), { password: newPassword });
        alert("Password updated. Please use new credentials next time.");
        setNewPassword('');
      }
    } catch (e) { alert("Failed to change password."); }
    finally { setLoading(false); }
  };

  /* ─── AUTH SCREEN ─── */
  if (!user || userProfile?.role !== 'doctor') {
    if (success) return (
      <div className="min-h-screen bg-(--color-primary-base) flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 rounded-2xl border border-green-500/20 text-center max-w-lg">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-serif font-black text-white mb-4">Application Submitted!</h2>
          <p className="text-gray-400 leading-relaxed mb-6">Your credentials are under Admin review. You'll be able to log in once approved.</p>
          <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
            <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4.5 }} />
          </div>
        </motion.div>
      </div>
    );

    return (
      <div className="min-h-screen bg-(--color-primary-base) relative overflow-hidden flex items-center justify-center">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
          <div className="absolute inset-0 bg-gradient-to-r from-(--color-primary-base) via-(--color-primary-base)/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary-base) via-transparent to-(--color-primary-base)/40" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-center py-16 px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl">

            {/* Header badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-(--color-accent-blue)/30 bg-(--color-accent-blue)/10 backdrop-blur-md">
                <Stethoscope size={16} className="text-(--color-accent-blue)" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-(--color-accent-blue)">Physician Access Gateway</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-(--color-accent-blue)/20 shadow-[0_0_60px_rgba(0,229,255,0.1)] overflow-hidden backdrop-blur-xl">
              {/* Tab switcher */}
              <div className="flex border-b border-white/10">
                <button onClick={() => { setIsLogin(true); setError(''); }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-(--color-accent-blue)/15 text-(--color-accent-blue) border-b-2 border-(--color-accent-blue)' : 'text-gray-500 hover:text-gray-300'}`}>
                  Sign In
                </button>
                <button onClick={() => { setIsLogin(false); setError(''); }}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-(--color-accent-blue)/15 text-(--color-accent-blue) border-b-2 border-(--color-accent-blue)' : 'text-gray-500 hover:text-gray-300'}`}>
                  Apply / Register
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
                      <h2 className="text-2xl font-serif font-black text-white mb-1">Physician Portal</h2>
                      <p className="text-gray-400 text-xs tracking-widest uppercase">Secure Access Only</p>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Registered Email</label>
                        <input type="email" required onChange={e => setEmail(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all"
                          placeholder="doctor@hospital.com" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Secure Password</label>
                        <input type="password" required onChange={e => setPassword(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all"
                          placeholder="••••••••" />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full mt-2 py-4 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-black rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><span>Access Records</span><ChevronRight size={16}/></>}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }} className="p-8 md:p-10">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-serif font-black text-white mb-1">Doctor <span className="text-(--color-accent-blue)">Partnership</span></h2>
                      <p className="text-gray-400 text-xs tracking-widest uppercase">Join the MedicarePlus Network</p>
                    </div>
                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                      {/* Section: Credentials */}
                      <div className="flex items-center gap-3 mb-1">
                        <Lock size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">Login Credentials</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Email Address</label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="email" type="email" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="dr.smith@hospital.com" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Password</label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="password" type="password" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="••••••••" />
                          </div>
                        </div>
                      </div>

                      {/* Section: Professional */}
                      <div className="flex items-center gap-3 mt-3 mb-1">
                        <User size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">Professional Profile</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Full Name</label>
                          <div className="relative">
                            <User size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="name" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="Dr. Rahul Sharma" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="phone" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="+91 9876543210" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Age</label>
                          <input type="number" name="age" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="42" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Experience (Years)</label>
                          <input type="number" name="experience" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="12" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Specialization</label>
                          <select name="speciality" onChange={handleChange} value={formData.speciality} className="w-full bg-[#0a0f1a] border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none appearance-none">
                            {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Consultation Fee (₹)</label>
                          <input type="number" name="fees" onChange={handleChange} required defaultValue={500} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" />
                        </div>
                      </div>

                      {/* Section: Credentials/Institution */}
                      <div className="flex items-center gap-3 mt-3 mb-1">
                        <Award size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">Qualification & Institution</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Degree(s)</label>
                          <input name="degree" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="MBBS, MD" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Institution</label>
                          <div className="relative">
                            <Building size={14} className="absolute left-3 top-3.5 text-gray-500" />
                            <input name="institution" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="AIIMS Delhi" />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Hospital / Clinic</label>
                          <input name="hospital" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="Jaipur Golden Hospital" />
                        </div>
                      </div>

                      {/* Section: Verification */}
                      <div className="flex items-center gap-3 mt-3 mb-1">
                        <FileText size={13} className="text-(--color-accent-blue)" />
                        <span className="text-xs font-bold text-(--color-accent-blue) uppercase tracking-widest">Verification Assets (URLs)</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Profile Image URL</label>
                          <input name="imageUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Proof of Degree URL</label>
                          <input name="proofUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none" placeholder="https://..." />
                        </div>
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full mt-4 py-4 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-black rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Submit Application'}
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

  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#050B14]/90 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/30 flex items-center justify-center">
            <Stethoscope size={20} className="text-(--color-accent-blue)" />
          </div>
          <div>
            <p className="font-serif font-bold text-white text-lg leading-none">Dr. {userProfile.name?.replace('Dr. ', '')}</p>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">{userProfile.address}</p>
          </div>
        </div>
        <button onClick={signOut} className="px-4 py-2 border border-white/10 rounded-full text-xs uppercase tracking-widest hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          Lock Terminal
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'appointments', label: 'Patient Pipeline', icon: Calendar, count: upcoming },
            { id: 'availability', label: 'Manage Slots', icon: Clock },
            { id: 'security', label: 'Security Portal', icon: Lock }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 whitespace-nowrap shadow-lg ${activeTab === tab.id ? 'bg-(--color-accent-blue)/15 border-(--color-accent-blue) text-white ring-1 ring-(--color-accent-blue)/30' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'}`}>
              <tab.icon size={18} className={activeTab === tab.id ? 'text-(--color-accent-blue)' : ''} />
              <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
              {'count' in tab && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === tab.id ? 'bg-(--color-accent-blue) text-black' : 'bg-white/10 text-gray-500'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Viewport */}
        <AnimatePresence mode="wait">
          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                  { label: 'Total Assigned', value: appointments.length, color: 'from-(--color-accent-blue)/20 to-transparent border-(--color-accent-blue)/20', text: 'text-(--color-accent-blue)' },
                  { label: 'Pending Pipeline', value: upcoming, color: 'from-blue-500/20 to-transparent border-blue-500/20', text: 'text-blue-300' },
                  { label: 'Successfully Treated', value: concluded, color: 'from-green-500/20 to-transparent border-green-500/20', text: 'text-green-400' },
                ].map(m => (
                  <div key={m.label} className={`glass-panel p-6 rounded-2xl border bg-gradient-to-br ${m.color} flex flex-col gap-2`}>
                    <span className={`text-4xl font-serif font-black ${m.text}`}>{m.value}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">{m.label}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-sm font-bold uppercase tracking-widest text-(--color-accent-blue) mb-6 flex items-center gap-2">
                <Calendar size={16} /> Scheduled Patients
              </h2>

              {fetching ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-(--color-accent-blue) border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-16 border border-white/5 rounded-2xl bg-black/20">
                      <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">No appointments scheduled yet.</p>
                    </div>
                  ) : (
                    appointments.map(apt => (
                      <motion.div key={apt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row gap-6 justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-3">
                            <h3 className="text-xl font-bold font-serif text-white mb-1">{apt.patientName}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-full font-bold ${apt.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : apt.status === 'concluded' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                {apt.status}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-tighter uppercase border ${apt.consultationMode === 'online' ? 'bg-(--color-accent-purple)/10 border-(--color-accent-purple)/30 text-(--color-accent-purple)' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                {apt.consultationMode === 'online' ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-mono mb-4">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-(--color-accent-blue)" />{apt.date}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-(--color-accent-blue)" />{apt.time}</span>
                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-(--color-accent-blue)" />{apt.patientEmail}</span>
                          </div>
                          <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div className="flex items-start gap-2">
                              <FileText size={15} className="text-(--color-accent-blue) shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Reported Symptoms</p>
                                <p className="text-gray-400 text-sm italic">{apt.symptoms}</p>
                                {apt.aiAssessment && <p className="mt-2 text-xs text-(--color-accent-blue) border-t border-white/10 pt-2"><span className="font-bold">Groq AI:</span> {apt.aiAssessment}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                        {apt.status === 'upcoming' && (
                          <div className="flex flex-row md:flex-col gap-2 md:w-44 shrink-0">
                            <button onClick={() => markDone(apt.id)} className="flex-1 md:flex-none py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500 hover:text-black transition-all flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                              <CheckCircle size={13} /> Concluded
                            </button>
                            {apt.consultationMode === 'online' && apt.status === 'upcoming' && (
                              <button 
                                onClick={() => window.open(apt.meetingLink, '_blank')}
                                className="flex-1 md:flex-none py-2.5 bg-(--color-accent-purple)/10 text-(--color-accent-purple) border border-(--color-accent-purple)/30 rounded-xl hover:bg-(--color-accent-purple) hover:text-white transition-all flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                              >
                                <Video size={13} /> Join Video Call
                              </button>
                            )}
                            <button onClick={() => setEmailModal(apt)} className="flex-1 md:flex-none py-2.5 bg-(--color-accent-blue)/10 text-(--color-accent-blue) border border-(--color-accent-blue)/30 rounded-xl hover:bg-(--color-accent-blue) hover:text-black transition-all flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                              <Mail size={13} /> Pre-Reqs
                            </button>
                            <button onClick={() => cancelAppointment(apt.id)} className="flex-1 md:flex-none py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                              <XCircle size={13} /> Cancel
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

          {activeTab === 'availability' && (
            <motion.div key="availability" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-serif font-black text-white mb-2">Weekly Availability</h2>
                  <p className="text-gray-400 text-xs tracking-widest uppercase">Select your active consultation slots</p>
                </div>
                <button onClick={saveAvailability} disabled={savingAvailability}
                  className="px-8 py-3 bg-(--color-accent-blue) text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                  {savingAvailability ? 'Saving...' : 'Sync to Cloud'}
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

          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-xl mx-auto py-10">
                <div className="glass-panel p-10 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6">
                    <Lock size={28} className="text-red-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-white mb-2">Portal Access Security</h2>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">Ensure your physician credentials remain confidential. Changing your password will immediately secure your digital clinic.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">New Access Password</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 focus:outline-none transition-all"
                        placeholder="Min 6 characters" />
                    </div>
                    <button onClick={changePassword} disabled={loading || !newPassword}
                      className="w-full py-4 bg-red-500/20 text-red-100 border border-red-500/30 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all mt-4">
                      {loading ? 'Securing...' : 'Verify & Rotate Credentials'}
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
  );
}
