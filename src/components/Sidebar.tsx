import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { PlayCircle, X, CalendarClock, CalendarDays, Calendar } from "lucide-react";

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const links = [
    { to: "/today", label: "مباريات اليوم", icon: CalendarClock },
    { to: "/tomorrow", label: "مباريات الغد", icon: CalendarDays },
    { to: "/all", label: "جميع المباريات", icon: Calendar },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 transform border-l border-slate-800/60 bg-slate-950/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800/50 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
              <PlayCircle className="h-7 w-7" />
            </div>
            <span className="font-tajawal text-2xl font-black tracking-tight text-white drop-shadow-sm">
              يلا <span className="text-emerald-400">لايف</span>
            </span>
          </div>
          <button onClick={onClose} className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8 scrollbar-hide">
          <h3 className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-500/80">
            تصفح المباريات
          </h3>
          
          <nav className="space-y-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      isActive ? "scale-110" : "opacity-70 group-hover:scale-110 group-hover:opacity-100"
                    )} />
                    {link.label}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
