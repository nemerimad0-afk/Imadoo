import { Link } from "react-router-dom";
import { Match } from "../types";
import { getImageUrl } from "../lib/api";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Play } from "lucide-react";

export function MatchCard({ match, sportId }: { match: Match; sportId: string }) {
  const isLive = Math.abs(Date.now() - match.date) < 2 * 60 * 60 * 1000; // Rough estimate of live (within 2 hours)

  return (
    <Link 
      to={`/match/${match.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/40 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/30 hover:bg-slate-900/80 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)]"
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </span>
              مباشر الآن
            </span>
          )}
          {match.popular && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500 shadow-inner">
              <span className="text-sm">🔥</span> قمة
            </span>
          )}
        </div>
        
        <span className="rounded-full bg-slate-800/50 px-3 py-1.5 text-xs font-bold text-slate-300">
          {format(new Date(match.date), "EEEE, p", { locale: ar })}
        </span>
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Home Team */}
        <div className="flex flex-1 flex-col items-center gap-4 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-lg shadow-black/50 transition-transform duration-500 group-hover:scale-110">
            {match.teams.home.badge ? (
              <img 
                src={getImageUrl(match.teams.home.badge, true)} 
                alt={match.teams.home.name}
                className="h-full w-full object-contain drop-shadow-md"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg=='; // shield icon fallback
                }}
              />
            ) : (
              <div className="h-10 w-10 text-slate-500" /> // fallback
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
          <span className="font-tajawal text-base font-black text-white line-clamp-2 leading-tight">
            {match.teams.home.name}
          </span>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 font-black text-slate-400 backdrop-blur-sm transition-colors duration-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            VS
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-1 flex-col items-center gap-4 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-lg shadow-black/50 transition-transform duration-500 group-hover:scale-110">
            {match.teams.away.badge ? (
              <img 
                src={getImageUrl(match.teams.away.badge, true)} 
                alt={match.teams.away.name}
                className="h-full w-full object-contain drop-shadow-md"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg==';
                }}
              />
            ) : (
              <div className="h-10 w-10 text-slate-500" />
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
          </div>
          <span className="font-tajawal text-base font-black text-white line-clamp-2 leading-tight">
            {match.teams.away.name}
          </span>
        </div>
      </div>
      
      {/* Play button overlay that appears on hover */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-950/60 opacity-0 backdrop-blur-[4px] transition-all duration-500 group-hover:opacity-100">
        <div className="flex h-16 w-16 scale-50 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 transition-transform duration-500 ease-out group-hover:scale-100">
          <Play className="h-8 w-8 ml-1" fill="currentColor" />
        </div>
      </div>
    </Link>
  );
}
