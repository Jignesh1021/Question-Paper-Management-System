import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30 overflow-hidden relative">
      
      {/* Background Ambience - Global */}
      <div className="fixed inset-0 cyber-grid opacity-[0.03] pointer-events-none"></div>
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[180px] animate-pulse pointer-events-none"></div>

      {/* Sidebar Managed with responsive state */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10 lg:ml-80">
        {/* Navbar with toggle for mobile */}
        <Navbar onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
