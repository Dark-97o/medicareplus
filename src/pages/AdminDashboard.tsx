import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import ErrorBoundary from '../components/ErrorBoundary';
import { ShieldAlert, ArrowRight, Lock, Trash2, Pencil, X, CheckCircle, XCircle, Stethoscope, User, Calendar, Plus, Phone, Mail, FlaskConical, Activity, Star, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';

/* ─── TYPES ─── */
type TabId = 'doctors' | 'patients' | 'bookings' | 'labs' | 'lab_bookings' | 'enquiries' | 'messages' | 'reviews';

/* ─── ADMIN LOGIN ─── */
function AdminLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid admin credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-primary-base) flex items-center justify-center px-4 pt-12 relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/40" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Spline scene="https://prod.spline.design/55m29bzeifbR3LPv/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-(--color-primary-base) via-transparent to-(--color-primary-base) pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-md rounded-2xl border border-(--color-accent-blue)/20 shadow-[0_0_60px_rgba(0,229,255,0.12)] overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple)" />
        <div className="p-10 pt-4">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/30 flex items-center justify-center mb-5 relative">
              <ShieldAlert size={30} className="text-(--color-accent-blue)" />
              <div className="absolute inset-0 border border-(--color-accent-blue)/20 rounded-full animate-ping" />
            </div>
            <h2 className="text-2xl font-serif font-black text-white mb-1">{t('admin.console')}</h2>
            <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-mono">{t('admin.auth_only')}</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center flex items-center gap-2"><Lock size={14}/>{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">{t('admin.email')}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all"
                placeholder="admin@medicareplus.com" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">{t('admin.access_key')}</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm focus:border-(--color-accent-blue) focus:outline-none focus:ring-1 focus:ring-(--color-accent-blue)/30 transition-all font-mono tracking-widest"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full mt-2 py-4 bg-gradient-to-r from-(--color-accent-blue) to-(--color-accent-purple) text-black rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><span className="uppercase tracking-widest">{t('admin.uplink')}</span><ArrowRight size={16}/></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── EDIT MODAL ─── */
function EditModal({ item, onSave, onClose, collection: col }: { item: any; onSave: (id: string, data: any) => void; onClose: () => void; collection: string; }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<any>({ ...item });
  const excluded = ['id', 'createdAt', 'appointments'];
  const fields = Object.keys(form).filter(k => !excluded.includes(k));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-2xl glass-panel border border-(--color-accent-blue)/30 rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2"><Pencil size={18} className="text-(--color-accent-blue)" /> {t('admin.edit')} {col === 'doctors' ? t('admin.doctor') : col === 'users' ? t('admin.patient') : t('admin.booking')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(key => (
            <div key={key} className={key === 'address' || key === 'symptoms' || key === 'aiAssessment' ? 'md:col-span-2' : ''}>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">{key.replace(/([A-Z])/g, ' $1')}</label>
              {key === 'id' || key === 'createdAt' ? (
                <input value={typeof form[key] === 'object' && form[key]?.seconds ? new Date(form[key].seconds * 1000).toLocaleString() : form[key] ?? ''} disabled
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              ) : (
                <input value={form[key] ?? ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-(--color-accent-blue) focus:outline-none transition-all" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">{t('admin.cancel')}</button>
          <button onClick={() => onSave(item.id, form)} className="px-5 py-2.5 bg-(--color-accent-blue) text-black rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2">
            <Plus size={14} /> {t('admin.save')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── DOCTOR TABLE ─── */
function DoctorTable({ doctors, onEdit, onDelete, onApprove, onDecline }: any) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const pending = doctors.filter((d: any) => d.status === 'pending');
  const approved = doctors.filter((d: any) => d.status !== 'pending');

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' : status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
      {status === 'approved' ? t('admin.status_approved') : status === 'pending' ? t('admin.status_pending') : t('admin.status_declined')}
    </span>
  );

  const Row = ({ d }: { d: any }) => (
    <div className="glass-panel border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <div className="p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/20 flex items-center justify-center shrink-0 overflow-hidden">
          {d.imageUrl ? <img src={d.imageUrl} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /> : <Stethoscope size={24} className="text-(--color-accent-blue)" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white truncate">{d.name}</span>
            <StatusBadge status={d.status} />
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{d.speciality} · {d.hospital}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {d.status === 'pending' && (<>
            <button onClick={() => onApprove(d.id)} className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500 hover:text-black transition-all text-xs font-bold uppercase flex items-center gap-1"><CheckCircle size={12} /> {t('admin.approve')}</button>
            <button onClick={() => onDecline(d.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase flex items-center gap-1"><XCircle size={12} /> {t('admin.decline')}</button>
          </>)}
          <button onClick={() => onEdit(d)} className="p-2 hover:bg-white/10 text-gray-400 hover:text-(--color-accent-blue) rounded-lg transition-colors"><Pencil size={14} /></button>
          <button onClick={() => onDelete(d.id, 'doctors')} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
          <button onClick={() => setExpanded(expanded === d.id ? null : d.id)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
            {expanded === d.id ? <Plus size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded === d.id && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 overflow-hidden">
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              {[['Email', d.email], ['Phone', d.phone], ['Age', d.age], ['Experience', `${d.experience} yrs`], ['Degree', d.degree], ['Institution', d.institution], ['Fees', `₹${d.fees}`]].map(([k, v]) => (
                <div key={k}><p className="text-gray-500 uppercase tracking-wider mb-0.5">{k}</p><p className="text-white">{v || '—'}</p></div>
              ))}
              {d.proofUrl && <div className="md:col-span-2"><p className="text-gray-500 uppercase tracking-wider mb-0.5">Proof</p><a href={d.proofUrl} target="_blank" rel="noreferrer" className="text-(--color-accent-blue) hover:underline truncate block">{d.proofUrl}</a></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> {t('admin.pending_applications')} ({pending.length})</h3>
          <div className="space-y-2">{pending.map((d: any) => <Row key={d.id} d={d} />)}</div>
        </div>
      )}
      {approved.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t('admin.active_physicians')} ({approved.length})</h3>
          <div className="space-y-2">{approved.map((d: any) => <Row key={d.id} d={d} />)}</div>
        </div>
      )}
      {doctors.length === 0 && <div className="text-center py-12 text-gray-500 font-mono text-sm">{t('admin.no_doctors_found')}</div>}
    </div>
  );
}

/* ─── LAB TABLE ─── */
function LabTable({ labs, labTests, onDelete, onApprove, onDecline, onEdit }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const pending = labs.filter((l: any) => l.status === 'pending');
  const approved = labs.filter((l: any) => l.status !== 'pending');

  const Row = ({ l }: { l: any }) => {
    const lTests = labTests.filter((t: any) => t.labId === l.id);
    
    return (
      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
        <div className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center shrink-0 overflow-hidden">
            {l.imageUrl ? <img src={l.imageUrl} alt="" className="w-full h-full object-cover" /> : <FlaskConical size={24} className="text-(--color-accent-purple)" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white truncate">{l.labName}</span>
              <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full border ${l.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>{l.status}</span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Specialist: {l.name} · {l.hospital}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {l.status === 'pending' && (<>
              <button onClick={() => onApprove(l.id, 'lab_doctors')} className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500 hover:text-black transition-all text-[10px] font-bold uppercase">Approve</button>
              <button onClick={() => onDecline(l.id, 'lab_doctors')} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase">Decline</button>
            </>)}
            <button onClick={() => onEdit(l)} className="p-2 hover:bg-white/10 text-gray-400 hover:text-(--color-accent-blue) rounded-lg transition-colors"><Pencil size={14} /></button>
            <button onClick={() => onDelete(l.id, 'lab_doctors')} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
            <button onClick={() => setExpanded(expanded === l.id ? null : l.id)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
               <Plus size={14} className={`transition-transform duration-300 ${expanded === l.id ? 'rotate-45' : ''}`} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {expanded === l.id && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-black/20 p-6 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-[10px] font-mono mb-6">
                <div><p className="text-gray-500 uppercase tracking-widest mb-1.5">Email Contact</p><p className="text-white font-bold">{l.email}</p></div>
                <div><p className="text-gray-500 uppercase tracking-widest mb-1.5">System Registry</p><p className="text-white font-bold">{new Date(l.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-gray-500 uppercase tracking-widest mb-1.5">Authorization</p><p className="text-(--color-accent-purple) font-black">CERTIFIED SPECIALIST</p></div>
              </div>

              <div className="pt-6 border-t border-white/5 w-full">
                <div className="flex items-center gap-3 mb-5">
                   <Activity size={14} className="text-(--color-accent-purple)" />
                   <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Diagnostic Protocol Catalog</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lTests.length > 0 ? lTests.map((t: any) => (
                    <div key={t.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-(--color-accent-purple)/30 transition-all group/test">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={t.imageUrl} className="w-full h-full object-cover group-hover/test:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate group-hover/test:text-(--color-accent-purple) transition-colors">{t.name}</p>
                        <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mt-0.5">{t.category}</p>
                        <p className="text-[10px] font-black text-(--color-accent-purple) mt-1">₹{t.charges}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center glass-panel rounded-2xl border border-dashed border-white/10 scale-95">
                      <FlaskConical size={24} className="text-gray-700 mb-3 opacity-30" />
                      <p className="text-gray-600 font-mono text-[9px] uppercase tracking-widest">No active protocols in catalog</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Pending Lab Approvals ({pending.length})</h3>
          {pending.map((l: any) => <Row key={l.id} l={l} />)}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Registered Laboratories ({approved.length})</h3>
        {approved.map((l: any) => <Row key={l.id} l={l} />)}
      </div>
    </div>
  );
}

/* ─── LAB BOOKING TABLE ─── */
function LabBookingTable({ bookings, onEdit, onDelete }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  return (
    <div className="space-y-2">
      {bookings.length === 0 && <div className="text-center py-20 text-gray-600 font-mono text-xs uppercase tracking-widest">No lab transactions recorded.</div>}
      {bookings.map((b: any) => (
        <div key={b.id} className="glass-panel border border-white/5 rounded-xl flex flex-col overflow-hidden hover:border-white/10 transition-colors">
          <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-white uppercase tracking-tight">{b.patientName}</span>
                <span className="text-gray-500 font-mono text-[10px]"> booked </span>
                <span className="text-(--color-accent-purple) font-bold">{b.testName}</span>
                <span className={`ml-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-full border ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>{b.status}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{b.date} · {b.hospitalName} · ₹{b.charges}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(b)} className="p-2 hover:bg-white/10 text-gray-600 hover:text-(--color-accent-purple) rounded-lg transition-colors">
                 <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(b.id, 'lab_bookings')} className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-400 rounded-lg transition-colors">
                 <Trash2 size={14} />
              </button>
              <button onClick={() => setExpanded(expanded === b.id ? null : b.id)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                <Plus size={14} className={`transition-transform duration-300 ${expanded === b.id ? 'rotate-45' : ''}`} />
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {expanded === b.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-black/20 overflow-hidden">
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
                  {Object.keys(b).filter(k => k !== 'id' && typeof b[k] !== 'object').map(key => (
                    <div key={key}>
                      <p className="text-gray-500 uppercase tracking-widest mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-white truncate block">{b[key] ? String(b[key]) : '—'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ─── PATIENT TABLE ─── */
function PatientTable({ patients, onEdit, onDelete }: any) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {patients.length === 0 && <div className="text-center py-12 text-gray-500 font-mono text-sm">{t('admin.no_patients_found')}</div>}
      {patients.map((p: any) => (
        <div key={p.id} className="glass-panel border border-white/5 rounded-xl flex flex-col overflow-hidden hover:border-white/10 transition-colors">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center shrink-0">
              <User size={16} className="text-(--color-accent-purple)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white">{p.name}</p>
              <p className="text-xs text-gray-400 font-mono">{p.email} · Age {p.age} · {p.bloodGroup}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-gray-400">
              <span>{p.phone}</span>
              <button onClick={() => onEdit(p)} className="p-2 hover:bg-white/10 text-gray-400 hover:text-(--color-accent-blue) rounded-lg transition-colors"><Pencil size={14} /></button>
              <button onClick={() => onDelete(p.id, 'users')} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
              <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                <Plus size={14} className={`transition-transform duration-300 ${expanded === p.id ? 'rotate-45' : ''}`} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {expanded === p.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-black/20 overflow-hidden">
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
                  {Object.keys(p).filter(k => k !== 'id' && typeof p[k] !== 'object').map(key => (
                    <div key={key}>
                      <p className="text-gray-500 uppercase tracking-widest mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-white truncate block">{p[key] ? String(p[key]) : '—'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ─── BOOKING TABLE ─── */
function BookingTable({ bookings, onEdit, onDelete }: any) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {bookings.length === 0 && <div className="text-center py-12 text-gray-500 font-mono text-sm">{t('admin.no_bookings_found')}</div>}
      {bookings.map((b: any) => (
        <div key={b.id} className="glass-panel border border-white/5 rounded-xl flex flex-col overflow-hidden hover:border-white/10 transition-colors">
          <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-white">{b.patientName}</span>
                <span className="text-gray-400 font-mono text-xs">→ Dr. {b.doctorName}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${b.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : b.status === 'concluded' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>{b.status}</span>
              </div>
              <p className="text-xs text-gray-400 font-mono">{b.date} at {b.time} · {b.specialization} · ₹{b.fees || b.amount || 0}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onEdit(b)} className="p-2 hover:bg-white/10 text-gray-400 hover:text-(--color-accent-blue) rounded-lg transition-colors"><Pencil size={14} /></button>
              <button onClick={() => onDelete(b.id, 'appointments')} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
              <button onClick={() => setExpanded(expanded === b.id ? null : b.id)} className="p-2 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
                <Plus size={14} className={`transition-transform duration-300 ${expanded === b.id ? 'rotate-45' : ''}`} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {expanded === b.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-black/20 overflow-hidden">
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
                  {Object.keys(b).filter(k => k !== 'id' && typeof b[k] !== 'object').map(key => {
                    const isLongText = ['symptoms', 'aiAssessment', 'diagnosis', 'prescription', 'meetingLink', 'reviewText'].includes(key);
                    return (
                      <div key={key} className={isLongText ? 'md:col-span-4' : ''}>
                        <p className="text-gray-500 uppercase tracking-widest mb-0.5">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-white whitespace-pre-wrap">{b[key] ? String(b[key]) : '—'}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ─── ENQUIRY TABLE ─── */
function EnquiryTable({ enquiries, onDelete, onStatusChange }: any) {
  return (
    <div className="space-y-2">
      {enquiries.length === 0 && <div className="text-center py-12 text-gray-500 font-mono text-sm">No enquiries found.</div>}
      {enquiries.map((e: any) => (
        <div key={e.id} className="glass-panel border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${e.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
            <Phone size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white">{e.name}</p>
            <p className="text-xs text-gray-400 font-mono">{e.phone} · Preferred: {e.preferredTime}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {e.status === 'pending' && (
              <button 
                onClick={() => onStatusChange(e.id, 'contacted')}
                className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500 hover:text-black transition-all text-[10px] font-bold uppercase"
              >
                Mark Contacted
              </button>
            )}
            <button onClick={() => onDelete(e.id, 'enquiries')} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── MESSAGE TABLE ─── */
function MessageTable({ messages, onDelete }: any) {
  return (
    <div className="space-y-4">
      {messages.length === 0 && <div className="text-center py-12 text-gray-500 font-mono text-sm">No messages found.</div>}
      {messages.map((m: any) => (
        <div key={m.id} className="glass-panel border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--color-accent-purple)/10 border border-(--color-accent-purple)/20 flex items-center justify-center text-(--color-accent-purple)">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{m.name}</h4>
                <p className="text-xs text-gray-400 font-mono">{m.email} · {m.phone}</p>
              </div>
            </div>
            <button onClick={() => onDelete(m.id, 'contacts')} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300 leading-relaxed italic">
            "{m.message}"
          </div>
          <div className="mt-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            Received: {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : 'Just now'}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── REVIEW TABLE ─── */
function ReviewTable({ reviews }: { reviews: any[] }) {
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div className="text-center py-12 text-gray-500 font-mono text-sm">No reviews found.</div>}
      {reviews.map(r => (
        <div key={r.id} className="glass-panel border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">{r.patientName} <span className="text-gray-500 text-xs font-mono font-normal">→ Dr. {r.doctorName}</span></h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono mt-1">{r.hospitalName || r.specialization || 'MedicarePlus Network'}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} size={14} className={i < (r.reviewRating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
               ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300 leading-relaxed italic">
            "{r.reviewText}"
          </div>
          <div className="mt-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            Appointment Date: {r.date} {r.time && `· ${r.time}`}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── ADMIN PANEL ─── */
function AdminPanel() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('doctors');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [labBookings, setLabBookings] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editItem, setEditItem] = useState<{ item: any; col: string } | null>(null);

  const loadAll = async () => {
    setLoadingData(true);
    try {
      const [docSnap, patSnap, bookSnap, enqSnap, msgSnap, labSnap, lBkSnap, testSnap] = await Promise.all([
        getDocs(collection(db, 'doctors')),
        getDocs(collection(db, 'users')),
        getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'lab_doctors')),
        getDocs(query(collection(db, 'lab_bookings'), orderBy('createdAt', 'desc'))),
        getDocs(collection(db, 'lab_tests'))
      ]);
      setDoctors(docSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPatients(patSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setBookings(bookSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setEnquiries(enqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLabs(labSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLabBookings(lBkSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLabTests(testSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleSave = async (id: string, data: any) => {
    if (!editItem) return;
    const colName = editItem.col;
    const { id: _id, ...updateData } = data;
    await updateDoc(doc(db, colName, id), updateData);
    setEditItem(null);
    loadAll();
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!confirm("Are you sure you want to permanently delete this record?")) return;
    await deleteDoc(doc(db, colName, id));
    loadAll();
  };

  const handleApprove = async (id: string, col: string = 'doctors') => {
    await updateDoc(doc(db, col, id), { status: 'approved' });
    loadAll();
  };

  const handleDecline = async (id: string, col: string = 'doctors') => {
    await updateDoc(doc(db, col, id), { status: 'rejected' });
    loadAll();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'enquiries', id), { status: newStatus });
    loadAll();
  };

  const tabs: { id: TabId; label: string; icon: any; count: number; badge?: number }[] = [
    { id: 'doctors', label: t('admin.physicians'), icon: Stethoscope, count: doctors.length, badge: doctors.filter(d => d.status === 'pending').length },
    { id: 'patients', label: t('admin.patients'), icon: User, count: patients.length },
    { id: 'bookings', label: t('admin.appointments'), icon: Calendar, count: bookings.length },
    { id: 'labs', label: 'Labs', icon: FlaskConical, count: labs.length, badge: labs.filter(l => l.status === 'pending').length },
    { id: 'lab_bookings', label: 'Lab Orders', icon: Activity, count: labBookings.length },
    { id: 'enquiries', label: 'Enquiries', icon: Phone, count: enquiries.length, badge: enquiries.filter(e => e.status === 'pending').length },
    { id: 'messages', label: 'Messages', icon: Mail, count: messages.length },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: bookings.filter((b:any) => b.reviewText).length },
  ];

  return (
    <div className="min-h-screen bg-[#050B14] text-white relative overflow-hidden">
      {/* Abstract Background Spline */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none h-full overflow-hidden">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-black/20" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-black/40" />}>
            <Spline scene="https://prod.spline.design/vwfRpoawpJ6f8SRL/scene.splinecode" />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050B14] pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col pt-12">

      {/* Top Bar */}
      <div className="sticky top-16 z-30 bg-[#050B14]/90 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/30 flex items-center justify-center">
            <ShieldAlert size={20} className="text-(--color-accent-blue)" />
          </div>
          <div>
            <p className="font-serif font-bold text-white text-lg leading-none">{t('admin.global_command')}</p>
            <p className="text-gray-400 text-xs mt-0.5 font-mono">{user?.email}</p>
          </div>
          <div className="ml-3 flex items-center gap-1.5 px-3 py-1 bg-(--color-accent-blue)/10 border border-(--color-accent-blue)/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent-blue) animate-pulse" />
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-(--color-accent-blue)">{t('admin.system_online')}</span>
          </div>
        </div>
        <button onClick={signOut} className="px-4 py-2 border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-xs font-mono uppercase tracking-widest transition-all">
          {t('admin.terminate_session')}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {tabs.map(t => (
            <div key={t.id} className={`glass-panel p-3.5 rounded-2xl border flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 relative ${activeTab === t.id ? 'border-(--color-accent-blue)/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'border-white/5 hover:border-white/10'}`} onClick={() => setActiveTab(t.id)}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === t.id ? 'bg-(--color-accent-blue)/20 border border-(--color-accent-blue)/30' : 'bg-white/5 border border-white/10'}`}>
                <t.icon size={18} className={activeTab === t.id ? 'text-(--color-accent-blue)' : 'text-gray-400'} />
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif font-black text-white">{t.count}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono line-clamp-1">{t.label}</div>
              </div>
              {t.badge && t.badge > 0 ? <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-black/20">{t.badge}</span> : null}
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-white/5 mb-8 overflow-x-auto scrollbar-hide">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap shrink-0 ${activeTab === t.id ? 'border-(--color-accent-blue) text-(--color-accent-blue)' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                <t.icon size={12} /> {t.label}
              </button>
            ))}
        </div>

        {/* Content */}
        {loadingData ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-(--color-accent-blue) border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {activeTab === 'doctors' && (
                <DoctorTable doctors={doctors} onEdit={(d: any) => setEditItem({ item: d, col: 'doctors' })} onDelete={handleDelete} onApprove={handleApprove} onDecline={handleDecline} />
              )}
              {activeTab === 'patients' && (
                <PatientTable patients={patients} onEdit={(p: any) => setEditItem({ item: p, col: 'users' })} onDelete={handleDelete} />
              )}
              {activeTab === 'bookings' && (
                <BookingTable bookings={bookings} onEdit={(b: any) => setEditItem({ item: b, col: 'appointments' })} onDelete={handleDelete} />
              )}
              {activeTab === 'enquiries' && (
                <EnquiryTable enquiries={enquiries} onDelete={handleDelete} onStatusChange={handleStatusChange} />
              )}
              {activeTab === 'labs' && (
                <LabTable labs={labs} labTests={labTests} onEdit={(l: any) => setEditItem({ item: l, col: 'lab_doctors' })} onDelete={handleDelete} onApprove={handleApprove} onDecline={handleDecline} />
              )}
              {activeTab === 'lab_bookings' && (
                <LabBookingTable bookings={labBookings} onEdit={(b: any) => setEditItem({ item: b, col: 'lab_bookings' })} onDelete={handleDelete} />
              )}
              {activeTab === 'messages' && (
                <MessageTable messages={messages} onDelete={handleDelete} />
              )}
              {activeTab === 'reviews' && (
                <ReviewTable reviews={bookings.filter((b:any) => b.reviewText)} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editItem && (
          <EditModal item={editItem.item} collection={editItem.col} onSave={handleSave} onClose={() => setEditItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── DEFAULT EXPORT ─── */
export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-(--color-accent-blue) animate-pulse font-mono uppercase tracking-widest text-xs">{t('admin.initializing_secure_channel')}</div>;
  return user ? <AdminPanel /> : <AdminLogin />;
}
