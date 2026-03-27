import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, MapPin, Calendar, Droplet, UserCheck } from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import Spline from '@splinetool/react-spline';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  
  // Custom timeout wrapper to prevent infinite buffering if Firestore isn't initialized
  const withTimeout = <T,>(promise: Promise<T>, ms = 10000): Promise<T> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Firebase timeout. Please ensure Firestore Database is created in your Firebase Console.")), ms);
      promise.then(value => { clearTimeout(timer); resolve(value); }).catch(reason => { clearTimeout(timer); reject(reason); });
    });
  };

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone: '', age: '', address: '', gender: 'Male', bloodGroup: 'O+'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const q = query(
          collection(db, 'users'), 
          where('email', '==', formData.email), 
          where('password', '==', formData.password)
        );
        const snap = await withTimeout(getDocs(q));
        if (snap.empty) {
          throw new Error("Invalid email or password");
        }
        
        const userDoc = snap.docs[0];
        const profile = userDoc.data() as UserProfile;
        login(profile, userDoc.id);
        navigate('/patient-dashboard');
      } else {
        const q = query(collection(db, 'users'), where('email', '==', formData.email));
        const snap = await withTimeout(getDocs(q));
        if (!snap.empty) {
          throw new Error("Email already registered");
        }
        
        const newDocRef = doc(collection(db, 'users'));
        const profileData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          address: formData.address,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          role: 'patient',
          createdAt: new Date().toISOString()
        };
        await withTimeout(setDoc(newDocRef, profileData));
        login(profileData as UserProfile, newDocRef.id);
        navigate('/patient-dashboard');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-(--color-primary-base) border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel flex flex-col md:flex-row h-[600px]"
        >
          {/* 3D Visual Column */}
          <div className="hidden md:block w-1/2 relative bg-black/40 border-r border-white/5 overflow-hidden">
            <div className="absolute inset-0 opacity-80">
              <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
                <Suspense fallback={<div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
                  <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
                </Suspense>
              </ErrorBoundary>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-(--color-primary-base) via-transparent to-transparent" />
            <div className="relative z-10 p-8 flex flex-col justify-end h-full">
              <h3 className="text-xl font-serif font-bold text-white mb-2">Secure Access</h3>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase leading-relaxed">
                MedicarePlus Biometric Encryption Enabled.<br/>
                Global Medical Registry v2.0
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-2xl font-serif font-black text-white">
                {isLogin ? 'Patient Access' : 'Create Profile'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative mt-1">
                      <User size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <input name="name" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)" placeholder="Rahul Sharma" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Phone</label>
                    <div className="relative mt-1">
                      <Phone size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <input name="phone" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)" placeholder="+91 9xxxx" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Age</label>
                    <div className="relative mt-1">
                      <Calendar size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <input name="age" type="number" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)" placeholder="32" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Gender</label>
                    <div className="relative mt-1">
                      <UserCheck size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <select name="gender" onChange={handleChange} value={formData.gender} className="w-full bg-[#0a0f1a] border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) appearance-none">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Blood Group</label>
                    <div className="relative mt-1">
                      <Droplet size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <select name="bloodGroup" onChange={handleChange} value={formData.bloodGroup} className="w-full bg-[#0a0f1a] border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) appearance-none">
                        <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                        <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Address</label>
                    <div className="relative mt-1">
                      <MapPin size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                      <input name="address" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)" placeholder="Malviya Nagar" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Email</label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                <input name="email" type="email" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)" placeholder="patient@example.com" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -mt-2 text-gray-500" />
                <input name="password" type="password" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded my-1 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-(--color-accent-blue)" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) rounded text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center cursor-pointer">
              {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
            
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-xs text-gray-400 hover:text-white mt-2 pb-2 cursor-pointer">
              {isLogin ? "Need an account? New Patient Registration →" : "Already registered? Patient Sign In →"}
            </button>
          </form>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
