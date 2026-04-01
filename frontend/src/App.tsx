import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Zap, Shield, Layers } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PaperView from './pages/PaperView';
import AssessmentTerminal from './pages/AssessmentTerminal';
import { motion } from 'framer-motion';
import DashboardLayout from './layouts/DashboardLayout';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const HomePage = () => {
  const { user } = useAuth();
  if (user) {
     if (user.role === 'admin') return <Navigate to="/admin" />;
     if (user.role === 'teacher') return <Navigate to="/teacher" />;
     return <Navigate to="/student" />;
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-slate-950 font-sans selection:bg-brand-500/30">
      
      {/* Dynamic Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full filter blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[180px] animate-pulse"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full p-8 sm:p-20 text-center relative z-10 mx-4"
      >
        <motion.div
           initial={{ scale: 0, rotate: -12 }}
           animate={{ scale: 1, rotate: 12 }}
           transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
           className="h-24 w-24 bg-brand-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-brand-600/40 mb-12"
        >
           <BookOpen className="w-12 h-12 text-white" />
        </motion.div>
        
        <div className="stagger-reveal">
           <h1 className="text-hero text-white mb-8 tracking-tighter leading-[0.9]">
              Automated<br/>
              <span className="text-brand-500">Intelligence.</span>
           </h1>
           
           <p className="text-zinc-400 mb-16 text-2xl max-w-3xl mx-auto leading-relaxed font-light">
             Orchestrate academic assessments with a clinical, high-performance management core. Built for the modern educational grid.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
             <Link to="/login" className="btn-pro-primary h-20 px-16 text-2xl group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                   Access Portal
                   <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
             </Link>
             <Link to="/register" className="text-zinc-500 hover:text-white transition-colors font-black text-xs uppercase tracking-[0.3em] font-mono border-b border-transparent hover:border-brand-500 pb-2">
                Deploy Institutional Account
             </Link>
           </div>
        </div>

        {/* Feature Grid - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 text-left stagger-reveal">
           <div className="space-y-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl border border-whisper-border flex items-center justify-center">
                 <Zap className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-xl font-black text-white font-display">Generation Engine</h3>
              <p className="text-zinc-500 font-light leading-relaxed">Algorithmic synthesis of question papers based on complexity matrices and subject density.</p>
           </div>
           <div className="space-y-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl border border-whisper-border flex items-center justify-center">
                 <Shield className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-xl font-black text-white font-display">Secure Archives</h3>
              <p className="text-zinc-500 font-light leading-relaxed">End-to-end encrypted storage of intellectual assets and examination blueprints.</p>
           </div>
           <div className="space-y-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl border border-whisper-border flex items-center justify-center">
                 <Layers className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-xl font-black text-white font-display">Unified Registry</h3>
              <p className="text-zinc-500 font-light leading-relaxed">Role-based access control for students, educators, and system administrators.</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teacher" element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/paper/:id" element={
              <ProtectedRoute>
                <PaperView />
              </ProtectedRoute>
            } />
            <Route path="/exam/:id" element={
              <ProtectedRoute role="student">
                <AssessmentTerminal />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
