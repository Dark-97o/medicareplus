import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Brain, User, CheckCircle, Zap, Stethoscope, Sparkles, Clock, ArrowRight, ShieldCheck, MapPin, Calendar, RefreshCw } from 'lucide-react';
import { sendPatientBookingConfirmation, sendProviderBookingAlert } from '../lib/emailService';
import { useTranslation } from 'react-i18next';
import SafetyModal from '../components/SafetyModal';


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
    spec: 'Primary Care',
    conditions: [
      { name: 'Upper Respiratory Infection', likelihood: 72, brief: 'Cough, sore throat, and fever commonly indicate a viral URI or flu.', tags: ['respiratory', 'infectious'], urgency: 'low' },
      { name: 'Pneumonia', likelihood: 40, brief: 'Productive cough with high fever and chest tightness may indicate pneumonia.', tags: ['respiratory', 'infectious'], urgency: 'high' },
      { name: 'Bronchitis', likelihood: 35, brief: 'Persistent cough with mucus production could suggest bronchial inflammation.', tags: ['respiratory', 'inflammatory'], urgency: 'moderate' },
    ],
  },
  {
    keywords: /stomach|abdomen|nausea|vomit|diarrhea|bloat|gastric|indigestion|acid/i,
    spec: 'Primary Care',
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
    spec: 'Primary Care',
    conditions: [
      { name: 'General Medical Review Needed', likelihood: 65, brief: 'Your described symptoms require a comprehensive evaluation by a Primary Care specialist.', tags: ['general', 'review'], urgency: 'low' },
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
  const freeRescheduleId = searchParams.get('freeRescheduleId');
  const specialtyParam = searchParams.get('specialty');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [symptoms, setSymptoms] = useState('');
  const [aiAssessment, setAiAssessment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isGroqPowered, setIsGroqPowered] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);


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
            where('speciality', 'in', ['Primary Care', 'General Physician']),
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
    } else if (freeRescheduleId && specialtyParam) {
      setSymptoms('Free Reschedule');
      setSpecialization(specialtyParam);
      setLoading(true);
      const fetchSpecialtyDoctors = async () => {
        try {
          const docQuery = query(
            collection(db, 'doctors'),
            where('speciality', '==', specialtyParam),
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
      fetchSpecialtyDoctors();
    }
  }, [user, authLoading, navigate, isCheckupMode, freeRescheduleId, specialtyParam]);

  useEffect(() => {
    const sensitiveWords = [
      /suicide/i, /self[ -]harm/i, /kill (myself|me)/i, /ending (my life|it all|it)/i, 
      /no reason to live/i, /want to die/i, /death/i, /hurt (myself|me)/i, 
      /cut(ting)? myself/i, /harm(ing)? myself/i, /hang(ing)? myself/i, /poison(ing)? myself/i, 
      /jump(ing)? from/i, /hopeless/i, /worthless/i, /goodbye world/i, /farewell/i
    ];
    if (sensitiveWords.some(regex => regex.test(symptoms))) {
      setShowSafetyModal(true);
    }
  }, [symptoms]);

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
              content: `You are a medical triage assistant. Your goal is to identify the most appropriate clinical specialty from the list below based on user symptoms. 
              
              AVAILABLE SPECIALTIES:
              - Primary Care (Default for cold, cough, fever, stomach issues, and general first-line medicine)
              - Cardiology (Heart, chest pain, palpitations)
              - Neurology (Brain, nerves, seizures, migraines)
              - Orthopedics (Bones, joints, spine, fractures)
              - Dermatology (Skin, rashes, hair)
              - Pediatrics (Children's health)
              - Oncology (Cancer, tumors)
              - Psychiatry (Mental health, mood, anxiety)
              - Urology (Urinary issues, kidneys, bladder)
              - Radiology (Imaging results)
              - Endocrinology (Hormones, diabetes, thyroid)

              MANDATORY RULE: You MUST return a specialization from this list ONLY. Never introduce new terms like "Pulmonology". Default to "Primary Care" if unsure. 
              
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

    // Ensure the specialization is normalized to exact database strings
    const ALLOWED_SPECS = ["Primary Care", "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Oncology", "Psychiatry", "Urology", "Radiology", "Endocrinology", "Therapist"];
    const matchedSpec = ALLOWED_SPECS.find(s => s.toLowerCase() === finalSpec.toLowerCase());
    const querySpec = matchedSpec || 'Primary Care';

    setAiAssessment(finalBrief || local.conditions[0]?.brief || '');
    setSpecialization(querySpec);
    setConditions(finalConditions);
    setIsGroqPowered(groqPowered);

    // Query Firestore for matching doctors
    try {
      const docQuery = query(
        collection(db, 'doctors'),
        where('speciality', '==', querySpec),
        where('status', '==', 'approved')
      );
      const snap = await getDocs(docQuery);
      const matched: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(`[Firestore] Found ${matched.length} approved ${querySpec} doctor(s)`);
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
    
    if (freeRescheduleId) {
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
          paymentRef: 'FREE_RESCHEDULE',
          symptoms: 'Free Reschedule from Auto-Cancelled Appointment',
          aiAssessment: '',
          consultationMode,
          meetingLink,
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, 'appointments'), appointmentData);
        await updateDoc(doc(db, 'appointments', freeRescheduleId), {
           refundStatus: 'Reschedule Claimed (100%)'
        });
        await sendPatientBookingConfirmation({
          to_email: userProfile?.email || user?.email || '',
          to_name: userProfile?.name || 'Patient',
          service_type: 'Doctor Appointment (Free Reschedule)',
          provider_name: selectedDoctor.name,
          date,
          time,
          transaction_id: 'FREE_RESCHEDULE',
          amount_paid: 'Free Reschedule',
        });
        await sendProviderBookingAlert({
          provider_email: selectedDoctor.email || 'doctor@example.com',
          provider_name: selectedDoctor.name,
          patient_name: userProfile?.name || 'Patient',
          service_type: 'Free Reschedule',
          date,
          time,
        });
        alert("Free Reschedule successful!");
        navigate('/patient-dashboard');
        return;
      } catch (e: any) { 
        alert("Failed to reschedule: " + e.message); 
      } finally {
        setLoading(false);
      }
      return;
    }

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

  if (loading) return <div className="min-h-screen bg-(--color-primary-base) text-white flex items-center justify-center font-mono animate-pulse tracking-widest text-sm uppercase">Loading Secure Portal...</div>;

  return (
    <div className="min-h-screen bg-(--color-primary-base) text-white font-sans pt-28 pb-16 px-6 md:px-12 flex justify-center items-start">
      <SafetyModal isOpen={showSafetyModal} onClose={() => setShowSafetyModal(false)} />
      <div className="w-full max-w-[1440px] relative z-10">
        <div className="flex items-center gap-6 mb-6">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/patient-dashboard')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black">{t('booking.title')}</h1>
            <div className="px-3 py-1 bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/20 rounded-full text-[9px] font-mono tracking-widest text-(--color-accent-blue) uppercase mt-1 inline-block">
              {t('booking.step', { current: step })}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="relative z-10">
                  <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2"><Sparkles className="text-(--color-accent-blue)"/> {t('booking.symptoms.title')}</h2>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t('booking.symptoms.desc')}</p>
                  
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder={t('booking.symptoms.placeholder')}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all min-h-[100px] font-mono"
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
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-9 space-y-6 lg:border-r lg:border-white/5 lg:pr-8">
                    {conditions.length > 0 && (
                      <div className="origin-top-left pt-2">
                        <h2 className="text-sm font-serif font-bold text-white mb-4 flex items-center gap-2">
                          <Brain size={18} className="text-(--color-accent-purple)" />
                          {t('booking.assessment.predicted_conditions')}
                        </h2>
                        <DiseaseAssessmentPanel conditions={conditions} isAI={isGroqPowered} />
                      </div>
                    )}

                    <div className={`mt-8 pt-8 border-t border-white/5 transition-all duration-500 ${selectedDoctor ? 'opacity-100 translate-y-0' : 'opacity-20 pointer-events-none'}`}>
                      <h2 className="text-sm font-serif font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar size={18} className="text-(--color-accent-blue)" />
                        {t('booking.slots.title')} {selectedDoctor && <span className="text-[10px] text-gray-500 font-mono uppercase ml-2 tracking-widest">— {selectedDoctor.name}</span>}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{t('booking.slots.type')}</h3>
                          <div className="flex gap-3">
                            <button onClick={() => setConsultationMode('offline')} className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${consultationMode === 'offline' ? 'bg-(--color-accent-blue)/10 border-(--color-accent-blue) text-(--color-accent-blue)' : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/20'}`}>
                              <MapPin size={14}/> <span className="text-[10px] font-bold uppercase tracking-wider">{t('booking.slots.in_person')}</span>
                            </button>
                            <button onClick={() => setConsultationMode('online')} className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${consultationMode === 'online' ? 'bg-(--color-accent-purple)/10 border-(--color-accent-purple) text-(--color-accent-purple)' : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/20'}`}>
                              <Brain size={14}/> <span className="text-[10px] font-bold uppercase tracking-wider">{t('booking.slots.virtual')}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar size={12}/> {t('booking.slots.date')}</h3>
                          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-all font-mono" />
                        </div>

                        <div>
                          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Clock size={12}/> {t('booking.slots.time')}</h3>
                          <select value={time} onChange={(e) => setTime(e.target.value)} disabled={!selectedDoctor} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-all appearance-none font-mono">
                            <option value="">{t('booking.slots.choose_slot')}</option>
                            {selectedDoctor?.availability?.[new Date(date).toLocaleDateString('en-US', { weekday: 'long' })]?.map((slot: string) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="mb-4">
                      <p className="text-xl text-(--color-accent-blue) font-mono font-black uppercase tracking-[0.1em] mb-1">{specialization || 'General Physician'}</p>
                      <h2 className="text-lg font-serif font-bold flex items-center gap-2 opacity-60">
                        <Stethoscope size={18} className="text-(--color-accent-blue)"/> 
                        {t('booking.doctors.title')}
                      </h2>
                    </div>
                    
                    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {doctors.length === 0 ? (
                        <div className="p-8 border border-white/5 rounded-2xl text-center bg-white/5 glass-panel">
                          <p className="text-gray-400 mb-2">{t('booking.doctors.none')}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-widest leading-tight">{t('booking.doctors.register_desc')} {specialization}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5 pb-4">
                          {doctors.map(doc => (
                            <div key={doc.id} onClick={() => setSelectedDoctor(doc)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col gap-2 ${selectedDoctor?.id === doc.id ? 'bg-(--color-accent-blue)/10 border-(--color-accent-blue) shadow-[0_0_15px_rgba(0,229,255,0.15)] scale-[1.02]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                  {doc.imageUrl ? (
                                    <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                      <User size={18} />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-serif text-[13px] font-bold truncate leading-tight">{doc.name}</h3>
                                  <p className="text-[10px] text-(--color-accent-blue) font-bold mt-0.5">₹{doc.fees}</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-0.5">
                                <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase truncate">{doc.hospital}</p>
                                {selectedDoctor?.id === doc.id && <CheckCircle size={14} className="text-(--color-accent-blue)" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <button 
                    onClick={() => setStep(3)} 
                    disabled={!selectedDoctor || !date || !time} 
                    className="w-full py-4 bg-(--color-accent-blue) text-black rounded-xl font-bold tracking-widest uppercase hover:bg-white transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
                  >
                    {t('booking.doctors.cta')} <ArrowRight size={16}/>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && selectedDoctor && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <ShieldCheck className="text-green-400" size={20} />
                   </div>
                   <div>
                      <h2 className="text-xl font-serif font-bold text-white lowercase leading-tight">Finalizing your appointment</h2>
                      <p className="text-[11px] text-gray-500 uppercase tracking-widest">Review details & proceed to secure payment</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-12 lg:col-span-5 p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Doctor Details</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0">
                          {selectedDoctor.imageUrl ? <img src={selectedDoctor.imageUrl} alt="" className="w-full h-full object-cover" /> : <User className="w-full h-full p-2.5 text-gray-600" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-serif font-bold text-white truncate">{selectedDoctor.name}</h4>
                          <p className="text-[10px] text-(--color-accent-blue) uppercase tracking-wider font-bold mb-1">{selectedDoctor.speciality}</p>
                          <p className="text-[9px] text-gray-500 font-mono truncate">{selectedDoctor.hospital}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/5 space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 uppercase tracking-wider">Consultation Fee</span>
                        <span className="text-white font-bold">₹{selectedDoctor.fees}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500 uppercase tracking-wider">Platform Charge</span>
                        <span className="text-green-400 font-bold">FREE</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-12 lg:col-span-7 p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
                    <h3 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Schedule Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-(--color-accent-blue) shrink-0">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Date</p>
                          <p className="text-xs text-white font-bold font-mono">{date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-(--color-accent-purple) shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Time Slot</p>
                          <p className="text-xs text-white font-bold font-mono">{time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 shrink-0">
                          {consultationMode === 'online' ? <Brain size={14} /> : <MapPin size={14} />}
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Mode</p>
                          <p className="text-xs text-white font-bold uppercase tracking-tighter">{consultationMode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                          <ShieldCheck size={14} />
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Status</p>
                          <p className="text-xs text-white font-bold uppercase tracking-tighter">Verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    {freeRescheduleId ? (
                      <><RefreshCw size={14} className="text-(--color-accent-blue)" /> Auto-Bypass Payment Enabled</>
                    ) : (
                      <><ShieldCheck size={14} className="text-green-500" /> Secure SSL 256-bit Encryption</>
                    )}
                  </div>
                  <button onClick={confirmBooking} disabled={loading} className="w-full md:w-auto py-3.5 px-10 bg-(--color-accent-blue) text-black rounded-xl font-black tracking-[0.2em] uppercase hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,229,255,0.2)] cursor-pointer text-xs">
                    {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Zap size={14}/> {freeRescheduleId ? 'CONFIRM RESCHEDULE' : `Pay ₹${selectedDoctor.fees}`} <ArrowRight size={16}/></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SafetyModal isOpen={showSafetyModal} onClose={() => setShowSafetyModal(false)} />
    </div>
  );
}
