import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Loader, 
  Users, 
  BookOpen,
  UserPlus,
  Trash2,
  Edit,
  Plus,
  Network,
  ShieldAlert,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'subjects' | 'users' | 'topics' | 'qa' | 'batches') || 'subjects';
  
  const setActiveTab = (tab: 'subjects' | 'users' | 'topics' | 'qa' | 'batches') => {
    setSearchParams({ tab });
  };
  const [subjects, setSubjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [pendingQs, setPendingQs] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [topicName, setTopicName] = useState('');
  const [topicSubjectId, setTopicSubjectId] = useState('');
  const [batchName, setBatchName] = useState('');
  const [batchDesc, setBatchDesc] = useState('');
  const [subjectBatches, setSubjectBatches] = useState<string[]>([]);
  const [userData, setUserData] = useState({ name: '', email: '', password: '', role: 'student', batchId: '', teacherBatches: [] as string[] });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, userRes, topicRes, qRes, batchRes] = await Promise.all([
        axios.get('http://localhost:5000/api/subjects', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/topics', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/questions?status=Pending', { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get('http://localhost:5000/api/batches', { headers: { Authorization: `Bearer ${user?.token}` } })
      ]);
      setSubjects(subRes.data);
      setUsers(userRes.data);
      setTopics(topicRes.data);
      setPendingQs(qRes.data);
      setBatches(batchRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subjects', { name, code, batches: subjectBatches }, { headers: { Authorization: `Bearer ${user?.token}` } });
      fetchData();
      setName(''); setCode(''); setSubjectBatches([]);
    } catch (error) { console.error(error); }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/topics', { name: topicName, subjectId: topicSubjectId }, { headers: { Authorization: `Bearer ${user?.token}` } });
      fetchData();
      setTopicName('');
    } catch (error) { console.error(error); }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register-by-admin', userData, { headers: { Authorization: `Bearer ${user?.token}` } });
      fetchData();
      setUserData({ name: '', email: '', password: '', role: 'student', batchId: '', teacherBatches: [] });
    } catch (error) { console.error(error); }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/batches', { name: batchName, description: batchDesc }, { headers: { Authorization: `Bearer ${user?.token}` } });
      fetchData();
      setBatchName('');
      setBatchDesc('');
    } catch (error) { console.error(error); }
  };

  const handleUpdateQStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await axios.patch(`http://localhost:5000/api/questions/${id}/status`, { status }, { headers: { Authorization: `Bearer ${user?.token}` } });
      fetchData();
    } catch (error) { console.error(error); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader className="text-brand-500 w-12 h-12" />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in relative cyber-grid-container px-2 pb-20">
       <div className="absolute inset-0 cyber-grid opacity-[0.02] pointer-events-none"></div>
       
       <div className="relative z-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 stagger-reveal">
            <div>
               <div className="flex items-center gap-3 mb-4 text-brand-500">
                  <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></div>
                  <span className="font-black uppercase tracking-[0.3em] text-[10px] font-mono">System Core // Active</span>
               </div>
               <h1 className="text-hero text-white mb-4">Control Plane.</h1>
               <p className="text-zinc-400 text-xl font-light max-w-xl leading-relaxed">
                  Orchestrate subjects, manage user access levels, and monitor system-wide assessment density.
               </p>
            </div>

            <div className="flex bg-zinc-950/50 p-1.5 rounded-3xl border border-whisper-border backdrop-blur-3xl">
               <button 
                 onClick={() => setActiveTab('subjects')}
                 className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'subjects' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
               >
                 <BookOpen className="w-4 h-4" /> Subjects
               </button>
               <button 
                 onClick={() => setActiveTab('users')}
                 className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
               >
                 <Users className="w-4 h-4" /> User Registry
               </button>
               <button 
                 onClick={() => setActiveTab('batches')}
                 className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'batches' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
               >
                 <Network className="w-4 h-4" /> Batches
               </button>
               <button 
                 onClick={() => setActiveTab('topics')}
                 className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'topics' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
               >
                 <Network className="w-4 h-4" /> Topics
               </button>
               <button 
                 onClick={() => setActiveTab('qa')}
                 className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'qa' ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
               >
                 <ShieldAlert className="w-4 h-4" /> QA Queue {pendingQs.length > 0 && <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] ml-2 animate-pulse">{pendingQs.length}</span>}
               </button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
               {/* Sidebar Forms */}
               <div className="w-full xl:w-96 flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {activeTab === 'subjects' ? (
                      <motion.div 
                        key="sub-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="pro-card sticky top-24"
                      >
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 font-display">
                           <Plus className="w-5 h-5 text-brand-500" /> New Subject
                        </h3>
                        <form onSubmit={handleAddSubject} className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Domain Name</label>
                            <input className="input-pro" placeholder="e.g. Quantum Computing" value={name} onChange={e => setName(e.target.value)} required />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Code ID</label>
                            <input className="input-pro font-mono text-brand-400 font-black" placeholder="e.g. QC101" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Bound Batches</label>
                            <select multiple className="input-pro text-xs h-24" value={subjectBatches} onChange={e => {
                               const options = Array.from(e.target.selectedOptions, option => option.value);
                               setSubjectBatches(options);
                            }} required>
                               {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                          </div>
                          <button type="submit" className="btn-pro-primary w-full py-5 text-sm uppercase tracking-widest">Register Domain</button>
                        </form>
                      </motion.div>
                    ) : activeTab === 'topics' ? (
                      <motion.div 
                        key="topic-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="pro-card sticky top-24"
                      >
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 font-display">
                           <Network className="w-5 h-5 text-brand-500" /> New Topic
                        </h3>
                        <form onSubmit={handleAddTopic} className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Select Domain</label>
                            <select className="input-pro text-xs" value={topicSubjectId} onChange={e => setTopicSubjectId(e.target.value)} required>
                              <option value="">-- Choose Subject --</option>
                              {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Topic Name</label>
                            <input className="input-pro" placeholder="e.g. Thermodynamics" value={topicName} onChange={e => setTopicName(e.target.value)} required />
                          </div>
                          <button type="submit" className="btn-pro-primary w-full py-5 text-sm uppercase tracking-widest">Add Node</button>
                        </form>
                      </motion.div>
                    ) : activeTab === 'users' ? (
                      <motion.div 
                        key="user-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="pro-card sticky top-24"
                      >
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 font-display">
                           <UserPlus className="w-5 h-5 text-brand-500" /> New Operator
                        </h3>
                        <form onSubmit={handleAddUser} className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Full Name</label>
                            <input className="input-pro" placeholder="Full name..." value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} required />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Mail Address</label>
                            <input className="input-pro font-mono" placeholder="email@nexus.io" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Secret</label>
                              <input className="input-pro" type="password" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} required />
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Tier</label>
                              <select className="input-pro text-xs" value={userData.role} onChange={e => setUserData({...userData, role: e.target.value, batchId: '', teacherBatches: []})}>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          </div>
                          
                          {userData.role === 'student' && (
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Primary Batch Assignment</label>
                               <select className="input-pro text-xs" value={userData.batchId} onChange={e => setUserData({...userData, batchId: e.target.value})} required>
                                  <option value="">-- Assign to Batch --</option>
                                  {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                               </select>
                            </div>
                          )}
                          
                          {userData.role === 'teacher' && (
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Authorized Batches (Multi-Select)</label>
                               <select multiple className="input-pro text-xs h-24" value={userData.teacherBatches} onChange={e => {
                                  const options = Array.from(e.target.selectedOptions, option => option.value);
                                  setUserData({...userData, teacherBatches: options});
                               }} required>
                                  {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                               </select>
                            </div>
                          )}

                          <button type="submit" className="btn-pro-primary w-full py-5 text-sm uppercase tracking-widest">Enroll Operator</button>
                        </form>
                      </motion.div>
                    ) : activeTab === 'batches' ? (
                      <motion.div 
                        key="batch-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="pro-card sticky top-24"
                      >
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 font-display">
                           <Network className="w-5 h-5 text-brand-500" /> New Batch
                        </h3>
                        <form onSubmit={handleAddBatch} className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Batch Identifier</label>
                            <input className="input-pro" placeholder="e.g. CS-SEM-1" value={batchName} onChange={e => setBatchName(e.target.value.toUpperCase())} required />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 block font-mono">Description</label>
                            <input className="input-pro" placeholder="Computer Science 1st Sem" value={batchDesc} onChange={e => setBatchDesc(e.target.value)} />
                          </div>
                          <button type="submit" className="btn-pro-primary w-full py-5 text-sm uppercase tracking-widest">Deploy Batch</button>
                        </form>
                      </motion.div>
                    ) : activeTab === 'qa' ? (
                      <div className="pro-card sticky top-24 bg-brand-500/5 border-brand-500/20">
                         <h3 className="text-xl font-black text-brand-400 mb-4 flex items-center gap-3 font-display">
                            <ShieldAlert className="w-5 h-5" /> Moderation Queue
                         </h3>
                         <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            Questions submitted by Teachers must be approved here before they can be deployed via the Generator Engine.
                         </p>
                         <div className="flex gap-4 items-center p-4 bg-zinc-950/50 rounded-2xl border border-whisper-border">
                            <div className="text-2xl font-black text-white">{pendingQs.length}</div>
                            <div className="text-xs uppercase tracking-widest text-zinc-500 font-black">Pending<br/>Review</div>
                         </div>
                      </div>
                    ) : null}
                  </AnimatePresence>
               </div>

               {/* Main Content Area */}
               <div className="flex-1 space-y-8 min-w-0">
                  <div className="flex flex-col sm:flex-row gap-6">
                     <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                        <input type="text" placeholder="Search operational registry..." className="input-pro pl-16 py-5" />
                     </div>
                  </div>

                  <div className="pro-table-container">
                    <table className="pro-table">
                    <thead>
                      <tr>
                        {activeTab === 'subjects' ? (
                          <>
                            <th className="w-16">#</th>
                            <th>Title / Domain</th>
                            <th>Nexus Code</th>
                            <th>Registered Batches</th>
                            <th className="text-right">Actions</th>
                          </>
                        ) : activeTab === 'topics' ? (
                          <>
                            <th className="w-16">#</th>
                            <th>Topic Matrix Component</th>
                            <th>Parent Domain</th>
                            <th className="text-right">Actions</th>
                          </>
                        ) : activeTab === 'batches' ? (
                          <>
                            <th className="w-16">#</th>
                            <th>Batch Deployment</th>
                            <th>Descriptor Map</th>
                            <th className="text-right">Actions</th>
                          </>
                        ) : activeTab === 'qa' ? (
                          <>
                            <th className="w-16">#</th>
                            <th>Submitted Inquiry</th>
                            <th>Author / Domain</th>
                            <th className="text-right">Approve / Reject</th>
                          </>
                        ) : (
                          <>
                            <th>User Profile / Tier</th>
                            <th>Credentialed Mail</th>
                            <th>Access level</th>
                            <th className="text-right">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === 'subjects' ? subjects.map((sub, idx) => (
                        <tr key={sub._id} className="group hover:bg-white/[0.02]">
                          <td><span className="text-zinc-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span></td>
                          <td className="font-black text-white font-display text-lg">{sub.name}</td>
                          <td className="text-xs font-black text-brand-400 font-mono uppercase tracking-[0.3em]">{sub.code}</td>
                          <td>
                             <div className="flex flex-wrap gap-2">
                               {sub.batches && sub.batches.map((b:any) => (
                                 <span key={b._id} className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 border border-brand-500/20 bg-brand-500/10 text-brand-400 rounded font-mono">
                                   {b.name}
                                 </span>
                               ))}
                             </div>
                          </td>
                          <td className="text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button className="p-2 text-zinc-500 hover:text-white"><Edit className="w-5 h-5" /></button>
                                <button className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                             </div>
                          </td>
                        </tr>
                      )) : activeTab === 'topics' ? topics.map((top, idx) => (
                        <tr key={top._id} className="group hover:bg-white/[0.02]">
                          <td><span className="text-zinc-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span></td>
                          <td className="font-black text-white font-display text-lg">{top.name}</td>
                          <td className="text-xs font-black text-indigo-400 font-mono uppercase tracking-[0.2em]">{top.subjectId?.name || 'Unknown'}</td>
                          <td className="text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                             </div>
                          </td>
                        </tr>
                      )) : activeTab === 'batches' ? batches.map((bt, idx) => (
                        <tr key={bt._id} className="group hover:bg-white/[0.02]">
                          <td><span className="text-zinc-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span></td>
                          <td className="font-black text-white font-display text-lg tracking-widest">{bt.name}</td>
                          <td className="text-xs font-black text-brand-400 font-mono">{bt.description || 'N/A'}</td>
                          <td className="text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button className="p-2 text-zinc-500 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                             </div>
                          </td>
                        </tr>
                      )) : activeTab === 'qa' ? pendingQs.map((q, idx) => (
                        <tr key={q._id} className="group hover:bg-brand-500/[0.02]">
                          <td><span className="text-brand-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span></td>
                          <td>
                             <p className="font-black text-white font-display text-lg line-clamp-2">{q.text}</p>
                             <div className="flex gap-2 mt-2">
                                <span className="text-[9px] font-black uppercase text-zinc-500 border border-whisper-border px-2 py-0.5 rounded font-mono">{q.type}</span>
                                <span className="text-[9px] font-black uppercase text-zinc-500 border border-whisper-border px-2 py-0.5 rounded font-mono">{q.marks} PTS</span>
                                <span className="text-[9px] font-black uppercase text-zinc-500 border border-whisper-border px-2 py-0.5 rounded font-mono">{q.difficulty}</span>
                             </div>
                          </td>
                          <td>
                             <p className="text-sm font-black text-brand-400 font-display">{q.createdBy?.name || 'Unknown'}</p>
                             <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{q.subjectId?.name}</p>
                          </td>
                          <td className="text-right">
                             <div className="flex justify-end gap-3">
                                <button onClick={() => handleUpdateQStatus(q._id, 'Approved')} className="p-3 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-xl transition-all border border-emerald-500/20"><CheckCircle className="w-5 h-5" /></button>
                                <button onClick={() => handleUpdateQStatus(q._id, 'Rejected')} className="p-3 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-rose-500/20"><XCircle className="w-5 h-5" /></button>
                             </div>
                          </td>
                        </tr>
                      )) : users.map((usr) => (
                        <tr key={usr._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td>
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-whisper-border flex items-center justify-center font-black text-[10px] text-brand-400">
                                  {usr.name.split(' ').map((n:any) => n[0]).join('')}
                               </div>
                               <p className="font-black text-white font-display">{usr.name}</p>
                            </div>
                          </td>
                          <td>
                             <p className="text-zinc-400 font-mono text-sm italic">{usr.email}</p>
                             {usr.role === 'student' && usr.batchId && <p className="text-[10px] text-brand-500 uppercase font-black tracking-widest mt-1">Primary: {usr.batchId.name}</p>}
                          </td>
                          <td>
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border font-mono ${usr.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : usr.role === 'teacher' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                {usr.role}
                             </span>
                          </td>
                          <td className="text-right">
                             <button className="p-2 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
               </div>
          </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
