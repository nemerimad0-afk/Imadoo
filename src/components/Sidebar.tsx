import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getSports } from "../lib/api";
import { Sport } from "../types";
import { cn } from "../lib/utils";
import { Activity, Trophy, Menu, X, PlayCircle, Loader2 } from "lucide-react";

// Helper to translate common sports to Arabic
const sportTranslations: Record<string, string> = {
  football: "كرة القدم",
  basketball: "كرة السلة",
  tennis: "تنس",
  "motor-sports": "رياضة المحركات",
  fight: "فنون القتال",
  rugby: "رجبي",
  golf: "جولف",
  baseball: "بيسبول",
  hockey: "هوكي",
  cricket: "كريكت",
  "american-football": "كرة قدم أمريكية",
  billiards: "بلياردو",
  darts: "رمي السهام",
  afl: "كرة قدم أسترالية"
};

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSports()
      .then((data) => setSports(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          "fixed top-0 right-0 z-50 h-full w-72 transform border-l border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <PlayCircle className="h-6 w-6" />
            </div>
            <span className="font-tajawal text-xl font-bold tracking-tight text-white">
              يلا <span className="text-emerald-500">لايف</span>
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 scrollbar-hide">
          <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            الرياضات المتاحة
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : (
            <nav className="space-y-1">
              {sports.map((sport) => (
                <NavLink
                  key={sport.id}
                  to={`/sport/${sport.id}`}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )
                  }
                >
                  <Trophy className="h-4 w-4 opacity-70" />
                  {sportTranslations[sport.id] || sport.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}
