import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Building, FlaskConical, ArrowLeft } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../contexts/AuthContext';

export default function LabRegistration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '', // Specialist name
    labName: '',
    email: '',
    password: '',
    hospital: '',
    imageUrl: '',
    specialization: 'Pathology & Diagnostics'
  });

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Lab Login logic
        const q = query(
          collection(db, 'lab_doctors'),
          where('email', '==', formData.email),
          where('password', '==', formData.password)
        );
        const snap = await getDocs(q);
        
        if (snap.empty) {
          throw new Error("Invalid Lab credentials or account does not exist.");
        }
        
        const labData = snap.docs[0].data();
        const labId = snap.docs[0].id;
        
        if (labData.status === 'pending') {
          throw new Error("Your Laboratory registration is still pending Admin approval.");
        }

        // Use the auth context to sign in
        login({ ...labData, role: 'lab' } as UserProfile, labId);
        navigate('/lab');
      } else {
        // Lab Registration logic
        const q = query(collection(db, 'lab_doctors'), where('email', '==', formData.email));
        const snap = await getDocs(q);
        if (!snap.empty) throw new Error("Email already registered in Lab Registry.");

        await addDoc(collection(db, 'lab_doctors'), {
          ...formData,
          role: 'lab',
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-(--color-primary-base) flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-10 rounded-2xl border border-purple-500/20 text-center max-w-lg">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FlaskConical size={40} className="text-purple-400" />
          </div>
          <h2 className="text-3xl font-serif font-black text-white mb-4">Application Submitted</h2>
          <p className="text-gray-400 leading-relaxed mb-6">{t('lab.registration_pending')}</p>
          <button onClick={() => navigate('/')} className="text-purple-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-primary-base) pt-24 pb-24 px-4 md:px-8 text-white flex justify-center relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Spline scene="https://prod.spline.design/vwfRpoawpJ6f8SRL/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">
           <ArrowLeft size={14} /> Back to Hub
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-black mb-2 flex justify-center items-center gap-3">
            <FlaskConical className="text-(--color-accent-purple)"/> {isLogin ? 'Lab Specialist' : 'Lab' } <span className="text-gradient-purple">{isLogin ? 'Access' : 'Registration'}</span>
          </h1>
          <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase mt-2">{t('lab.auth')}</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> {error}
          </div>}
          
          <form onSubmit={handleAuth} className="flex flex-col gap-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-bold">Lab/Center Name</label>
                    <div className="relative">
                      <Building size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <input name="labName" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="Apollo Diagnostics" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-bold">Specialist Name</label>
                    <input name="name" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="Dr. S. K. Gupta" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-bold">Main Hospital / Location</label>
                  <input name="hospital" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="Jaipur Golden, Mansarovar" />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-bold">Profile / Logo URL</label>
                  <input name="imageUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="https://..." />
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-bold">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                <input name="email" type="email" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="lab@medicareplus.com" />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2 font-bold">Security Key</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                <input name="password" type="password" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-colors" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="py-4 bg-(--color-accent-purple) text-white rounded-xl font-bold text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] mt-4">
              {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (isLogin ? 'Establish Uplink' : 'Submit for Verification')}
            </button>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors font-bold">
                {isLogin ? "Need to Register a Laboratory? Click Here" : "Already have Lab Access? Login Here"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
