import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { 
  FlaskConical, Calendar, ArrowRight, ArrowLeft, 
  CheckCircle, ShieldCheck, Activity, Search, Building, CreditCard
} from 'lucide-react';
import { sendPatientBookingConfirmation, sendProviderBookingAlert } from '../lib/emailService';



export default function LabBooking() {
  const { t } = useTranslation();
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [searchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/');
      return;
    }

    const fetchTests = async () => {
      setLoading(true);
      try {
        // Fetch tests from approved labs
        const labQ = query(collection(db, 'lab_doctors'), where('status', '==', 'approved'));
        const labSnap = await getDocs(labQ);
        const approvedLabIds = labSnap.docs.map(doc => doc.id);

        if (approvedLabIds.length > 0) {
          const testQ = query(
            collection(db, 'lab_tests'), 
            where('status', '==', 'approved'),
            where('labId', 'in', approvedLabIds)
          );
          const testSnap = await getDocs(testQ);
          setTests(testSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Fetch tests error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [user, authLoading, navigate]);

  const filteredTests = tests.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayment = async () => {
    if (!selectedTest || !bookingDate) return;
    setLoading(true);

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_5M89DkM13M89Dk', // Default for test
        amount: selectedTest.charges * 100,
        currency: "INR",
        name: "MedicarePlus Labs",
        description: `Booking for ${selectedTest.name}`,
        handler: async (response: any) => {
          await addDoc(collection(db, 'lab_bookings'), {
            patientId: user?.uid,
            patientName: userProfile?.name,
            patientEmail: userProfile?.email,
            labId: selectedTest.labId,
            testId: selectedTest.id,
            testName: selectedTest.name,
            hospitalName: selectedTest.hospitalName,
            date: bookingDate,
            charges: selectedTest.charges,
            paymentId: response.razorpay_payment_id,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          });

          try {
            await sendPatientBookingConfirmation({
              to_email: userProfile?.email || user?.email || '',
              to_name: userProfile?.name || 'Patient',
              service_type: 'Lab Test',
              provider_name: selectedTest.hospitalName,
              date: bookingDate,
              time: 'As per lab schedule',
              transaction_id: response.razorpay_payment_id,
              amount_paid: `₹${selectedTest.charges}`,
            });

            await sendProviderBookingAlert({
              provider_email: selectedTest.email || 'lab@example.com',
              provider_name: selectedTest.hospitalName,
              patient_name: userProfile?.name || 'Patient',
              service_type: `Lab Test (${selectedTest.name})`,
              date: bookingDate,
              time: 'As per lab schedule',
            });
          } catch (e) {
            console.error('Email failed to send', e);
          }

          setStep(4);
        },
        prefill: {
          name: userProfile?.name,
          email: userProfile?.email
        },
        theme: { color: "#A855F7" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-primary-base) text-white pt-44 pb-8 relative overflow-hidden">
      {/* Premium Gradient Visual (Replacing corrupted Spline) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] bg-(--color-accent-purple) rounded-full blur-[200px] opacity-10 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[70%] bg-(--color-accent-blue) rounded-full blur-[200px] opacity-10 animate-pulse" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        


        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-serif font-black mb-2 uppercase tracking-tighter">{t('lab.select_test')}</h1>
                <p className="text-gray-500 font-mono text-[9px] uppercase tracking-[0.2em]">{t('lab.catalog_desc') || 'ADVANCED DIAGNOSTIC CATALOG V2.0'}</p>
              </div>



              {loading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-(--color-accent-purple) border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTests.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-panel rounded-3xl border border-white/5">
                      <Search size={48} className="mx-auto text-gray-700 mb-4 opacity-50" />
                      <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em] mb-6">{t('lab.no_tests_found') || 'No approved tests found in the catalog.'}</p>
                      <button 
                        onClick={async () => {
                          setLoading(true);
                          const { addDoc, collection } = await import('firebase/firestore');
                          const labDoc = await addDoc(collection(db, 'lab_doctors'), {
                            name: "Dr. Alok Verma",
                            labName: "Verma Diagnostics",
                            hospital: "Apollo Jaipur",
                            email: "alok@verma.com",
                            status: "approved",
                            createdAt: new Date().toISOString()
                          });
                          const tests = [
                            { name: "Full Body Checkup", category: "General", charges: 2999, labId: labDoc.id, labName: "Verma Diagnostics", hospitalName: "Apollo Jaipur", status: "approved", imageUrl: "https://images.unsplash.com/photo-1579152276503-60506663f721?w=800" },
                            { name: "Diabetes Panel", category: "Pathology", charges: 850, labId: labDoc.id, labName: "Verma Diagnostics", hospitalName: "Apollo Jaipur", status: "approved", imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800" }
                          ];
                          for (const t of tests) await addDoc(collection(db, 'lab_tests'), t);
                          window.location.reload();
                        }}
                        className="px-6 py-3 bg-(--color-accent-purple)/10 text-(--color-accent-purple) border border-(--color-accent-purple)/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-(--color-accent-purple) hover:text-white transition-all cursor-pointer"
                      >
                        Generate Quick Catalog
                      </button>
                    </div>
                  ) : (
                    filteredTests.map(test => (
                      <motion.div 
                        key={test.id} 
                        onClick={() => setSelectedTest(test)}
                        className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer group ${selectedTest?.id === test.id ? 'border-(--color-accent-purple) bg-(--color-accent-purple)/5 shadow-[0_0_25px_rgba(168,85,247,0.1)] scale-[1.01]' : 'border-white/5 hover:border-white/20'}`}
                      >
                        <div className="w-full h-24 rounded-xl bg-white/5 mb-3 overflow-hidden relative">
                           {test.imageUrl ? (
                             <img src={test.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5"><FlaskConical size={24} className="shrink-0" /></div>
                           )}
                           <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[6px] font-bold uppercase tracking-widest text-white border border-white/10">
                              {test.category}
                           </div>
                        </div>
                        <h3 className="font-serif text-lg font-bold mb-0.5 leading-tight">{test.name}</h3>
                        <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-3 flex items-center gap-1.5"><Building size={10}/> {test.hospitalName}</p>
                        
                        <div className="flex justify-between items-center border-t border-white/5 pt-2.5 mt-auto">
                          <span className="text-(--color-accent-purple) font-black font-mono text-sm">₹{test.charges}</span>
                          {selectedTest?.id === test.id && <CheckCircle size={16} className="text-(--color-accent-purple)" />}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              <div className="mt-12 flex justify-end">
                <button 
                  disabled={!selectedTest}
                  onClick={() => setStep(2)}
                  className="px-10 py-5 bg-(--color-accent-purple) text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-30 disabled:grayscale flex items-center gap-3"
                >
                  Select Date <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
               <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-black mb-4 uppercase tracking-tighter">{t('booking.slots.date')}</h1>
                <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">Choose a date for your visit</p>
              </div>

              <div className="glass-panel p-10 rounded-3xl border border-white/5 mb-8">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center text-(--color-accent-purple)">
                       <FlaskConical size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-serif font-black">{selectedTest.name}</h3>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{selectedTest.hospitalName}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 block">{t('booking.slots.date')}</label>
                       <div className="relative">
                          <Calendar size={18} className="absolute left-4 top-1/2 -mt-2.2 text-(--color-accent-purple)" />
                          <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={bookingDate} 
                            onChange={e => setBookingDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:border-(--color-accent-purple) focus:outline-none transition-all"
                          />
                       </div>
                    </div>
                    
                    <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                       <p className="text-[10px] text-purple-400 font-bold flex items-center gap-2"><ShieldCheck size={14}/> Appointments are subject to lab availability on selected date.</p>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-8 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-2">
                   <ArrowLeft size={16} /> {t('common.back') || 'Back to Catalog'}
                </button>
                <button 
                  disabled={!bookingDate}
                  onClick={() => setStep(3)}
                  className="px-10 py-5 bg-(--color-accent-purple) text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-30 flex items-center gap-3"
                >
                  Verify Protocol <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
               <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-black mb-4 uppercase tracking-tighter">Final Verification</h1>
                <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">Authorized Transaction Protocol</p>
              </div>

              <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden mb-8">
                 <div className="p-8 border-b border-white/5 bg-white/5">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">Patient Profile</p>
                          <h3 className="text-xl font-bold">{userProfile?.name}</h3>
                          <p className="text-xs text-gray-400 font-mono">{userProfile?.email}</p>
                       </div>
                       <Activity className="text-(--color-accent-purple)" />
                    </div>
                 </div>
                 
                 <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                       <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Protocol</p>
                          <span className="text-white font-bold">{selectedTest.name}</span>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Schedule</p>
                          <span className="text-(--color-accent-purple) font-black">{bookingDate}</span>
                       </div>
                    </div>

                    <div className="flex justify-between items-center text-2xl font-serif">
                       <span className="font-light text-gray-500 uppercase tracking-tighter text-sm font-sans">Payment Allocation</span>
                       <span className="font-black">₹{selectedTest.charges}</span>
                    </div>
                 </div>

                 <div className="p-6 bg-purple-500/10 flex items-center gap-4 border-t border-purple-500/20">
                    <ShieldCheck className="text-purple-400 shrink-0" size={20} />
                    <p className="text-[10px] text-purple-200/70 font-mono">Secured via Razorpay Encyption. Non-refundable upon protocol initiation.</p>
                 </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-8 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-2">
                   <ArrowLeft size={16} /> Relocate Slot
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-(--color-accent-purple) hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-3"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><CreditCard size={18} /> Initiate Transaction</>}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto text-center py-20">
               <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                  <CheckCircle size={48} className="text-green-400" />
               </div>
               <h1 className="text-5xl font-serif font-black mb-4 uppercase tracking-tighter">Protocol Established</h1>
               <p className="text-gray-400 leading-relaxed max-w-sm mx-auto mb-12">
                  Your lab test booking has been encrypted and shared with the medical facility. You can track progress in your dashboard.
               </p>
               <button 
                 onClick={() => navigate('/dashboard')}
                 className="px-10 py-5 bg-(--color-accent-purple) text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
               >
                 Access Lab Records
               </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
