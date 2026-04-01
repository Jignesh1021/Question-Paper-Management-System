import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, UserPlus, ChevronRight, Mail, Lock, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(response.data);
      if (response.data.role === 'admin') navigate('/admin');
      else if (response.data.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Provisioning sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row-reverse bg-[#020617] font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Form Pane (Right Side - 50%) */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative bg-[#09090b] z-20 border-l border-whisper-border/20 shadow-[-10px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto">
         
         <div className="absolute top-8 left-8 flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-[1rem] flex items-center justify-center shadow-lg shadow-indigo-600/20 -rotate-3">
               <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
               <h2 className="text-lg font-black text-white tracking-widest font-display">NEXUS</h2>
               <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.3em] font-mono leading-none mt-1">Systems Core</p>
            </div>
         </div>

         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-sm mx-auto space-y-10 mt-20 lg:mt-0"
         >
            <div>
               <h2 className="text-4xl font-black text-[#f8fafc] mb-3 tracking-tight font-display">Initialize Profile.</h2>
               <p className="text-[#94a3b8] font-light">Deploy your institutional credentials.</p>
            </div>

            <AnimatePresence>
               {error && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-3"
                 >
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></div>
                    {error}
                 </motion.div>
               )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-6">
                  <div className="group relative">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94a3b8] mb-3 block font-mono">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                           type="text" 
                           className="w-full bg-[#020617] border border-whisper-border/30 text-[#f8fafc] rounded-2xl pl-16 pr-6 h-14 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm placeholder:text-zinc-700" 
                           placeholder="Jignesh More"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           required 
                        />
                     </div>
                  </div>

                  <div className="group relative">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94a3b8] mb-3 block font-mono">Mail Identity</label>
                     <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                           type="email" 
                           className="w-full bg-[#020617] border border-whisper-border/30 text-[#f8fafc] rounded-2xl pl-16 pr-6 h-14 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm placeholder:text-zinc-700" 
                           placeholder="operator@nexus.io"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           required 
                        />
                     </div>
                  </div>

                  <div className="group relative">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94a3b8] mb-3 block font-mono">Secret Phrase</label>
                     <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                           type="password" 
                           className="w-full bg-[#020617] border border-whisper-border/30 text-[#f8fafc] rounded-2xl pl-16 pr-6 h-14 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm placeholder:text-zinc-700" 
                           placeholder="••••••••"
                           value={formData.password}
                           onChange={(e) => setFormData({...formData, password: e.target.value})}
                           required 
                        />
                     </div>
                  </div>

                  <div className="group relative">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94a3b8] mb-3 block font-mono">Institutional Tier</label>
                     <select 
                        className="w-full bg-[#020617] border border-whisper-border/30 text-[#f8fafc] rounded-2xl px-6 h-14 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm appearance-none" 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                     >
                        <option value="student">Student Account</option>
                        <option value="teacher">Educator Account</option>
                        <option value="admin">Administrator</option>
                     </select>
                  </div>
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-14 text-lg font-black group flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20 active:translate-y-[1px]"
               >
                  {isLoading ? 'Processing...' : 'Deploy Credentials'}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
               </button>

               <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-whisper-border/20"></div></div>
                  <span className="relative px-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 bg-[#09090b]">Federated O-Auth</span>
               </div>

               <button 
                  type="button"
                  onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                  className="w-full bg-[#020617] border border-whisper-border/40 hover:border-indigo-500/40 text-[#f8fafc] rounded-2xl h-14 flex items-center justify-center gap-3 transition-all group"
               >
                  <svg className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                     <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="font-display font-bold tracking-wide text-sm">Enroll via Google</span>
               </button>
            </form>

            <div className="pt-4 pb-8">
               <p className="text-[#94a3b8] text-xs font-mono">
                  Identity established? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-all underline decoration-indigo-400/30 underline-offset-4">Force Verification</Link>
               </p>
            </div>
         </motion.div>
      </div>

      {/* Visual Canvas (Left Side - 50%) */}
      <div className="hidden lg:flex w-full lg:w-1/2 relative flex-col justify-center p-24 overflow-hidden bg-[#020617]">
         <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
         
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
           className="relative z-10 max-w-2xl"
         >
            <div className="flex items-center gap-4 mb-8">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
               <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] font-mono">Provisioning Matrix</span>
            </div>
            
            <h1 className="text-[5.5rem] font-black text-[#f8fafc] tracking-tighter leading-[0.9] font-display mb-10">
               Initialize<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">The Core.</span>
            </h1>
            
            <p className="text-[#94a3b8] text-2xl font-light leading-relaxed max-w-xl">
               Deploy your institutional profile to the cloud. Join the next-generation of automated examination intelligence.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-16 max-w-lg">
               <div>
                  <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-whisper-border/10">
                     <UserPlus className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 font-display">Delegated</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">Establish your operational hierarchy with role-based policies.</p>
               </div>
               <div>
                  <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-whisper-border/10">
                     <Shield className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 font-display">Vaulted</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">Cryptographically secure storage for assessment assets.</p>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default Register;
