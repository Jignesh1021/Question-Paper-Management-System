import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Download, 
  Printer, 
  ChevronLeft, 
  Loader, 
  FileText,
  BookOpen,
  CalendarClock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaperView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [assignForm, setAssignForm] = useState({
    assignedBatches: [] as string[],
    startTime: '',
    endTime: '',
    durationMinutes: 60,
    isMock: false
  });

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/papers/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setPaper(data);
        setAssignForm(prev => ({ ...prev, durationMinutes: data.durationMinutes }));

        if (user?.role === 'teacher') {
          const batchRes = await axios.get('http://localhost:5000/api/batches', {
            headers: { Authorization: `Bearer ${user?.token}` }
          });
          setBatches(batchRes.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id, user]);

  const handlePrint = () => {
    window.print();
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: `${paper.title} - Deployment`,
        paperId: paper._id,
        ...assignForm
      };
      await axios.post('http://localhost:5000/api/exams/assign', payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      alert('Paper successfully scheduled for deployment.');
      setShowAssignModal(false);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Error occurred while assigning the paper.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader className="text-brand-500 w-12 h-12" />
      </motion.div>
    </div>
  );

  if (!paper) return (
    <div className="text-center py-48 stagger-reveal">
       <div className="text-zinc-700 font-mono text-xs uppercase tracking-[0.3em] mb-4">404 // Archive Miss</div>
       <p className="text-zinc-500 italic text-xl font-light">Document signature not found in Nexus.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 no-print stagger-reveal">
        <Link to={user?.role === 'student' ? '/student' : '/teacher'} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.2em] bg-zinc-950/50 px-6 py-3 rounded-2xl border border-whisper-border backdrop-blur-xl">
           <ChevronLeft className="w-4 h-4" /> Return to Queue
        </Link>
        <div className="flex gap-4">
           {user?.role === 'teacher' && (
              <button onClick={() => setShowAssignModal(true)} className="btn-pro-primary px-8 py-3 text-xs uppercase tracking-widest font-black shadow-2xl shadow-brand-600/20">
                 <CalendarClock className="w-4 h-4" /> Schedule Deployment
              </button>
           )}
           <button onClick={handlePrint} className="btn-pro-secondary px-8 py-3 text-xs uppercase tracking-widest font-black">
              <Printer className="w-4 h-4" /> Print Blueprint
           </button>
           <button className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-2xl flex items-center justify-center px-8 py-3 text-xs uppercase tracking-widest font-black transition-all">
              <Download className="w-4 h-4 mr-2" /> Export
           </button>
        </div>
      </div>

      {/* Assignment Modal overlay */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="pro-card w-full max-w-lg relative bg-zinc-900 border-zinc-800"
            >
               <button onClick={() => setShowAssignModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
               </button>
               <h3 className="text-2xl font-black text-white mb-8 font-display flex items-center gap-3">
                  <CalendarClock className="w-6 h-6 text-brand-500" /> Deploy Assessment
               </h3>

               <form onSubmit={handleAssign} className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Target Cohorts</label>
                   <select 
                     multiple 
                     className="input-pro text-sm h-32" 
                     value={assignForm.assignedBatches} 
                     onChange={e => setAssignForm({...assignForm, assignedBatches: Array.from(e.target.selectedOptions, option => option.value)})}
                     required
                   >
                     {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.year})</option>)}
                   </select>
                   <p className="text-xs text-brand-500/80 mt-2 font-mono italic">Hold Ctrl/Cmd to select multiple cohorts.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Start Schedule</label>
                     <input type="datetime-local" className="input-pro text-sm" value={assignForm.startTime} onChange={e => setAssignForm({...assignForm, startTime: e.target.value})} required />
                   </div>
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">End Schedule</label>
                     <input type="datetime-local" className="input-pro text-sm" value={assignForm.endTime} onChange={e => setAssignForm({...assignForm, endTime: e.target.value})} required />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Clock Cycles (Min)</label>
                     <input type="number" className="input-pro text-sm" value={assignForm.durationMinutes} onChange={e => setAssignForm({...assignForm, durationMinutes: Number(e.target.value)})} required />
                   </div>
                   <label className="flex items-center gap-3 mt-8 cursor-pointer group">
                     <div className="relative">
                       <input type="checkbox" className="sr-only" checked={assignForm.isMock} onChange={e => setAssignForm({...assignForm, isMock: e.target.checked})} />
                       <div className={`w-10 h-6 bg-zinc-800 rounded-full transition-colors ${assignForm.isMock ? 'bg-brand-500' : ''}`}></div>
                       <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${assignForm.isMock ? 'translate-x-4' : ''}`}></div>
                     </div>
                     <span className="text-sm font-black text-zinc-400 group-hover:text-white uppercase tracking-widest font-mono">Simulated Mock Test</span>
                   </label>
                 </div>

                 <button type="submit" className="btn-pro-primary w-full py-5 mt-4 text-sm uppercase tracking-widest">Execute Deployment</button>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Paper Document */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white text-zinc-950 shadow-2xl rounded-[3rem] overflow-hidden min-h-[11in] flex flex-col p-12 sm:p-24 relative font-serif"
        id="paper-content"
      >
        {/* Institutional Header */}
        <div className="border-b-[3px] border-zinc-950 pb-12 mb-16 text-center space-y-6">
           <div className="flex justify-center mb-6 no-print">
              <div className="h-16 w-16 bg-zinc-950 rounded-2xl flex items-center justify-center">
                 <BookOpen className="w-8 h-8 text-white" />
              </div>
           </div>
           <h1 className="text-4xl font-black uppercase tracking-tight leading-none text-zinc-950 font-display">
              Nexus Intelligence Examination Board
           </h1>
           <div className="h-1 w-24 bg-zinc-950 mx-auto"></div>
           <h2 className="text-2xl font-bold text-zinc-700">{paper.title}</h2>
        </div>

        {/* Candidate & Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-12 mb-20 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 font-mono">
           <div className="border-b border-zinc-100 pb-4">
              <p className="text-zinc-300 mb-2">Subject Domain</p>
              <p className="text-zinc-950 text-xs">{paper.subjectId?.name}</p>
           </div>
           <div className="border-b border-zinc-100 pb-4">
              <p className="text-zinc-300 mb-2">Threshold</p>
              <p className="text-zinc-950 text-xs">{paper.totalMarks} Marks</p>
           </div>
           <div className="border-b border-zinc-100 pb-4">
              <p className="text-zinc-300 mb-2">Clock Cycles</p>
              <p className="text-zinc-950 text-xs">{paper.durationMinutes} Minutes</p>
           </div>
           <div className="border-b border-zinc-100 pb-4">
              <p className="text-zinc-300 mb-2">Operational Index</p>
              <p className="text-zinc-950 text-xs truncate">{id?.slice(-8).toUpperCase()}</p>
           </div>
        </div>

        {/* Instructions */}
        <div className="mb-20 bg-zinc-50 p-10 rounded-3xl border border-zinc-100">
           <h3 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3 text-zinc-900 font-mono">
              <FileText className="w-4 h-4" /> Operational Instructions
           </h3>
           <ul className="text-sm list-decimal list-inside space-y-4 text-zinc-600 font-medium leading-relaxed italic">
              <li>Read all intelligence queries thoroughly before attempting verification.</li>
              <li>Verification must be completed within the specified clock cycles.</li>
              <li>Calculators are prohibited unless explicitly noted in the specific domain query.</li>
              <li>Maintain logical integrity throughout the entire examination process.</li>
           </ul>
        </div>

        {/* Questions Section */}
        <div className="space-y-16">
           {paper.questions?.map((q: any, idx: number) => (
              <div key={q._id} className="relative group">
                 <div className="absolute -left-16 top-1 text-zinc-100 text-5xl font-black no-print pointer-events-none select-none">
                    {String(idx + 1).padStart(2, '0')}
                 </div>
                 <div className="flex justify-between items-start gap-6 mb-6">
                    <p className="text-xl font-bold leading-relaxed text-zinc-900 first-letter:text-3xl first-letter:font-black">
                       <span className="font-black mr-4 text-zinc-950">{idx + 1}.</span> {q.text}
                    </p>
                    <span className="text-[10px] font-black text-zinc-400 whitespace-nowrap mt-2 tracking-widest font-mono">[{q.marks} MARKS]</span>
                 </div>

                 {q.type === 'MCQ' && q.options && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 ml-10 mt-8">
                       {q.options.map((opt: string, i: number) => (
                          <div key={i} className="flex items-start gap-4 text-zinc-700 font-medium text-sm leading-relaxed">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-zinc-200 flex items-center justify-center text-[10px] font-black font-mono">
                                {String.fromCharCode(65 + i)}
                             </div>
                             <span className="pt-1.5">{opt}</span>
                          </div>
                       ))}
                    </div>
                 )}
                 
                 {q.type !== 'MCQ' && (
                    <div className="mt-10 border-b border-dashed border-zinc-100 ml-10 min-h-[120px]"></div>
                 )}
              </div>
           ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-24 text-center text-[9px] uppercase font-black tracking-[0.5em] text-zinc-300 font-mono">
           Authenticated Intelligence Document // Nexus Systems Core // {new Date().getFullYear()}
        </div>
      </motion.div>

      {/* Styled Print Rules */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #paper-content { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaperView;
