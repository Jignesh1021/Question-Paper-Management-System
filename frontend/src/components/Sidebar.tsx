import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  PlusCircle, 
  Database,
  LogOut,
  FileSignature,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getMenuItems = () => [
    { label: 'Dashboard', icon: LayoutDashboard, path: user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student', roles: ['admin', 'teacher', 'student'] },
    { label: 'Subjects', icon: BookOpen, path: '/admin?tab=subjects', roles: ['admin'] },
    { label: 'Users', icon: Users, path: '/admin?tab=users', roles: ['admin'] },
    { label: 'Question Bank', icon: Database, path: '/teacher?tab=bank', roles: ['teacher'] },
    { label: 'Generate Paper', icon: PlusCircle, path: '/teacher?tab=generate', roles: ['teacher'] },
    { label: 'My Papers', icon: FileSignature, path: '/teacher?tab=papers', roles: ['teacher'] },
    { label: 'My Assessments', icon: FileSignature, path: '/student?tab=assessments', roles: ['student'] },
    { label: 'Settings', icon: Settings, path: '#', roles: ['admin', 'teacher', 'student'] },
  ].filter(item => item.roles.includes(user.role));

  const isActive = (itemPath: string) => {
    const currentPath = location.pathname + location.search;
    if (currentPath === itemPath) return true;
    if (location.pathname === '/admin' && location.search === '') {
      if (itemPath === '/admin' || itemPath === '/admin?tab=subjects') return true;
    }
    if (location.pathname === '/teacher' && location.search === '') {
      if (itemPath === '/teacher' || itemPath === '/teacher?tab=bank') return true;
    }
    if (location.pathname === '/student' && location.search === '') {
      if (itemPath === '/student' || itemPath === '/student?tab=assessments') return true;
    }
    return false;
  };

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-950 border-r border-whisper-border transform transition-transform duration-500 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Content */}
        <div className="h-full flex flex-col relative overflow-hidden">
          
          {/* Logo Section */}
          <div className="p-8 pb-12 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-600/30 -rotate-6">
                   <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h2 className="text-xl font-black text-white tracking-widest font-display">NEXUS</h2>
                   <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] font-mono">Systems Core</p>
                </div>
             </div>
             <button onClick={onClose} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
             </button>
          </div>

          {/* Navigation Registry */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
             <div className="px-4 py-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 font-mono">Operational Modules</p>
                <div className="space-y-1.5">
                   {getMenuItems().map((item, idx) => (
                      <motion.div
                         key={item.label}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: idx * 0.05 }}
                      >
                         <Link
                            to={item.path}
                            onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${
                               isActive(item.path)
                                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20 shadow-lg shadow-brand-500/5' 
                                  : 'text-zinc-500 hover:bg-white/[0.03] hover:text-white border border-transparent'
                            }`}
                         >
                            <item.icon className={`h-5 w-5 transition-colors ${isActive(item.path) ? 'text-brand-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                            {item.label}
                            {isActive(item.path) && (
                               <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm shadow-brand-500/50" />
                            )}
                         </Link>
                      </motion.div>
                   ))}
                </div>
             </div>
          </nav>

          {/* Status Deck */}
          <div className="p-6 mt-auto space-y-4">
             <div className="bg-zinc-900/40 rounded-3xl p-6 border border-whisper-border relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-500/10 transition-all duration-700"></div>
                <div className="relative z-10 flex items-center gap-4">
                   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                   <div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">Core Health</p>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Synchronized</p>
                   </div>
                </div>
             </div>
             <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-4 text-zinc-500 hover:text-red-400 font-bold transition-all rounded-2xl hover:bg-white/5 border border-transparent hover:border-red-500/10"
             >
                <LogOut className="h-5 w-5" />
                <span className="font-display uppercase text-[10px] tracking-widest font-black">Terminate Session</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}></div>
      )}
    </>
  );
};

export default Sidebar;
