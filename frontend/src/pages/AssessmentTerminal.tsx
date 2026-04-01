import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Loader, 
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AssessmentTerminal = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [paper, setPaper] = useState<any>(null);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<{ totalScore: number } | null>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const { data } = await axios.post(`http://localhost:5000/api/exams/${id}/start`, {}, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        
        setExam(data.exam);
        setPaper(data.paper);
        
        // Initialize timer based on server's startedAt + duration
        const startTime = new Date(data.submission.startedAt).getTime();
        const durationMs = data.exam.durationMinutes * 60000;
        const endTimeTime = startTime + durationMs;
        const remaining = Math.max(0, Math.floor((endTimeTime - Date.now()) / 1000));
        
        setTimeLeft(remaining);
      } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Access Denied.');
        navigate('/student');
      } finally {
        setLoading(false);
      }
    };
    startSession();
  }, [id, user, navigate]);

  useEffect(() => {
    if (timeLeft === null || result) return;
    
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result]);

  // Block context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async () => {
    if (submitting) return;
    await executeSubmit();
  };

  const executeSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = Object.entries(answers).map(([questionId, providedAnswer]) => ({
        questionId,
        providedAnswer
      }));

      const { data } = await axios.post(`http://localhost:5000/api/exams/${id}/submit`, { answers: payload }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      setResult({ totalScore: data.totalScore });
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
      <Loader className="text-brand-500 w-16 h-16 animate-spin mb-6" />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-500 font-mono animate-pulse">Initializing Secure Tunnel...</p>
    </div>
  );

  if (result) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 relative overflow-hidden px-4">
      <div className="absolute inset-0 cyber-grid opacity-[0.03]"></div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pro-card max-w-lg w-full text-center relative z-10 p-16"
      >
         <CheckCircle className="w-24 h-24 text-brand-500 mx-auto mb-8 relative z-10" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl p-16 z-0"></div>
         
         <h1 className="text-4xl font-black text-white mb-4 tracking-tighter font-display z-10 relative">Execution Finalized</h1>
         <p className="text-zinc-400 font-light mb-12 z-10 relative">The evaluation engine successfully processed your sequence blocks. Analysis is mathematically complete.</p>
         
         <div className="flex flex-col items-center gap-2 mb-12 z-10 relative">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] font-mono">Performance Index</span>
            <div className="text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
               {result.totalScore} <span className="text-2xl text-zinc-600">/ {paper.totalMarks}</span>
            </div>
         </div>
         
         <button onClick={() => navigate('/student')} className="btn-pro-primary w-full py-5 text-sm uppercase tracking-widest relative z-10">Return to Nexus</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 select-none pb-48">
       {/* Persistent HUD */}
       <div className="fixed top-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-3xl border-b border-rose-500/20 z-50 px-6 py-4 flex justify-between items-center shadow-[0_0_40px_rgba(244,63,94,0.05)]">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
             </div>
             <div>
                <h2 className="text-white font-black text-sm uppercase tracking-widest font-mono">{exam.title}</h2>
                <div className="flex gap-3 text-zinc-500 text-[10px] font-mono uppercase mt-1 tracking-widest">
                   <span className="flex items-center gap-1.5"><Target className="w-3 h-3 text-rose-500/50" /> {paper.totalMarks} PTS</span>
                   <span className="text-zinc-700">///</span>
                   <span>SECURE MODE</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 font-mono mb-1 flex items-center gap-2">
                   {timeLeft && timeLeft < 300 && <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />} Time Remaining
                </span>
                <span className={`text-2xl font-black font-mono tracking-widest ${timeLeft && timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                   {timeLeft !== null ? formatTime(timeLeft) : '00:00:00'}
                </span>
             </div>
             <button 
                onClick={() => { if(window.confirm('Executing premature validation will permanently lock the session and deploy current buffers. Confirm?')) executeSubmit(); }}
                disabled={submitting}
                className="bg-rose-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 transition-colors shadow-2xl shadow-rose-600/20 font-mono disabled:opacity-50"
             >
                {submitting ? 'Executing...' : 'Force Commit'}
             </button>
          </div>
       </div>

       {/* Examination Board Area */}
       <div className="relative pt-32 max-w-4xl mx-auto px-4 z-10">
          <div className="space-y-12">
             {paper.questions?.map((q: any, idx: number) => (
                <div key={q._id} className="pro-card relative border-zinc-800 bg-zinc-900/40 p-10 md:p-14">
                   <div className="absolute -left-12 top-10 text-zinc-800 text-7xl font-black no-print pointer-events-none select-none font-display opacity-50">
                      {String(idx + 1).padStart(2, '0')}
                   </div>
                   
                   <div className="flex justify-between items-start gap-6 border-b border-whisper-border pb-8 mb-8">
                      <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-200">
                         {q.text}
                      </p>
                      <span className="text-[10px] font-black text-brand-500 whitespace-nowrap mt-2 tracking-[0.3em] font-mono bg-brand-500/10 px-3 py-1.5 rounded border border-brand-500/20">
                         {q.marks} PTS
                      </span>
                   </div>

                   {q.type === 'MCQ' && q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {q.options.map((opt: string, i: number) => (
                            <label 
                               key={i} 
                               className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300
                               ${answers[q._id] === opt ? 'bg-brand-500/10 border-brand-500 text-white' : 'bg-black/20 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                            >
                               <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black font-mono transition-colors
                               ${answers[q._id] === opt ? 'border-brand-500 bg-brand-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-zinc-700 text-zinc-500'}`}>
                                  {String.fromCharCode(65 + i)}
                               </div>
                               <span className="pt-1.5 font-medium">{opt}</span>
                               <input 
                                  type="radio" 
                                  name={`question-${q._id}`} 
                                  value={opt} 
                                  className="sr-only" 
                                  checked={answers[q._id] === opt}
                                  onChange={() => setAnswers({...answers, [q._id]: opt})}
                               />
                            </label>
                         ))}
                      </div>
                   )}
                   
                   {q.type !== 'MCQ' && (
                      <div className="mt-8">
                         <textarea 
                            rows={8} 
                            placeholder="Input logical proof or syntactic block here..."
                            value={answers[q._id] || ''}
                            onChange={(e) => setAnswers({...answers, [q._id]: e.target.value})}
                            className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-6 text-zinc-300 font-mono text-sm leading-relaxed focus:outline-none focus:border-brand-500 transition-colors resize-none placeholder-zinc-700"
                         />
                      </div>
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default AssessmentTerminal;
