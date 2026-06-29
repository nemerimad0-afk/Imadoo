import { Link } from "react-router-dom";
import { Match } from "../types";
import { getImageUrl } from "../lib/api";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Play } from "lucide-react";
import { cn } from "../lib/utils";

export function MatchCard({ match, sportId }: { match: Match; sportId: string }) {
  const isLive = Math.abs(Date.now() - match.date) < 2 * 60 * 60 * 1000; // Rough estimate of live (within 2 hours)
  const isUpcoming = match.date > Date.now();

  return (
    <Link 
      to={`/match/${sportId}/${match.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-emerald-500/30 hover:bg-slate-800 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              مباشر
            </span>
          )}
          {match.popular && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500">
              🔥 قمة
            </span>
          )}
        </div>
        
        <span className="text-xs font-medium text-slate-400">
          {format(new Date(match.date), "EEEE, p", { locale: ar })}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 p-3 shadow-inner">
            {match.teams.home.badge ? (
              <img 
                src={getImageUrl(match.teams.home.badge, true)} 
                alt={match.teams.home.name}
                className="h-full w-full object-contain drop-shadow-md"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg=='; // shield icon fallback
                }}
              />
            ) : (
              <div className="h-8 w-8 text-slate-500" /> // fallback
            )}
          </div>
          <span className="font-tajawal text-sm font-bold text-slate-200 line-clamp-2">
            {match.teams.home.name}
          </span>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center px-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-xs font-bold text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            VS
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 p-3 shadow-inner">
            {match.teams.away.badge ? (
              <img 
                src={getImageUrl(match.teams.away.badge, true)} 
                alt={match.teams.away.name}
                className="h-full w-full object-contain drop-shadow-md"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg==';
                }}
              />
            ) : (
              <div className="h-8 w-8 text-slate-500" />
            )}
          </div>
          <span className="font-tajawal text-sm font-bold text-slate-200 line-clamp-2">
            {match.teams.away.name}
          </span>
        </div>
      </div>
      
      {/* Play button overlay that appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-100">
          <Play className="h-6 w-6 ml-1" fill="currentColor" />
        </div>
      </div>
    </Link>
  );
}
