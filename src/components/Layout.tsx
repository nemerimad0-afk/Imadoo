import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu, PlayCircle } from "lucide-react";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />
      <div className="fixed top-[-20%] left-[-10%] z-0 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] z-0 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none mix-blend-screen" />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className="flex h-20 items-center justify-between border-b border-slate-800/50 bg-slate-950/50 px-6 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
              <PlayCircle className="h-6 w-6" />
            </div>
            <span className="font-tajawal text-xl font-black tracking-tight text-white drop-shadow-sm">
              يلا <span className="text-emerald-400">لايف</span>
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center rounded-xl p-2.5 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors border border-transparent hover:border-slate-700/50"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 relative">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
