import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FileSignature, 
  Database, 
  FilePlus, 
  Loader, 
  Search, 
  Plus, 
  Trash2, 
  Edit,
  Clock,
  Target,
  ChevronRight,
  AlertCircle,
  FileText,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'bank' | 'generate' | 'papers') || 'bank';
  
  const setActiveTab = (tab: 'bank' | 'generate' | 'papers') => {
    setSearchParams({ tab });
  };
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // New Question Form state
  const [nQ, setNQ] = useState({ 
    batchId: '',
    subjectId: '', 
    topicId: '',
    text: '', 
    type: 'MCQ', 
    marks: 1, 
    difficulty: 'Medium', 
    options: ['', '', '', ''],
    correctAnswers: [''] 
  });

  // Generate Paper Form state
  const [gp, setGp] = useState({ 
    title: '', 
    batchId: '',
    subjectId: '', 
    topicId: '',
    totalMarks: 50, 
    durationMinutes: 60,
    distribution: { Easy: 30, Medium: 50, Hard: 20 }
  });

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [subRes, qRes, pRes, tRes, bRes] = await Promise.all([
        axios.get('http://localhost:5000/api/subjects', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/questions', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/papers/teacher', { headers: { Authorization: `Bearer ${user?.token}` } }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/topics', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/batches', { headers: { Authorization: `Bearer ${user?.token}` } })
      ]);
      
      setSubjects(subRes.data);
      setQuestions(qRes.data);
      setPapers(pRes.data);
      setTopics(tRes.data);
      
      const teacherBatches = user?.role === 'admin' ? bRes.data : bRes.data.filter((b:any) => user?.teacherBatches?.includes(b._id));
      setBatches(teacherBatches);

      if (teacherBatches.length > 0) {
        setNQ(prev => ({ ...prev, batchId: teacherBatches[0]._id }));
        setGp(prev => ({ ...prev, batchId: teacherBatches[0]._id }));
      }
      
      if (subRes.data.length > 0) {
        setNQ(prev => ({ ...prev, subjectId: subRes.data[0]._id }));
        setGp(prev => ({ ...prev, subjectId: subRes.data[0]._id }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...nQ };
      if (nQ.type !== 'MCQ') delete (payload as any).options;
      
      await axios.post('http://localhost:5000/api/questions', payload, { headers: { Authorization: `Bearer ${user?.token}` } });
      fetchInitialData();
      setNQ({ ...nQ, text: '', options: ['', '', '', ''], correctAnswers: [''] });
      alert("Question successfully committed to bank.");
    } catch (error) {
       console.error(error);
       alert("Error creating question");
    }
  };

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
         ...gp,
         topics: gp.topicId ? [gp.topicId] : []
      };
      const { data } = await axios.post('http://localhost:5000/api/papers/generate', payload, { headers: { Authorization: `Bearer ${user?.token}` } });
      alert(`Paper Generated: ${data.title}`);
      fetchInitialData();
      setActiveTab('papers');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Low coverage: Not enough questions for criteria.");
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSubject === '' || q.subjectId?._id === filterSubject)
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
      {/* Header & Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 stagger-reveal">
        <div>
           <div className="flex items-center gap-3 mb-4 text-brand-500">
              <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px] font-mono">Intelligence Repository // Access-Level 2</span>
           </div>
           <h1 className="text-hero text-white mb-4 capitalize">
              {activeTab === 'bank' ? 'The Bank.' : activeTab === 'generate' ? 'Generator.' : 'Archives.'}
           </h1>
           <p className="text-zinc-400 text-xl font-light max-w-xl leading-relaxed">
             {activeTab === 'bank' ? 'Manage your semantic question database with granular precision.' : activeTab === 'generate' ? 'Initialize automated assessment generation sequences.' : 'Review and verify high-fidelity examination blueprints.'}
           </p>
        </div>

        <div className="flex bg-zinc-950/50 p-1.5 rounded-3xl border border-whisper-border backdrop-blur-3xl">
           <button 
             onClick={() => setActiveTab('bank')}
             className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'bank' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
           >
             <Database className="w-4 h-4" /> Question Bank
           </button>
           <button 
             onClick={() => setActiveTab('generate')}
             className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'generate' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
           >
             <FilePlus className="w-4 h-4" /> Generator
           </button>
           <button 
             onClick={() => setActiveTab('papers')}
             className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'papers' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
           >
             <FileSignature className="w-4 h-4" /> My Papers
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bank' && (
          <motion.div 
            key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col xl:flex-row gap-8 lg:gap-12"
          >
            {/* Add Question Sidebar */}
            <div className="w-full xl:w-96 flex-shrink-0">
              <div className="pro-card sticky top-24">
                 <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 font-display">
                    <Plus className="w-5 h-5 text-brand-500" /> New Query
                 </h3>
                 <form onSubmit={handleCreateQuestion} className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Target Batch</label>
                        <select className="input-pro text-sm" value={nQ.batchId} onChange={e => setNQ({...nQ, batchId: e.target.value})} required>
                          <option value="">-- Choose Batch --</option>
                          {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                     </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Domain</label>
                        <select className="input-pro text-sm" value={nQ.subjectId} onChange={e => setNQ({...nQ, subjectId: e.target.value})}>
                          <option value="">-- Choose --</option>
                          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Topic Matrix</label>
                        <select className="input-pro text-sm" value={nQ.topicId} onChange={e => setNQ({...nQ, topicId: e.target.value})} disabled={!nQ.subjectId}>
                          <option value="">-- Choose --</option>
                          {topics.filter(t => t.subjectId._id === nQ.subjectId || t.subjectId === nQ.subjectId).map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Type</label>
                          <select className="input-pro text-sm" value={nQ.type} onChange={e => setNQ({...nQ, type: e.target.value as any})}>
                             <option value="MCQ">MCQ</option>
                             <option value="Short">Short</option>
                             <option value="Long">Long</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Marks</label>
                          <input type="number" className="input-pro text-sm font-mono" value={nQ.marks} onChange={e => setNQ({...nQ, marks: Number(e.target.value)})} />
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Question Text</label>
                       <textarea rows={3} className="input-pro text-sm resize-none" placeholder="Formulate the inquiry..." required value={nQ.text} onChange={e => setNQ({...nQ, text: e.target.value})} />
                    </div>
                    
                    {nQ.type === 'MCQ' && (
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block font-mono">Options Matrix</label>
                          {nQ.options.map((opt, i) => (
                             <input key={i} className="input-pro py-3 text-xs" placeholder={`Choice ${String.fromCharCode(65+i)}`} value={opt} onChange={e => {
                                const newOpts = [...nQ.options];
                                newOpts[i] = e.target.value;
                                setNQ({...nQ, options: newOpts});
                             }} />
                          ))}
                       </div>
                    )}

                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Verification Key</label>
                       <input className="input-pro text-sm" placeholder="Correct output..." required value={nQ.correctAnswers[0]} onChange={e => setNQ({...nQ, correctAnswers: [e.target.value]})} />
                    </div>
                    
                    <button type="submit" className="btn-pro-primary w-full py-5 text-sm uppercase tracking-widest">Append to Bank</button>
                 </form>
              </div>
            </div>

            {/* List & Search */}
            <div className="flex-1 space-y-8 min-w-0">
              <div className="flex flex-col sm:flex-row gap-6">
                 <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                    <input type="text" placeholder="Search operational intelligence..." className="input-pro pl-16 py-5" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 </div>
                 <select className="input-pro w-full sm:w-64 text-sm py-5" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                    <option value="">All Subject Domains</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                 </select>
              </div>

              <div className="pro-table-container">
                 <table className="pro-table">
                    <thead>
                       <tr>
                          <th className="w-16">#</th>
                          <th>Inquiry Content</th>
                          <th>Domain</th>
                          <th>Classification</th>
                          <th>Threshold</th>
                          <th className="text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredQuestions.map((q, idx) => (
                          <tr key={q._id} className="group hover:bg-white/[0.02]">
                             <td><span className="text-zinc-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span></td>
                             <td>
                                <p className="font-black text-white font-display text-lg line-clamp-1 group-hover:line-clamp-none transition-all duration-500">{q.text}</p>
                                {q.type === 'MCQ' && q.options && (
                                   <div className="flex gap-2 mt-3">
                                      {q.options.map((_opt:any, i:number) => (
                                         <span key={i} className="text-[9px] font-black uppercase text-zinc-500 border border-whisper-border px-2 py-0.5 rounded font-mono">
                                            {String.fromCharCode(65+i)}
                                         </span>
                                      ))}
                                   </div>
                                )}
                             </td>
                             <td className="text-xs font-black text-brand-400 font-mono uppercase tracking-widest">{q.subjectId?.name}</td>
                             <td className="text-xs font-black uppercase text-zinc-500 font-mono">{q.type}</td>
                             <td><span className="bg-brand-500/10 text-brand-400 text-[10px] font-black px-3 py-1 rounded-full border border-brand-500/20 font-mono">{q.marks} PTS</span></td>
                             <td className="text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                   <button className="p-2 text-zinc-500 hover:text-white"><Edit className="w-5 h-5" /></button>
                                   <button className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'generate' && (
          <motion.div 
            key="generate" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto pt-4 pb-12"
          >
            <div className="pro-card p-16 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
               <div className="flex items-center gap-6 mb-16">
                  <div className="p-5 bg-brand-600 rounded-[2rem] shadow-2xl shadow-brand-600/30">
                     <FilePlus className="w-10 h-10 text-white" />
                  </div>
                  <div>
                     <h2 className="text-4xl font-black text-white tracking-tighter font-display">Generation Protocol</h2>
                     <p className="text-zinc-400 font-light text-lg">Initialize the sequence to synthesize a validated assessment blueprint.</p>
                  </div>
               </div>

               <form onSubmit={handleGeneratePaper} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block font-mono">Blueprint Title</label>
                        <input className="input-pro text-2xl font-black py-6 font-display" required placeholder="End-Term Verification: Unit 01" value={gp.title} onChange={e => setGp({...gp, title: e.target.value})} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block font-mono flex items-center gap-2"><Target className="w-3 h-3" /> Target Batch</label>
                        <select className="input-pro py-5 mb-4" value={gp.batchId} onChange={e => setGp({...gp, batchId: e.target.value})} required>
                           <option value="">-- Choose Target Batch --</option>
                           {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block font-mono flex items-center gap-2"><Target className="w-3 h-3" /> Target Domain</label>
                        <select className="input-pro py-5 mb-4" value={gp.subjectId} onChange={e => setGp({...gp, subjectId: e.target.value})}>
                           <option value="">-- Choose Domain --</option>
                           {subjects.filter((s:any) => s.batches.includes(gp.batchId)).map((s:any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                        
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block font-mono flex items-center gap-2 mt-4"><Database className="w-3 h-3" /> Target Topic (Optional)</label>
                        <select className="input-pro py-5" value={gp.topicId} onChange={e => setGp({...gp, topicId: e.target.value})} disabled={!gp.subjectId}>
                           <option value="">All Topics in Domain</option>
                           {topics.filter((t:any) => t.subjectId._id === gp.subjectId || t.subjectId === gp.subjectId).map((t:any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block font-mono">Threshold (Marks)</label>
                           <input type="number" className="input-pro py-5 font-mono text-center text-xl" value={gp.totalMarks} onChange={e => setGp({...gp, totalMarks: Number(e.target.value)})} />
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 block font-mono flex items-center gap-2"><Clock className="w-3 h-3" /> Cycles (Min)</label>
                           <input type="number" className="input-pro py-5 font-mono text-center text-xl" value={gp.durationMinutes} onChange={e => setGp({...gp, durationMinutes: Number(e.target.value)})} />
                        </div>
                     </div>
                  </div>

                  <div className="pro-card bg-zinc-950/40 col-span-2">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 font-mono border-b border-whisper-border pb-4">Difficulty Distribution Engine (%)</h4>
                     <div className="grid grid-cols-3 gap-8">
                        <div>
                           <label className="text-xs font-black text-brand-400 block mb-3 uppercase tracking-widest font-mono">Easy // {gp.distribution.Easy}%</label>
                           <input type="range" min="0" max="100" className="w-full accent-brand-500" value={gp.distribution.Easy} onChange={e => setGp({...gp, distribution: {...gp.distribution, Easy: Number(e.target.value)}})} />
                        </div>
                        <div>
                           <label className="text-xs font-black text-indigo-400 block mb-3 uppercase tracking-widest font-mono">Medium // {gp.distribution.Medium}%</label>
                           <input type="range" min="0" max="100" className="w-full accent-indigo-500" value={gp.distribution.Medium} onChange={e => setGp({...gp, distribution: {...gp.distribution, Medium: Number(e.target.value)}})} />
                        </div>
                        <div>
                           <label className="text-xs font-black text-rose-400 block mb-3 uppercase tracking-widest font-mono">Hard // {gp.distribution.Hard}%</label>
                           <input type="range" min="0" max="100" className="w-full accent-rose-500" value={gp.distribution.Hard} onChange={e => setGp({...gp, distribution: {...gp.distribution, Hard: Number(e.target.value)}})} />
                        </div>
                     </div>
                     {(gp.distribution.Easy + gp.distribution.Medium + gp.distribution.Hard) !== 100 && (
                        <p className="text-xs text-red-400 font-mono mt-4 italic">Warning: Distribution sum must exactly equal 100%. Current: {gp.distribution.Easy + gp.distribution.Medium + gp.distribution.Hard}%</p>
                     )}
                  </div>

                  <div className="bg-zinc-900/40 p-8 rounded-3xl border border-whisper-border flex items-start gap-6">
                     <AlertCircle className="w-6 h-6 text-brand-400 mt-1" />
                     <p className="text-sm text-zinc-400 leading-relaxed italic">
                        The **Synthesis Engine** will logically distribute inquiry types to meet the **{gp.totalMarks} PTS** threshold based on current bank density.
                     </p>
                  </div>

                  <button type="submit" className="btn-pro-primary h-20 w-full text-2xl font-black rounded-3xl group">
                     Execute Generation Sequence
                     <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
               </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'papers' && (
           <motion.div 
             key="papers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-reveal"
           >
              {papers.length === 0 && (
                 <div className="col-span-full py-48 text-center bg-zinc-950/30 rounded-3xl border border-dashed border-whisper-border">
                    <FileSignature className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                    <p className="text-zinc-500 italic text-2xl font-light">No blueprints found in current archives.</p>
                 </div>
              )}
              {papers.map((p, idx) => (
                 <motion.div 
                    key={p._id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/paper/${p._id}`)}
                    className="pro-card group cursor-pointer relative overflow-hidden active:scale-[0.98]"
                 >
                   <div className="flex justify-between items-start mb-8">
                     <div className="p-4 bg-brand-600/10 rounded-2xl group-hover:bg-brand-600 transition-all duration-500">
                       <FileText className="w-6 h-6 text-brand-400 group-hover:text-white" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] font-mono">{p.status || 'Verified'}</span>
                   </div>
                   <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 font-display">{p.title}</h3>
                   <p className="text-zinc-400 text-sm mb-8 flex items-center gap-2 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-brand-500/50" /> 
                      {p.subjectId?.name || 'Unclassified Domain'}
                   </p>
                   
                   <div className="flex justify-between items-center pt-6 border-t border-whisper-border">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-black">{p.totalMarks} Points</span>
                      <button className="text-brand-400 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                   </div>
                 </motion.div>
              ))}
           </motion.div>
        )}
      </AnimatePresence>
       </div>
    </div>
  );
};

export default TeacherDashboard;
