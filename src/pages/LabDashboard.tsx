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
import { Mail, Calendar, CheckCircle, Clock, FlaskConical, Lock, FileText, Activity, Building, LogOut, Plus, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';

export default function LabDashboard() {
  const { t } = useTranslation();
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState<'bookings' | 'tests' | 'security'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    charges: 0,
    imageUrl: '',
    category: 'General'
  });
  const [newPassword, setNewPassword] = useState('');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch bookings for this lab
      const bQ = query(collection(db, 'lab_bookings'), where('labId', '==', user.uid));
      const bSnap = await getDocs(bQ);
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch tests registered by this lab
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
    fetchData();
  }, [user]);

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'lab_tests'), {
        ...newTest,
        labId: user.uid,
        labName: userProfile?.name || 'Lab Specialist',
        hospitalName: userProfile?.address || 'Associated Hospital',
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

  const handleUpdateBooking = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'lab_bookings', id), { status });
      fetchData();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
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
          <div className="flex gap-8 border-b border-white/5 mb-10 overflow-x-auto">
            <button onClick={() => setTab('bookings')} className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${tab === 'bookings' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-white'}`}>
              Patient Bookings
              {tab === 'bookings' && <motion.div layoutId="lab-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
            </button>
            <button onClick={() => setTab('tests')} className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${tab === 'tests' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-white'}`}>
              Test Management
              {tab === 'tests' && <motion.div layoutId="lab-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent-purple)" />}
            </button>
            <button onClick={() => setTab('security')} className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${tab === 'security' ? 'text-(--color-accent-purple)' : 'text-gray-500 hover:text-white'}`}>
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
                             <button onClick={() => handleUpdateBooking(book.id, 'completed')} className="flex-1 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all">
                               Finalize Test
                             </button>
                             <button onClick={() => handleUpdateBooking(book.id, 'cancelled')} className="px-4 py-3 bg-red-500/5 text-red-500/60 hover:text-red-400 transition-colors uppercase font-bold text-[8px] tracking-widest">
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
