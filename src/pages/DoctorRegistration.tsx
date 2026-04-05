import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Activity, Stethoscope, Mail, Lock, Building, Award } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';

export default function DoctorRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', degree: '', institution: '', 
    experience: '', hospital: '', speciality: 'Primary Care',
    imageUrl: '', proofUrl: '', fees: 500
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Strict Email check (Native Firestore Auth logic)
      const q = query(collection(db, 'doctors'), where('email', '==', formData.email));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error("Email already registered in Doctor Registry.");

      await addDoc(collection(db, 'doctors'), {
        ...formData,
        status: 'pending',
        appointments: [],
        availability: {
          "Monday": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
          "Tuesday": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
          "Wednesday": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
          "Thursday": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
          "Friday": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
          "Saturday": [],
          "Sunday": []
        },
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try connecting again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const specialities = [
    "Primary Care", "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Oncology", "Psychiatry"
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-(--color-primary-base) flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-10 rounded-2xl border border-green-500/20 text-center max-w-lg">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-serif font-black text-white mb-4">Application Submitted</h2>
          <p className="text-gray-400 leading-relaxed mb-6">Your registration has been submitted to the Admin Portal for verification. You will be able to log in once approved.</p>
          <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
            <motion.div className="h-full bg-green-400" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4 }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-primary-base) pt-12 pb-24 px-4 md:px-8 text-white flex justify-center relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none scale-110">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-(--color-primary-base) via-transparent to-(--color-primary-base) pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-black mb-2 flex justify-center items-center gap-3"><Stethoscope className="text-(--color-accent-blue)"/> Doctor <span className="text-gradient">Partnership</span></h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase mt-2">Join the MedicarePlus Network</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Credentials Section */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-bold text-(--color-accent-blue) uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Login Credentials</h3>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                  <input name="email" type="email" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 pl-10 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="dr.smith@hospital.com" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                  <input name="password" type="password" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 pl-10 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="••••••••" />
                </div>
              </div>

              {/* Personal Section */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-sm font-bold text-(--color-accent-blue) uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Professional Profile</h3>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Full Name</label>
                <input name="name" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="Dr. Rahul Sharma" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Age</label>
                  <input type="number" name="age" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="42" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Experience (Yrs)</label>
                  <input type="number" name="experience" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="12" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Specialization</label>
                <select name="speciality" onChange={handleChange} value={formData.speciality} className="w-full bg-[#0a0f1a] border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors appearance-none">
                  {specialities.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Consultation Fee (₹)</label>
                <input type="number" name="fees" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-2"><Award size={14}/> Degree & Highest Qualification</label>
                <input name="degree" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="MBBS, MD" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-2"><Building size={14}/> Institution</label>
                <input name="institution" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="AIIMS Delhi" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Current Hospital / Clinic Attachment</label>
                <input name="hospital" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="Jaipur Golden Hospital" />
              </div>

              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-sm font-bold text-(--color-accent-blue) uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Verification Assets (URLs)</h3>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Profile Image URL</label>
                <input name="imageUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Proof of Degree Document URL</label>
                <input name="proofUrl" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-colors" placeholder="https://..." />
              </div>

            </div>

            <div className="border-t border-white/5 mt-4 pt-6 flex justify-between items-center">
              <button type="button" onClick={() => navigate('/')} className="text-xs text-gray-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="py-4 px-10 bg-(--color-accent-blue) text-black rounded font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Submit Application'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
