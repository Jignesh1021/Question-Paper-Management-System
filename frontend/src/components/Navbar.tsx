import React from 'react';
import { LogOut, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="h-20 bg-slate-950/40 backdrop-blur-3xl border-b border-whisper-border px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
      
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-8 flex-1 max-w-xl">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-3 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-2xl border border-whisper-border"
        >
           <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden sm:block flex-1 relative group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Global operational search..." 
            className="w-full bg-zinc-950/30 border border-whisper-border rounded-[1.25rem] py-3.5 pl-16 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-500 placeholder:text-zinc-600 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-10">
        <div className="flex items-center gap-4">
           <motion.button 
             whileHover={{ scale: 1.1, y: -2 }}
             whileTap={{ scale: 0.9 }}
             className="relative p-3 text-zinc-500 hover:text-white transition-all bg-white/[0.02] border border-whisper-border rounded-xl"
           >
             <Bell className="h-5 w-5" />
             <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-brand-500 rounded-full border-2 border-slate-950 shadow-sm shadow-brand-500/50 animate-pulse"></span>
           </motion.button>
        </div>
        
        <div className="h-10 w-px bg-whisper-border mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-5 group cursor-default">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-white group-hover:text-brand-400 transition-colors font-display tracking-tight">{user.name}</p>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] font-mono mt-1">{user.role}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl border border-whisper-border p-0.5 group-hover:border-brand-500/50 transition-all duration-500 shadow-inner">
             <div className="h-full w-full rounded-[14px] bg-zinc-900 flex items-center justify-center font-black text-xs text-brand-400 uppercase">
                {user.name.split(' ').map((n:any) => n[0]).slice(0,2).join('')}
             </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          className="p-3 text-zinc-600 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10"
          title="Terminate Session"
        >
          <LogOut className="h-5 w-5" />
        </motion.button>
      </div>
    </header>
  );
};

export default Navbar;
