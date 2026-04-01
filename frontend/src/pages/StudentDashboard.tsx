import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Download, 
  Loader, 
  BookOpenCheck, 
  Search, 
  Clock, 
  Target,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPapers();
  }, [user]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/exams/student', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch papers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  const filteredExams = exams.filter(e => 
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.paperId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader className="text-brand-500 w-12 h-12" />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in relative cyber-grid-container px-2 pb-24">
       <div className="absolute inset-0 cyber-grid opacity-[0.02] pointer-events-none"></div>
       
       <div className="relative z-10 space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 stagger-reveal">
        <div>
           <div className="flex items-center gap-3 mb-4 text-brand-500">
              <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px] font-mono">Credentialed Access // Tier 1</span>
           </div>
           <h1 className="text-hero text-white mb-4">My Queue.</h1>
           <p className="text-zinc-400 text-xl font-light max-w-xl leading-relaxed">
             Access high-fidelity assessment blueprints assigned to your intelligence profile.
           </p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Filter archives..." 
            className="input-pro pl-16 py-5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pro-card p-32 text-center bg-zinc-950/30 border-dashed"
        >
          <BookOpenCheck className="w-20 h-20 mx-auto mb-8 text-zinc-800" />
          <p className="text-3xl font-black text-white mb-4 font-display">Queue Clear</p>
          <p className="text-xl text-zinc-500 font-light max-w-md mx-auto leading-relaxed">No assignments currently require execution or processing.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-reveal">
          {filteredExams.map((exam: any, idx: number) => {
            const now = new Date();
            const start = new Date(exam.startTime);
            const end = new Date(exam.endTime);
            const isLive = now >= start && now <= end;
            const isUpcoming = now < start;
            
            return (
            <motion.div 
               key={exam._id} 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               onClick={() => isLive ? handleLaunch(exam._id) : alert('Deployment is outside operational limits.')}
               className={`pro-card group cursor-pointer relative overflow-hidden active:scale-[0.98] ${!isLive ? 'opacity-50 grayscale hover:grayscale-0 transition-all' : ''}`}
            >
              {/* Geometric Ambience */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/20 transition-all duration-700"></div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="p-4 bg-brand-600/10 rounded-2xl group-hover:bg-brand-600 transition-all duration-500">
                  <FileText className="w-7 h-7 text-brand-400 group-hover:text-white" />
                </div>
                <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border font-mono ${isLive ? 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5' : isUpcoming ? 'text-amber-500 border-amber-500/10 bg-amber-500/5' : 'text-rose-500 border-rose-500/10 bg-rose-500/5'}`}>
                  {isLive ? 'LIVE' : isUpcoming ? 'SCHEDULED' : 'CLOSED'}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-1 line-clamp-2 font-display tracking-tight group-hover:text-brand-300 transition-all duration-500">{exam.title}</h3>
              <p className="text-zinc-400 text-sm mb-6 truncate">{exam.paperId?.title}</p>
              
              <div className="mt-auto pt-8 border-t border-whisper-border flex justify-between items-end relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-widest font-mono">
                     <Target className="w-3.5 h-3.5 text-brand-500/50" /> {exam.paperId?.totalMarks} PTS
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-widest font-mono">
                     <Clock className="w-3.5 h-3.5 text-brand-500/50" /> {exam.durationMinutes} MIN
                  </div>
                </div>
                
                <motion.button 
                  whileHover={isLive ? { scale: 1.1, rotate: 5 } : {}}
                  whileTap={isLive ? { scale: 0.9 } : {}}
                  onClick={(e) => { e.stopPropagation(); if (isLive) handleLaunch(exam._id); }}
                  className={`p-5 rounded-3xl transition-all shadow-inner border ${isLive ? 'bg-zinc-900 border-whisper-border hover:bg-brand-600 text-brand-400 hover:text-white group-hover:border-brand-500' : 'bg-zinc-950 text-zinc-700 border-zinc-900 cursor-not-allowed'}`}
                  title={isLive ? "Initialize Sequence" : "Deployment Locked"}
                >
                  <Play className="w-6 h-6 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          )})}
        </div>
      )}
      </div>
    </div>
  );
};

export default StudentDashboard;
