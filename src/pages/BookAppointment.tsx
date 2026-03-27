import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ArrowLeft, Brain, User, CheckCircle, Activity, Zap, CreditCard, Stethoscope, Search, AlertTriangle, Sparkles, Building } from 'lucide-react';
import emailjs from '@emailjs/browser';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Condition {
  name: string;
  likelihood: number;
  brief: string;
  tags: string[];
  urgency: 'low' | 'moderate' | 'high';
}

// ─── Local disease assessment engine (mirrors legacy buildLocalFallback) ────
const DISEASE_MAP: Array<{
  keywords: RegExp;
  conditions: Condition[];
  spec: string;
}> = [
  {
    keywords: /chest pain|heart|palpitation|arrhythmia|cardiac|shortness of breath|angina|breathless/i,
    spec: 'Cardiology',
    conditions: [
      { name: 'Acute Coronary Syndrome', likelihood: 72, brief: 'Chest pain with breathlessness may suggest reduced blood flow to the heart.', tags: ['cardiac', 'chest'], urgency: 'high' },
      { name: 'Angina Pectoris', likelihood: 55, brief: 'Recurrent chest discomfort could indicate stable or unstable angina.', tags: ['cardiac', 'vascular'], urgency: 'moderate' },
      { name: 'Arrhythmia', likelihood: 38, brief: 'Palpitations and irregular heartbeat may indicate a rhythm disorder.', tags: ['cardiac', 'rhythm'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /headache|migraine|seizure|numbness|tremor|stroke|brain|nerve|dizziness|vertigo/i,
    spec: 'Neurology',
    conditions: [
      { name: 'Migraine', likelihood: 70, brief: 'Recurring severe headaches with sensitivity to light may indicate migraine.', tags: ['neurological', 'head'], urgency: 'moderate' },
      { name: 'Tension Headache', likelihood: 55, brief: 'Persistent dull head pain is commonly associated with tension-type headache.', tags: ['neurological', 'stress'], urgency: 'low' },
      { name: 'TIA / Stroke Precursor', likelihood: 30, brief: 'Sudden numbness or dizziness could indicate transient ischemic attack.', tags: ['neurological', 'vascular'], urgency: 'high' },
    ],
  },
  {
    keywords: /bone|joint|fracture|back pain|knee|spine|arthritis|sprain|ligament|muscle ache/i,
    spec: 'Orthopedics',
    conditions: [
      { name: 'Musculoskeletal Injury', likelihood: 68, brief: 'Joint or bone pain may suggest a sprain, strain, or fracture.', tags: ['orthopaedic', 'trauma'], urgency: 'moderate' },
      { name: 'Osteoarthritis', likelihood: 50, brief: 'Chronic joint stiffness and pain could indicate degenerative joint disease.', tags: ['orthopaedic', 'chronic'], urgency: 'low' },
      { name: 'Herniated Disc', likelihood: 35, brief: 'Radiating back or leg pain may suggest a compressed spinal disc.', tags: ['spine', 'neurological'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /skin|rash|acne|eczema|psoriasis|itching|allergy|hives|derma/i,
    spec: 'Dermatology',
    conditions: [
      { name: 'Eczema / Atopic Dermatitis', likelihood: 65, brief: 'Itchy inflamed skin patches are characteristic of eczema.', tags: ['dermal', 'inflammatory'], urgency: 'low' },
      { name: 'Psoriasis', likelihood: 45, brief: 'Scaly, raised skin plaques may indicate an autoimmune skin condition.', tags: ['dermal', 'autoimmune'], urgency: 'low' },
      { name: 'Allergic Reaction', likelihood: 40, brief: 'Hives and skin redness could be triggered by allergen exposure.', tags: ['dermal', 'allergy'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /anxiety|depression|mental|stress|psychiatric|panic|insomnia|mood/i,
    spec: 'Psychiatry',
    conditions: [
      { name: 'Generalized Anxiety Disorder', likelihood: 70, brief: 'Persistent worry, restlessness, and sleep issues may indicate GAD.', tags: ['mental health', 'anxiety'], urgency: 'moderate' },
      { name: 'Major Depressive Disorder', likelihood: 52, brief: 'Persistent low mood and fatigue may suggest clinical depression.', tags: ['mental health', 'mood'], urgency: 'moderate' },
      { name: 'Panic Disorder', likelihood: 38, brief: 'Sudden intense fear episodes with physical symptoms could indicate panic disorder.', tags: ['mental health', 'panic'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /diabetes|thyroid|hormone|endocrine|insulin|blood sugar|obesity|weight gain/i,
    spec: 'Endocrinology',
    conditions: [
      { name: 'Type 2 Diabetes Mellitus', likelihood: 68, brief: 'Excessive thirst, frequent urination, and fatigue may suggest diabetes.', tags: ['endocrine', 'metabolic'], urgency: 'moderate' },
      { name: 'Hypothyroidism', likelihood: 50, brief: 'Fatigue, weight gain, and cold intolerance could indicate low thyroid function.', tags: ['endocrine', 'thyroid'], urgency: 'low' },
      { name: 'Metabolic Syndrome', likelihood: 38, brief: 'Cluster of conditions including high blood sugar and abdominal obesity.', tags: ['endocrine', 'metabolic'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /urine|kidney|bladder|urinary|prostate|uti|blood in urine/i,
    spec: 'Urology',
    conditions: [
      { name: 'Urinary Tract Infection', likelihood: 72, brief: 'Burning urination and frequent urge to urinate suggests a UTI.', tags: ['urological', 'infectious'], urgency: 'moderate' },
      { name: 'Kidney Stones', likelihood: 48, brief: 'Severe flank pain with blood in urine may indicate nephrolithiasis.', tags: ['urological', 'kidney'], urgency: 'high' },
      { name: 'Benign Prostatic Hyperplasia', likelihood: 30, brief: 'Difficulty urinating in older men may suggest prostate enlargement.', tags: ['urological', 'prostate'], urgency: 'low' },
    ],
  },
  {
    keywords: /cough|cold|fever|throat|sore|sneeze|congestion|flu|respiratory|pneumonia/i,
    spec: 'General Physician',
    conditions: [
      { name: 'Upper Respiratory Infection', likelihood: 72, brief: 'Cough, sore throat, and fever commonly indicate a viral URI or flu.', tags: ['respiratory', 'infectious'], urgency: 'low' },
      { name: 'Pneumonia', likelihood: 40, brief: 'Productive cough with high fever and chest tightness may indicate pneumonia.', tags: ['respiratory', 'infectious'], urgency: 'high' },
      { name: 'Bronchitis', likelihood: 35, brief: 'Persistent cough with mucus production could suggest bronchial inflammation.', tags: ['respiratory', 'inflammatory'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /stomach|abdomen|nausea|vomit|diarrhea|bloat|gastric|indigestion|acid/i,
    spec: 'General Physician',
    conditions: [
      { name: 'Gastroenteritis', likelihood: 68, brief: 'Nausea, vomiting, and abdominal cramps are typical of a GI infection.', tags: ['gastric', 'infectious'], urgency: 'moderate' },
      { name: 'GERD / Acid Reflux', likelihood: 50, brief: 'Burning sensation in the chest and regurgitation may indicate acid reflux.', tags: ['gastric', 'chronic'], urgency: 'low' },
      { name: 'Irritable Bowel Syndrome', likelihood: 38, brief: 'Recurring abdominal pain with altered bowel habits may suggest IBS.', tags: ['gastric', 'functional'], urgency: 'low' },
    ],
  },
];

function buildLocalAssessment(text: string): { conditions: Condition[]; spec: string } {
  const matched = DISEASE_MAP.find(entry => entry.keywords.test(text));
  if (matched) return { conditions: matched.conditions, spec: matched.spec };
  return {
    spec: 'General Physician',
    conditions: [
      { name: 'General Medical Review Needed', likelihood: 65, brief: 'Your described symptoms require a comprehensive evaluation by a General Physician.', tags: ['general', 'review'], urgency: 'low' },
      { name: 'Fatigue / Systemic Condition', likelihood: 45, brief: 'Systemic fatigue and malaise may indicate an underlying condition requiring tests.', tags: ['general', 'systemic'], urgency: 'low' },
      { name: 'Viral Illness', likelihood: 35, brief: 'Non-specific symptoms could indicate a self-limiting viral infection.', tags: ['infectious', 'general'], urgency: 'low' },
    ],
  };
}

// ─── Likelihood Bar Component ────────────────────────────────────────────────
function LikelihoodBar({ pct, urgency }: { pct: number; urgency: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }, 120);
    return () => clearTimeout(t);
  }, [pct]);

  const color = urgency === 'high' ? 'bg-red-500' : urgency === 'moderate' ? 'bg-yellow-400' : 'bg-emerald-400';
  return (
    <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div ref={barRef} className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: 0 }} />
    </div>
  );
}

// ─── Disease Assessment Panel Component ─────────────────────────────────────
function DiseaseAssessmentPanel({ conditions, isAI }: { conditions: Condition[]; isAI: boolean }) {
  const urgencyColor = (u: string) =>
    u === 'high' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    u === 'moderate' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl border border-white/8 overflow-hidden bg-black/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white/4 border-b border-white/8">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-gray-400">AI Preliminary Assessment</span>
        <span className="ml-auto font-mono text-[0.55rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/8 text-gray-500">
          {isAI ? 'Groq · Llama 3' : 'Local Engine'}
        </span>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-5 py-2.5 bg-yellow-400/5 border-b border-yellow-400/15">
        <AlertTriangle size={12} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-[0.7rem] text-yellow-600/80 font-light leading-relaxed">
          Not a diagnosis. Possible conditions based on your description — your doctor will confirm.
        </p>
      </div>

      {/* Conditions list */}
      <div className="divide-y divide-white/5">
        {conditions.map((c, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-white/2 transition-colors">
            {/* Rank */}
            <span className="font-serif text-sm text-white/20 w-4 flex-shrink-0 pt-0.5">{i + 1}</span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <span className={`font-mono text-[0.55rem] uppercase tracking-wider px-1.5 py-0.5 rounded border ${urgencyColor(c.urgency)}`}>
                  {c.urgency}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-light leading-relaxed mb-2">{c.brief}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map(tag => (
                  <span key={tag} className="font-mono text-[0.55rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Likelihood */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="font-mono text-xs text-gray-400">{c.likelihood}%</span>
              <LikelihoodBar pct={c.likelihood} urgency={c.urgency} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/2 border-t border-white/5">
        <span className="text-[0.65rem] text-gray-600 font-light">Informational only</span>
        <span className="flex items-center gap-1 text-[0.6rem] text-gray-600 font-mono uppercase tracking-wider">
          <Zap size={9} className="text-yellow-500" /> Powered by Groq Llama 3
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BookAppointment() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [symptoms, setSymptoms] = useState('');
  const [aiAssessment, setAiAssessment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isGroqPowered, setIsGroqPowered] = useState(false);

  // Step 2 & 3
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [consultationMode, setConsultationMode] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    if (!user) navigate('/');
    emailjs.init('nEbb9aPtYh8imCD0M');
  }, [user, navigate]);

  // Simple spec triage for plain-text AI response
  const localTriage = (text: string): { spec: string; brief: string } => {
    const assessment = buildLocalAssessment(text);
    return { spec: assessment.spec, brief: assessment.conditions[0]?.brief || 'A specialist will assess you.' };
  };

  const analyzeSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);

    let finalSpec = 'General Physician';
    let finalBrief = '';
    let finalConditions: Condition[] = [];
    let groqPowered = false;

    // Always build local assessment immediately — shown if API fails
    const local = buildLocalAssessment(symptoms);
    finalSpec = local.spec;
    finalConditions = local.conditions;
    finalBrief = local.conditions[0]?.brief || '';

    try {
      console.log('[Groq] Sending symptoms to Cloudflare Worker...');
      const res = await fetch('https://groqda.subhranilbaul2017.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: symptoms, prompt: symptoms }),
      });

      console.log('[Groq] Worker response status:', res.status, res.statusText);

      if (!res.ok) throw new Error(`Worker returned HTTP ${res.status}`);

      const rawText = await res.text();
      console.log('[Groq] Raw response:', rawText);

      try {
        const data = JSON.parse(rawText);
        const aiContent = data.disease_brief || data.response || data.result || data.text || '';

        if (!aiContent.trim()) throw new Error('Worker returned empty AI content');

        // Try to extract structured conditions from the response
        if (data.conditions && Array.isArray(data.conditions)) {
          finalConditions = data.conditions;
          groqPowered = true;
        } else {
          // Use aiContent as a rich brief on top of local conditions
          finalBrief = aiContent;
          groqPowered = true;
        }

        finalSpec = data.specialization || data.specialty || localTriage(aiContent).spec;
        finalBrief = aiContent;
      } catch {
        console.warn('[Groq] Using local assessment (empty/parse error)');
      }

      console.log('[Groq] Parsed → Spec:', finalSpec, '| Groq:', groqPowered);
    } catch (err: any) {
      console.warn('[Groq] Worker failed, using local assessment. Reason:', err.message);
    }

    setAiAssessment(finalBrief || local.conditions[0]?.brief || '');
    setSpecialization(finalSpec);
    setConditions(finalConditions);
    setIsGroqPowered(groqPowered);

    // Query Firestore for matching doctors
    try {
      const docQuery = query(
        collection(db, 'doctors'),
        where('speciality', '==', finalSpec),
        where('status', '==', 'approved')
      );
      const snap = await getDocs(docQuery);
      const matched: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(`[Firestore] Found ${matched.length} approved ${finalSpec} doctor(s)`);
      setDoctors(matched);
    } catch (err) {
      console.error('[Firestore] Doctor query failed:', err);
      setDoctors([]);
    }

    setStep(2);
    setLoading(false);
  };

  const confirmBooking = async () => {
    if (!selectedDoctor || !date || !time) return alert('Please specify the date and time slot.');
    
    // DEV BYPASS: Allow creating record without payment on localhost for testing dashboard flow
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      if (confirm("Detected Dev Environment. Bypass Razorpay for testing?")) {
        setLoading(true);
        try {
          const meetingId = Math.random().toString(36).substring(2, 10).toUpperCase();
          const meetingLink = consultationMode === 'online' ? `https://meet.jit.si/MedicarePlus_Consult_${meetingId}` : '';
          const appointmentData = {
            patientId: user?.uid,
            patientName: userProfile?.name || user?.email,
            patientEmail: userProfile?.email || user?.email,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            specialization: selectedDoctor.speciality,
            date,
            time,
            status: 'upcoming',
            fees: selectedDoctor.fees,
            paymentRef: 'DEV_TEST_BYPASS',
            symptoms,
            aiAssessment,
            consultationMode,
            meetingLink,
            createdAt: new Date().toISOString(),
          };
          console.log('[Booking] Dev Bypass - Saving:', appointmentData);
          await addDoc(collection(db, 'appointments'), appointmentData);
          alert("Dev Bypass: Appointment created successfully.");
          navigate('/patient-dashboard');
          return;
        } catch (e: any) { 
          alert("Dev Bypass Failed: " + e.message); 
        } finally {
          setLoading(false);
        }
      }
    }

    setLoading(true);

    const options = {
      key: 'rzp_live_SRCE9sabTGkSGi',
      amount: selectedDoctor.fees * 100,
      currency: 'INR',
      name: 'MedicarePlus Appointment',
      description: `Consultation with ${selectedDoctor.name}`,
      handler: async function (response: any) {
        try {
          console.log('[Booking] Payment authorized:', response.razorpay_payment_id);
          const razorpayPaymentId = response.razorpay_payment_id;
          const meetingId = Math.random().toString(36).substring(2, 10).toUpperCase();
          const meetingLink = consultationMode === 'online' ? `https://meet.jit.si/MedicarePlus_Consult_${meetingId}` : '';

          console.log('[Booking] Saving to Firestore...');
          await addDoc(collection(db, 'appointments'), {
            patientId: user?.uid,
            patientName: userProfile?.name || user?.email,
            patientEmail: userProfile?.email || user?.email,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            specialization: selectedDoctor.speciality,
            date,
            time,
            status: 'upcoming',
            fees: selectedDoctor.fees,
            paymentRef: razorpayPaymentId,
            symptoms,
            aiAssessment,
            consultationMode,
            meetingLink,
            createdAt: new Date().toISOString(),
          });
          
          console.log('[Booking] Firestore record created, sending email...');
          await emailjs.send('default_service', 'template_smasli7', {
            to_name: userProfile?.name || 'Patient',
            to_email: userProfile?.email || user?.email,
            doctor_name: selectedDoctor.name,
            date,
            time,
            specialization: selectedDoctor.speciality,
          });
          
          setLoading(false);
          alert(`Success! Appointment confirmed. Reference: ${razorpayPaymentId}`);
          navigate('/patient-dashboard');
        } catch (err: any) {
          console.error('[Booking] Fatal Error:', err);
          alert(`Error confirming booking: ${err.message || 'Unknown error'}`);
          setLoading(false);
        }
      },
      prefill: {
        name: userProfile?.name || '',
        email: userProfile?.email || user?.email,
        contact: userProfile?.phone || '',
      },
      theme: { color: '#00E5FF' },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        alert('Payment Failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      console.error('Razorpay init error:', e);
      alert('Could not open payment gateway. Please ensure you are connected to the internet.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-primary-base) text-white font-sans py-24 px-8 md:px-16 flex justify-center">
      <div className="w-full max-w-4xl relative z-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/patient-dashboard')}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black flex items-center gap-3">
              Intelligent <span className="text-gradient">Booking</span>
            </h1>
            <p className="text-(--color-text-muted) font-mono tracking-widest uppercase text-[0.65rem] mt-1">Step {step} of 3</p>
          </div>
        </div>

        {/* Steps Content */}
        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">

            {/* STEP 1: AI Triage Input */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                <div className="flex items-start gap-4 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-(--color-accent-blue)/10 flex items-center justify-center text-(--color-accent-blue) border border-(--color-accent-blue)/20 flex-shrink-0">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white mb-1">Describe Your Symptoms</h2>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">Our Groq-powered Llama 3 engine will analyze your condition, predict possible conditions, and instantly route you to the correct specialist.</p>
                  </div>
                </div>

                <form onSubmit={analyzeSymptoms} className="flex flex-col gap-4">
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                    placeholder="e.g., I've been experiencing severe migraines for the past three days accompanied by nausea and sensitivity to light..."
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-6 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) resize-none transition-colors"
                  />

                  <button type="submit" disabled={loading || !symptoms.trim()} className="w-full md:w-auto self-end py-4 px-8 bg-white text-black rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer">
                    {loading
                      ? <><span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /><span>Analysing…</span></>
                      : <><Search size={18} /> Run AI Triage</>
                    }
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: AI Assessment + Doctor Selection */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">

                {/* Triage result banner */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-(--color-accent-purple)/10 to-transparent border border-(--color-accent-purple)/30 flex gap-4 items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-(--color-accent-purple)" />
                  <Activity className="text-(--color-accent-purple) flex-shrink-0 mt-1" size={22} />
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1.5 font-mono flex items-center gap-2">
                      Triage Result
                      <span className="px-2 py-0.5 rounded bg-(--color-accent-purple)/20 text-[0.6rem]">{specialization}</span>
                      {isGroqPowered && <span className="flex items-center gap-1 text-yellow-400 text-[0.6rem]"><Sparkles size={9} />Groq AI</span>}
                    </h3>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">{aiAssessment}</p>
                  </div>
                </div>

                {/* ── AI Disease Assessment Panel ── */}
                {conditions.length > 0 && (
                  <div>
                    <h2 className="text-base font-serif font-bold text-white mb-4 flex items-center gap-2">
                      <Brain size={18} className="text-(--color-accent-purple)" />
                      Predicted Conditions
                    </h2>
                    <DiseaseAssessmentPanel conditions={conditions} isAI={isGroqPowered} />
                  </div>
                )}

                {/* Doctor selection */}
                <div>
                  <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                    <Stethoscope className="text-(--color-accent-blue)" /> Available Specialists
                  </h2>

                  {doctors.length === 0 ? (
                    <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-xl text-center">
                      <p className="text-red-400 font-mono text-sm uppercase tracking-widest">No matching specialists found in database.</p>
                      <p className="text-gray-400 text-xs mt-2">Please register a doctor with specialization: <span className="text-white font-bold">{specialization}</span></p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map(doc => (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDoctor(doc)}
                          className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${selectedDoctor?.id === doc.id ? 'bg-(--color-accent-blue)/10 border-(--color-accent-blue) shadow-[0_0_20px_rgba(0,229,255,0.15)] scale-[1.02]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
                        >
                          <h3 className="font-serif text-lg font-bold">{doc.name}</h3>
                          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-4">{doc.hospital}</p>
                          <div className="flex justify-between items-end border-t border-white/5 pt-4">
                            <div>
                              <p className="text-xs text-gray-500">Experience: <span className="text-gray-300">{doc.experience}</span></p>
                              <p className="text-xs text-gray-500 mt-1">Consultation: <span className="text-(--color-accent-blue) font-bold">₹{doc.fees}</span></p>
                            </div>
                            {selectedDoctor?.id === doc.id && <CheckCircle size={20} className="text-(--color-accent-blue)" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => setStep(3)} disabled={!selectedDoctor} className="w-full md:w-auto self-end py-4 px-8 bg-(--color-accent-blue) text-black rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)] mt-4">
                  Proceed to Slots
                </button>
              </motion.div>
            )}

            {/* STEP 3: Slot & Payment */}
            {step === 3 && selectedDoctor && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">

                <div className="flex justify-between items-center p-6 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{selectedDoctor.name}</h3>
                    <p className="text-xs text-(--color-accent-blue) font-mono tracking-widest uppercase">{selectedDoctor.speciality} • ₹{selectedDoctor.fees}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-(--color-accent-blue) flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mode Selection */}
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Consultation Type</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setConsultationMode('offline')}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 ${consultationMode === 'offline' ? 'bg-(--color-accent-blue)/20 border-(--color-accent-blue) text-white shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'}`}
                      >
                        <Building size={18} />
                        <span className="text-sm font-bold tracking-widest uppercase">In-Person (Offline)</span>
                      </button>
                      <button 
                        onClick={() => setConsultationMode('online')}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 ${consultationMode === 'online' ? 'bg-(--color-accent-purple)/20 border-(--color-accent-purple) text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'}`}
                      >
                        <Zap size={18} className="text-yellow-400" />
                        <span className="text-sm font-bold tracking-widest uppercase">Virtual (Online Video)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Select Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Select Time Slot</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-(--color-accent-blue) transition-colors appearance-none"
                    >
                      <option value="" disabled>Choose an available slot</option>
                      {(() => {
                        if (!date || !selectedDoctor) return null;
                        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
                        const slots = selectedDoctor.availability?.[dayName] || selectedDoctor.availableSlots || [];
                        if (slots.length === 0) return <option disabled>No slots for this day</option>;
                        return slots.map((slot: string) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400 font-mono">
                    <CreditCard size={20} className="text-green-400" />
                    Secure Razorpay Checkout
                  </div>
                  <button
                    onClick={confirmBooking}
                    disabled={loading || !date || !time}
                    className="w-full md:w-auto py-4 px-10 bg-green-500 text-black rounded-lg font-black text-sm tracking-widest uppercase hover:bg-green-400 transition-colors disabled:opacity-50 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer"
                  >
                    {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : `Pay ₹${selectedDoctor.fees} & Confirm`}
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
