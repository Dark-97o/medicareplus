import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ArrowLeft, Brain, User, CheckCircle, Zap, Stethoscope, Sparkles, Clock, ArrowRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { sendPatientBookingConfirmation, sendProviderBookingAlert } from '../lib/emailService';
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation();
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
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-gray-400">{t('booking.triage.engine_desc')}</span>
        <span className="ml-auto font-mono text-[0.55rem] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/8 text-gray-500">
          {isAI ? 'Groq · Llama 3' : t('booking.triage.local_engine')}
        </span>
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
        <span className="text-[0.65rem] text-gray-600 font-light">{t('booking.assessment.informational_only')}</span>
        <span className="flex items-center gap-1 text-[0.6rem] text-gray-600 font-mono uppercase tracking-wider">
          <Zap size={9} className="text-yellow-500" /> {t('booking.assessment.powered_by')}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BookAppointment() {
  const { t } = useTranslation();
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCheckupMode = searchParams.get('mode') === 'checkup';

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
    if (authLoading) return;
    if (!user) {
      navigate('/');
      return;
    }

    if (isCheckupMode && !symptoms) {
      setSymptoms('General Health Checkup & Basic Screening');
      // Automatically trigger analysis for checkup
      const checkupSymptoms = 'General Health Checkup & Basic Screening';
      setLoading(true);
      
      const local = buildLocalAssessment(checkupSymptoms);
      setSpecialization('General Physician');
      setConditions(local.conditions);
      
      // Query for doctors
      const fetchCheckupDoctors = async () => {
        try {
          const docQuery = query(
            collection(db, 'doctors'),
            where('speciality', '==', 'General Physician'),
            where('status', '==', 'approved')
          );
          const snap = await getDocs(docQuery);
          const matched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setDoctors(matched);
          setStep(2);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCheckupDoctors();
    }
  }, [user, authLoading, navigate, isCheckupMode]);

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
      console.log('[Groq] Sending symptoms directly to Groq API...');
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
         },
        body: JSON.stringify({ 
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: "system",
              content: `You are a medical triage assistant. Identify specialty and provide brief assessment context. 
              Return ONLY JSON: {"specialization": "...", "disease_brief": "..."}`
            },
            { role: "user", content: `Symptoms: ${symptoms}` }
          ],
          temperature: 0.3,
          max_tokens: 512,
          response_format: { type: "json_object" }
        }),
      });

      console.log('[Groq] API response status:', res.status, res.statusText);

      if (!res.ok) throw new Error(`Groq API returned HTTP ${res.status}`);

      const groqData = await res.json();
      console.log('[Groq] Raw response:', groqData);

      try {
        const content = groqData.choices?.[0]?.message?.content || '{}';
        const data = JSON.parse(content);
        const aiContent = data.disease_brief || data.response || data.result || data.text || '';

        if (!aiContent.trim()) throw new Error('API returned empty AI content');

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
          
          console.log('[Booking] Firestore record created, sending emails...');
          
          await sendPatientBookingConfirmation({
            to_email: userProfile?.email || user?.email || '',
            to_name: userProfile?.name || 'Patient',
            service_type: 'Doctor Appointment',
            provider_name: selectedDoctor.name,
            date,
            time,
            transaction_id: razorpayPaymentId,
            amount_paid: `₹${selectedDoctor.fees}`,
          });

          await sendProviderBookingAlert({
            provider_email: selectedDoctor.email || 'doctor@example.com',
            provider_name: selectedDoctor.name,
            patient_name: userProfile?.name || 'Patient',
            service_type: 'Doctor Appointment',
            date,
            time,
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
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/patient-dashboard')}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-black">{t('booking.title')}</h1>
            <div className="px-4 py-1.5 bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/20 rounded-full text-[10px] font-mono tracking-widest text-(--color-accent-blue) uppercase mt-2 inline-block">
              {t('booking.step', { current: step })}
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="relative z-10">
                  <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2"><Sparkles className="text-(--color-accent-blue)"/> {t('booking.symptoms.title')}</h2>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('booking.symptoms.desc')}</p>
                  
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder={t('booking.symptoms.placeholder')}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all min-h-[150px] font-mono"
                  />
                  
                  <button
                    onClick={analyzeSymptoms}
                    disabled={loading || !symptoms.trim()}
                    className="w-full mt-6 py-4 bg-(--color-accent-blue) text-black rounded-xl font-bold tracking-widest uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                  >
                    {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Brain size={18}/> {t('booking.symptoms.cta')}</>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-(--color-accent-blue)/30 bg-(--color-accent-blue)/5 p-8 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-(--color-accent-blue)">{t('booking.triage.result')}</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/50 border border-white/10 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-mono uppercase text-gray-400">{isGroqPowered ? t('booking.triage.ai') : t('booking.triage.local_engine')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-(--color-accent-blue)/20 border border-(--color-accent-blue)/30 flex items-center justify-center shrink-0">
                      <Brain size={24} className="text-(--color-accent-blue)" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{t('booking.triage.engine_desc')}</p>
                      <p className="text-xl font-serif font-bold text-white leading-tight">{specialization}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 italic leading-relaxed mb-6 border-l-2 border-white/10 pl-4">{t('booking.triage.disclaimer')}</p>
                </motion.div>

                {conditions.length > 0 && (
                  <div>
                    <h2 className="text-base font-serif font-bold text-white mb-4 flex items-center gap-2">
                      <Brain size={18} className="text-(--color-accent-purple)" />
                      {t('booking.assessment.predicted_conditions')}
                    </h2>
                    <DiseaseAssessmentPanel conditions={conditions} isAI={isGroqPowered} />
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2"><Stethoscope className="text-(--color-accent-blue)"/> {t('booking.doctors.title')} - <span className="text-(--color-accent-blue)">{specialization}</span></h2>
                  
                  {doctors.length === 0 ? (
                    <div className="p-12 border border-white/5 rounded-2xl text-center bg-white/5 glass-panel">
                      <p className="text-gray-400 mb-2">{t('booking.doctors.none')}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">{t('booking.doctors.register_desc')} {specialization}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map(doc => (
                        <div key={doc.id} onClick={() => setSelectedDoctor(doc)}
                          className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 flex gap-4 items-start ${selectedDoctor?.id === doc.id ? 'bg-(--color-accent-blue)/10 border-(--color-accent-blue) shadow-[0_0_20px_rgba(0,229,255,0.15)] scale-[1.02]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}>
                          <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                            {doc.imageUrl ? (
                              <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <User size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-lg font-bold">{doc.name}</h3>
                            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mb-4">{doc.hospital}</p>
                            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                              <div>
                                <p className="text-xs text-gray-500">{t('doctor.auth.experience')}: <span className="text-gray-300">{doc.experience}</span></p>
                                <p className="text-xs text-gray-500 mt-1">{t('doctor.auth.consultation_fee')}: <span className="text-(--color-accent-blue) font-bold">₹{doc.fees}</span></p>
                              </div>
                              {selectedDoctor?.id === doc.id && <CheckCircle size={20} className="text-(--color-accent-blue)" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => setStep(3)} disabled={!selectedDoctor} className="w-full mt-4 py-4 bg-(--color-accent-blue) text-black rounded-xl font-bold tracking-widest uppercase hover:bg-white transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  {t('booking.doctors.cta')} <ArrowRight size={14} className="ml-2 inline-block"/>
                </button>
              </motion.div>
            )}

            {step === 3 && selectedDoctor && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8">
                <div className="flex justify-between items-center p-6 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{selectedDoctor.name}</h3>
                    <p className="text-xs text-(--color-accent-blue) font-mono tracking-widest uppercase">{selectedDoctor.speciality} • ₹{selectedDoctor.fees}</p>
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                    {selectedDoctor.imageUrl ? (
                      <img src={selectedDoctor.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">{t('booking.slots.type')}</h3>
                    <div className="flex gap-4">
                      <button onClick={() => setConsultationMode('offline')} className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${consultationMode === 'offline' ? 'bg-(--color-accent-blue)/10 border-(--color-accent-blue) text-(--color-accent-blue)' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>
                        <MapPin size={16}/> <span className="text-xs font-bold uppercase tracking-wider">{t('booking.slots.in_person')}</span>
                      </button>
                      <button onClick={() => setConsultationMode('online')} className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${consultationMode === 'online' ? 'bg-(--color-accent-purple)/10 border-(--color-accent-purple) text-(--color-accent-purple)' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>
                        <Brain size={16}/> <span className="text-xs font-bold uppercase tracking-wider">{t('booking.slots.virtual')}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Calendar size={14}/> {t('booking.slots.date')}</h3>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-all" />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Clock size={14}/> {t('booking.slots.time')}</h3>
                    <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-all appearance-none">
                      <option value="">{t('booking.slots.choose_slot')}</option>
                      {selectedDoctor.availability?.[new Date(date).toLocaleDateString('en-US', { weekday: 'long' })]?.map((slot: string) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-white/5 mt-4 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-widest font-bold">
                    <ShieldCheck size={18} className="text-green-400" />
                    {t('booking.payment.secure_checkout')}
                  </div>
                  <button onClick={confirmBooking} disabled={!date || !time || loading} className="w-full md:w-auto py-5 px-10 bg-(--color-accent-blue) text-black rounded-xl font-black tracking-widest uppercase hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,229,255,0.2)] cursor-pointer">
                    {loading ? <span className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <>{t('booking.slots.cta', { fee: selectedDoctor.fees })} <ArrowRight size={20}/></>}
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
