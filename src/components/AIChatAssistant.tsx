import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, User } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Namaste! I am your MedicarePlus AI assistant. How can I help you today? I can help you find Jaipur's best doctors, book lab tests, or understand your symptoms.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemContext, setSystemContext] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const [docSnap, testSnap, labSnap] = await Promise.all([
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'lab_tests')),
          getDocs(collection(db, 'lab_doctors'))
        ]);

        const doctors = docSnap.docs.map(d => {
          const data = d.data();
          return `${data.name} (${data.speciality} at ${data.hospital}, Fee: ₹${data.fees})`;
        }).join(', ');

        const tests = testSnap.docs.map(t => {
          const data = t.data();
          return `${data.name} (${data.category}, Price: ₹${data.charges})`;
        }).join(', ');

        const labs = labSnap.docs.map(l => {
          const data = l.data();
          return `${data.labName} (${data.hospital})`;
        }).join(', ');

        setSystemContext(`
          You are the MedicarePlus AI Assistant for a hospital network in Jaipur, Rajasthan. 
          Your goal is to help users navigate the platform and provide medical guidance.
          
          KNOWLEDGE BASE:
          - Doctors: ${doctors}
          - Lab Tests: ${tests}
          - Registered Labs/Hospitals: ${labs}

          CAPABILITIES:
          - Suggest relevant doctors based on specialization or symptoms.
          - Provide lab test names and pricing.
          - Explain general medical conditions (always include a disclaimer: "Please consult a professional doctor for final diagnosis").
          - Direct users to book: 
            - Appointments: /book-appointment
            - Lab Tests: /lab-booking
            - Professional Portals: /admin, /doctor, /lab

          TONE: Professional, welcoming, and helpful. Use "Namaste" occasionally.
        `);
      } catch (err) {
        console.error("Context fetch error:", err);
      }
    };
    fetchContext();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = messages.slice(-6).map(m => ({ 
        role: m.role, 
        content: m.content 
      }));

      const requestBody = { 
        messages: [
          { 
            role: 'system', 
            content: systemContext || "You are the MedicarePlus AI Assistant for Jaipur. Help users book doctors and lab tests." 
          },
          ...chatHistory,
          { role: 'user', content: input }
        ]
      };
      
      console.log("AI Request Body:", requestBody);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: requestBody.messages,
          temperature: 0.7,
          max_tokens: 512,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      console.log("AI Assistant Raw Response:", data);

      const aiContent = data.choices?.[0]?.message?.content || 
        "I'm sorry, I'm having trouble connecting to the AI. Please try again.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Connection Issue: ${err.message}. Please try again later.`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Bottom Left as requested */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)] border transition-all duration-500 ${
            isOpen ? 'bg-red-500/20 border-red-500/50 text-red-100' : 'bg-(--color-accent-blue) border-(--color-accent-blue)/50 text-black'
          } backdrop-blur-xl group overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {isOpen ? <X size={28} /> : <div className="relative"><Bot size={30} /><motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full blur-[2px]" /></div>}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            className="fixed bottom-28 left-8 w-[90vw] md:w-[816px] h-[600px] max-h-[70vh] z-[100] glass-panel border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden backdrop-blur-[80px]"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-(--color-accent-blue)/10 to-(--color-accent-purple)/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-(--color-accent-blue)/20 border border-(--color-accent-blue)/40 flex items-center justify-center">
                  <Sparkles size={20} className="text-(--color-accent-blue) animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-white text-lg tracking-tight">MedicarePlus AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-green-400 font-bold">Cloud Sync Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-black/20"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                      m.role === 'user' ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-(--color-accent-blue)/20 border-(--color-accent-blue)/30 text-(--color-accent-blue)'
                    }`}>
                      {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-(--color-accent-blue) text-black font-medium shadow-[0_4px_15px_rgba(0,229,255,0.1)]' 
                        : 'bg-white/5 border border-white/10 text-gray-200'
                    }`}>
                      {m.content}
                      {m.role === 'assistant' && m.content.includes('/') && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                           <button onClick={() => window.location.href='/book-appointment'} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-(--color-accent-blue)/20 border border-(--color-accent-blue)/40 rounded-lg hover:bg-(--color-accent-blue) hover:text-black transition-all">Book Doctor</button>
                           <button onClick={() => window.location.href='/lab-booking'} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-(--color-accent-purple)/20 border border-(--color-accent-purple)/40 rounded-lg hover:bg-(--color-accent-purple) hover:text-white transition-all">Book Lab</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-(--color-accent-blue)/20 border border-(--color-accent-blue)/30 flex items-center justify-center"><Bot size={14} /></div>
                      <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-2xl flex gap-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-(--color-accent-blue) rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-(--color-accent-blue) rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-(--color-accent-blue) rounded-full" />
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-black/40 border-t border-white/10">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask MedicarePlus AI..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-(--color-accent-blue)/50 pr-14 placeholder:text-gray-600 transition-all font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 w-10 h-10 bg-(--color-accent-blue) text-black rounded-xl flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-gray-600 font-mono uppercase tracking-widest text-center mt-4">
                Informational AI · Consult a Physician for Final diagnosis
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
