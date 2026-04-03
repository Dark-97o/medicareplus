import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { Mail, Calendar, Clock, FlaskConical, Lock, Activity, LogOut, Plus, Trash2, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { sendPatientCancellationNotice } from '../lib/emailService';

export default function LabDashboard() {
  const { t } = useTranslation();
  const { user, userProfile, signOut, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    hospitalName: '',
    specialization: '',
    imageUrl: '',
    licenseUrl: ''
  });

  const [tab, setTab] = useState<'bookings' | 'tests' | 'security'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    charges: 0,
    imageUrl: '',
    category: 'General'
  });
  const [newPassword, setNewPassword] = useState('');

  const fetchData = async () => {
    if (!user || userProfile?.role !== 'lab') return;
    setLoading(true);
    try {
      const bQ = query(collection(db, 'lab_bookings'), where('labId', '==', user.uid));
      const bSnap = await getDocs(bQ);
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const tQ = query(collection(db, 'lab_tests'), where('labId', '==', user.uid));
      const tSnap = await getDocs(tQ);
      setTests(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && userProfile?.role === 'lab') {
      fetchData();
    }
  }, [user, userProfile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const q = query(collection(db, 'lab_doctors'), where('email', '==', loginEmail), where('password', '==', loginPassword));
      const snap = await getDocs(q);
      if (snap.empty) {
        throw new Error(t('doctor.auth.invalid_credentials') || "Invalid lab credentials.");
      }
      const labData = snap.docs[0].data() as any;
      if (labData.status !== 'approved') {
        throw new Error(t('doctor.auth.application_pending') || "Registration pending admin approval.");
      }
      login({ ...labData, role: 'lab' } as UserProfile, snap.docs[0].id);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const q = query(collection(db, 'lab_doctors'), where('email', '==', regData.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        throw new Error(t('doctor.auth.email_registered') || "Email already registered.");
      }
      await addDoc(collection(db, 'lab_doctors'), {
        ...regData,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setAuthMode('login'); }, 4500);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'lab_tests'), {
        ...newTest,
        labId: user.uid,
        labName: userProfile?.name || 'Lab Specialist',
        hospitalName: userProfile?.address || 'Associated Hospital',
        status: 'approved', // Auto-approve for verified labs
        createdAt: new Date().toISOString()
      });
      setShowAddTest(false);
      setNewTest({ name: '', charges: 0, imageUrl: '', category: 'General' });
      fetchData();
    } catch (err) {
      alert("Failed to add test");
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm("Are you sure you want to remove this test from your catalog?")) return;
    try {
      await deleteDoc(doc(db, 'lab_tests', id));
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdateBooking = async (book: any, status: string) => {
    if (status === 'cancelled' && !confirm("Are you sure you want to cancel this booking? A 100% refund will be initiated.")) return;
    try {
      await updateDoc(doc(db, 'lab_bookings', book.id), { status });
      
      if (status === 'cancelled') {
        try {
          await sendPatientCancellationNotice({
            to_email: book.patientEmail || 'patient@example.com',
            to_name: book.patientName || 'Patient',
            service_type: 'Lab Test',
            provider_name: userProfile?.name || 'Lab Provider',
            date: book.date,
            refund_amount: '100%',
          });
        } catch (e) {
          console.error(e);
        }
      }
      
      fetchData();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  /* ─── AUTH SCREEN ─── */
  if (authLoading) return <div className="min-h-screen bg-[#050B14] text-(--color-accent-purple) flex items-center justify-center font-mono tracking-widest text-xs uppercase animate-pulse">Initializing Lab Portal...</div>;

  if (success) return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-4 pt-16 relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-transparent to-[#050B14] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel w-full max-w-md p-10 rounded-2xl border border-white/5 shadow-2xl relative z-10">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Activity size={40} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-serif font-black text-white mb-4 text-center">{t('lab.auth.application_submitted') || 'Protocol Initiated'}</h2>
        <p className="text-gray-400 leading-relaxed mb-6 text-center">{t('lab.auth.application_review_message') || 'Your laboratory credential application is under central review. Access will be granted once verification is complete.'}</p>
        <div className="w-full h-1 bg-white/10 rounded overflow-hidden mb-8">
          <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4.5 }} />
        </div>
        <button onClick={handleSignOut} className="w-full py-4 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-[0.2em] text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3">
          <LogOut size={16} /> {t('common.reset') || 'TERMINATE SESSION'}
        </button>
      </motion.div>
    </div>
  );

  if (!user || userProfile?.role !== 'lab') {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-4 pt-16 relative overflow-hidden">
        {/* Spline 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
              <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
            </Suspense>
          </ErrorBoundary>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#050B14]/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-center pt-4 pb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl">

            {/* Header badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-(--color-accent-purple)/30 bg-(--color-accent-purple)/10 backdrop-blur-md">
                <FlaskConical size={16} className="text-(--color-accent-purple)" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-(--color-accent-purple)">Lab Management Gateway</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-(--color-accent-purple)/20 shadow-[0_0_60px_rgba(168,85,247,0.1)] overflow-hidden backdrop-blur-xl">
              {/* Tab switcher */}
              <div className="flex border-b border-white/10">
                <button onClick={() => setAuthMode('login')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${authMode === 'login' ? 'bg-(--color-accent-purple)/15 text-(--color-accent-purple) border-b-2 border-(--color-accent-purple)' : 'text-gray-500 hover:text-gray-300'}`}>
                  Access Portal
                </button>
                <button onClick={() => setAuthMode('register')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${authMode === 'register' ? 'bg-(--color-accent-purple)/15 text-(--color-accent-purple) border-b-2 border-(--color-accent-purple)' : 'text-gray-500 hover:text-gray-300'}`}>
                  Provider Enrollment
                </button>
              </div>

              {error && (
                <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {authMode === 'login' ? (
                  <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }} className="p-8 md:p-10">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/30 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <Lock size={28} className="text-(--color-accent-purple)" />
                        <div className="absolute inset-0 border border-(--color-accent-purple)/20 rounded-full animate-ping" />
                      </div>
                      <h2 className="text-2xl font-serif font-black text-white mb-1">Diagnostic Terminal</h2>
                      <p className="text-gray-400 text-xs tracking-widest uppercase">Secure authentication required</p>
                    </div>
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Registered Email</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 pl-12 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-all"
                            placeholder="admin@lab-jaipur.com" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Security Hash</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 pl-12 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-all"
                            placeholder="••••••••" />
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full mt-2 py-4 bg-gradient-to-r from-(--color-accent-purple) to-(--color-accent-blue) text-white rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Sync Credentials <ArrowRight size={16}/></>}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }} className="p-8 md:p-10">
                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Laboratory Name</label>
                          <input required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none" placeholder="City Diagnostics" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 uppercase block mb-1.5">Contact Phone</label>
                          <input required value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none" placeholder="+91..." />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase block mb-1.5">Official Email</label>
                        <input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none" placeholder="jaipur@lab.com" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase block mb-1.5">Security Password</label>
                        <input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase block mb-1.5">Hospital Affiliation</label>
                        <input required value={regData.hospitalName} onChange={e => setRegData({...regData, hospitalName: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none" placeholder="Pink City Medical Center" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase block mb-1.5">Physical Address</label>
                        <textarea required value={regData.address} onChange={e => setRegData({...regData, address: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none min-h-[80px]" placeholder="Full address in Jaipur..." />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase block mb-1.5">Certification / License Link</label>
                        <input required value={regData.licenseUrl} onChange={e => setRegData({...regData, licenseUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none" placeholder="ISO / NABL Certificate URL" />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full mt-4 py-4 bg-gradient-to-r from-(--color-accent-purple) to-(--color-accent-blue) text-white rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Enroll Laboratory'}
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

  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/20" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/20" />}>
            <Spline scene="https://prod.spline.design/vwfRpoawpJ6f8SRL/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="relative z-10 pt-12">
        <div className="sticky top-16 z-30 bg-[#050B14]/90 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/30 flex items-center justify-center text-(--color-accent-purple)">
              <FlaskConical size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-black">{t('lab.portal')}</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Specialist: {userProfile?.name}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="px-5 py-3 rounded-full border border-white/5 hover:bg-white/5 transition-colors cursor-pointer text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-gray-400">
            <LogOut size={14} /> {t('doctor.sign_out')}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-nowrap border-b border-white/5 mb-10 overflow-x-auto scrollbar-hide">
            <button onClick={() => setTab('bookings')} className={`pb-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap shrink-0 ${tab === 'bookings' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-white'}`}>
              Patient Bookings
              {tab === 'bookings' && <motion.div layoutId="lab-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
            </button>
            <button onClick={() => setTab('tests')} className={`pb-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap shrink-0 ${tab === 'tests' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-white'}`}>
              Test Management
              {tab === 'tests' && <motion.div layoutId="lab-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
            </button>
            <button onClick={() => setTab('security')} className={`pb-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap shrink-0 ${tab === 'security' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-white'}`}>
              Security & Access
              {tab === 'security' && <motion.div layoutId="lab-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-3"><Clock className="text-(--color-accent-purple)" /> Active Test Pipeline</h2>
                {bookings.length === 0 ? (
                  <div className="p-12 border border-white/5 rounded-2xl text-center bg-white/5 glass-panel">
                    <p className="text-gray-500 font-mono text-sm">No bookings in the pipeline.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.map(book => (
                      <div key={book.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-(--color-accent-purple)/30 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-tight">{book.patientName}</h3>
                              <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">{book.patientEmail}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${book.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                              {book.status}
                            </span>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                            <p className="text-[10px] text-gray-500 uppercase font-mono mb-2">Selected Test</p>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-white font-bold">{book.testName}</span>
                              <span className="text-(--color-accent-purple) font-mono">₹{book.charges}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Calendar size={12} /> {book.date}</span>
                            <span className="flex items-center gap-1.5"><Activity size={12} /> Paid Success</span>
                          </div>
                        </div>
                        {book.status !== 'completed' && (
                          <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                             <button onClick={() => handleUpdateBooking(book, 'completed')} className="flex-1 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all">
                                Finalize Test
                             </button>
                             <button onClick={() => handleUpdateBooking(book, 'cancelled')} className="px-4 py-3 bg-red-500/5 text-red-500/60 hover:text-red-400 transition-colors uppercase font-bold text-[8px] tracking-widest">
                                Cancel
                             </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'tests' && (
              <motion.div key="tests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-serif font-bold flex items-center gap-3"><FlaskConical className="text-(--color-accent-purple)" /> Registered Inventory</h2>
                  <button onClick={() => setShowAddTest(true)} className="px-6 py-3 bg-(--color-accent-purple) text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2">
                    <Plus size={14} /> Add New Test
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map(test => (
                    <div key={test.id} className="glass-panel p-6 rounded-2xl border border-white/5 group hover:border-(--color-accent-purple)/40 transition-all overflow-hidden relative">
                      <div className="w-full h-32 rounded-xl bg-white/5 border border-white/5 mb-4 overflow-hidden">
                        {test.imageUrl ? (
                          <img src={test.imageUrl} alt="" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-800"><FlaskConical size={32} /></div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold font-serif mb-1">{test.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-4">{test.category}</p>
                      <div className="flex justify-between items-center border-t border-white/5 pt-4">
                        <span className="text-(--color-accent-purple) font-bold font-mono">₹{test.charges}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleDeleteTest(test.id)} className="p-2 text-gray-600 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tests.length === 0 && (
                    <div className="col-span-full p-20 border border-dashed border-white/10 rounded-2xl text-center">
                       <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">Your test catalog is empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="max-w-xl mx-auto py-10">
                  <div className="glass-panel p-10 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center text-(--color-accent-purple) mb-6">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-serif font-black mb-2 uppercase tracking-tighter">Access Credentials</h3>
                    <p className="text-gray-500 text-xs mb-8">Update your laboratory security keys regularly to maintain data integrity.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">New Security Key</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-all" placeholder="Enter new password" />
                      </div>
                      <button className="w-full py-4 bg-(--color-accent-purple)/20 text-(--color-accent-purple) border border-(--color-accent-purple)/30 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-(--color-accent-purple) hover:text-white transition-all">
                        Update Authentication
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Test Modal */}
      <AnimatePresence>
        {showAddTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddTest(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
              <h2 className="text-2xl font-serif font-black mb-1 uppercase tracking-tighter">New Test Protocol</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-8">Register a test to your inventory</p>
              
              <form onSubmit={handleAddTest} className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-2 font-bold tracking-widest">Test Name / Identifier</label>
                  <input required value={newTest.name} onChange={e => setNewTest({...newTest, name: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="Full Body Blood Panel" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase block mb-2 font-bold tracking-widest">Category</label>
                    <input required value={newTest.category} onChange={e => setNewTest({...newTest, category: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="Pathology" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase block mb-2 font-bold tracking-widest">Charges (₹)</label>
                    <input type="number" required value={newTest.charges} onChange={e => setNewTest({...newTest, charges: parseInt(e.target.value)})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="1200" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase block mb-2 font-bold tracking-widest flex items-center gap-2"><ImageIcon size={12}/> Representative Image URL</label>
                  <input value={newTest.imageUrl} onChange={e => setNewTest({...newTest, imageUrl: e.target.value})} className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="https://..." />
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowAddTest(false)} className="flex-1 py-4 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors">Abort</button>
                  <button type="submit" className="flex-1 py-4 bg-(--color-accent-purple) text-white rounded-xl text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:bg-white hover:text-black transition-all">Establish Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
