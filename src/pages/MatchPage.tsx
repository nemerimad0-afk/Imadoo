import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMatches, getStreams, getImageUrl } from "../lib/api";
import { Match, Stream } from "../types";
import { Loader2, ArrowRight, MonitorPlay, AlertCircle, PlayCircle, Trophy, Home } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "../lib/utils";

export default function MatchPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!matchId) return;

    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch match details
        const matches = await getMatches("football");
        const foundMatch = matches.find((m) => m.id === matchId);
        
        if (!foundMatch) {
          setError("المباراة غير موجودة أو انتهت.");
          return;
        }
        
        setMatch(foundMatch);

        // 2. Fetch streams from all sources
        if (foundMatch.sources && foundMatch.sources.length > 0) {
          const streamPromises = foundMatch.sources.map(source => 
            getStreams(source.source, source.id).catch(() => [] as Stream[])
          );
          const results = await Promise.all(streamPromises);
          const allStreams = results.flat();
          
          if (allStreams && allStreams.length > 0) {
            // Sort to prefer Arabic and HD
            const sorted = [...allStreams].sort((a, b) => {
              if (a.language.includes("Arabic") && !b.language.includes("Arabic")) return -1;
              if (!a.language.includes("Arabic") && b.language.includes("Arabic")) return 1;
              if (a.hd && !b.hd) return -1;
              if (!a.hd && b.hd) return 1;
              return 0;
            });
            setStreams(sorted);
            setActiveStream(sorted[0]);
          }
        }
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب تفاصيل المباراة.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="font-tajawal text-3xl font-black text-white">{error || "المباراة غير موجودة"}</h2>
        <Link to="/" className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all hover:-translate-y-1">
          <Home className="h-5 w-5" />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const isLive = Math.abs(Date.now() - match.date) < 2 * 60 * 60 * 1000;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Header Info */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[2rem] bg-slate-900/40 p-6 md:p-8 border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-sm">
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 md:gap-8 relative z-10">
          <button onClick={() => navigate(-1)} className="hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white transition-all shadow-sm hover:shadow-md border border-slate-700/50">
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-950/50 p-3 shadow-inner border border-slate-800/60 flex items-center justify-center">
                    <img 
                    src={getImageUrl(match.teams.home.badge, true)} 
                    alt={match.teams.home.name} 
                    className="h-full w-full object-contain drop-shadow-md"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg==';
                    }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 font-black text-slate-500 shadow-inner text-sm">VS</span>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-950/50 p-3 shadow-inner border border-slate-800/60 flex items-center justify-center">
                    <img 
                    src={getImageUrl(match.teams.away.badge, true)} 
                    alt={match.teams.away.name} 
                    className="h-full w-full object-contain drop-shadow-md"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg==';
                    }}
                    />
                </div>
            </div>
          </div>
          
          <div className="mr-2">
            <h1 className="font-tajawal text-2xl md:text-3xl font-black text-white leading-tight">
              {match.title}
            </h1>
            <p className="mt-2 text-sm md:text-base font-medium text-slate-400">
              {format(new Date(match.date), "EEEE, dd MMMM - p", { locale: ar })}
            </p>
          </div>
        </div>
        
        {isLive && (
          <div className="flex items-center gap-3 self-start md:self-auto rounded-full bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 ring-1 ring-red-500/20 shadow-lg shadow-red-500/5 relative z-10">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            </span>
            مباشر الآن
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Player Area */}
        <div className="flex-1 space-y-4">
          {window !== window.top && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 text-amber-500 flex items-start sm:items-center gap-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm sm:text-base font-medium font-tajawal leading-relaxed">
                يبدو أنك تتصفح من داخل نافذة مصغرة. إذا واجهت رسالة "Remove sandbox attributes"، يرجى فتح التطبيق في علامة تبويب جديدة بالضغط على زر (Open in new tab) أعلى يمين الشاشة.
              </p>
            </div>
          )}
          <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-slate-950 border border-slate-800/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
            {activeStream ? (
              <iframe 
                src={activeStream.embedUrl} 
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                scrolling="no"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-6 text-slate-500">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900/80">
                    <MonitorPlay className="h-10 w-10 opacity-50" />
                </div>
                <p className="font-tajawal text-xl font-medium">لا يوجد بث متاح حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Server List */}
        <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm h-full flex flex-col">
            <h3 className="mb-6 font-tajawal text-xl font-black text-white flex items-center gap-3">
              <PlayCircle className="h-6 w-6 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              سيرفرات البث
              <span className="mr-auto flex h-6 items-center justify-center rounded-full bg-slate-800 px-2.5 text-xs font-bold text-slate-400">
                {streams.length}
              </span>
            </h3>
            
            {streams.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-500 py-10">
                  <Trophy className="h-10 w-10 opacity-20" />
                  <p className="text-sm font-medium">لا توجد سيرفرات متاحة حالياً</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide pr-2 -mr-2 pb-2 h-[500px]">
                {streams.map((stream) => (
                  <button
                    key={`${stream.source}-${stream.id}-${stream.streamNo}`}
                    onClick={() => setActiveStream(stream)}
                    className={cn(
                      "group relative flex items-center justify-between rounded-2xl p-4 text-right transition-all duration-300",
                      activeStream?.streamNo === stream.streamNo && activeStream?.source === stream.source
                        ? "bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-slate-950/50 border border-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white"
                    )}
                  >
                    <div className="flex flex-col gap-1.5 z-10">
                      <span className="font-bold text-sm flex items-center gap-2">
                        سيرفر {stream.streamNo}
                        {stream.hd && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-emerald-400 shadow-inner">
                            HD
                          </span>
                        )}
                      </span>
                      <span className={cn(
                          "text-xs font-medium line-clamp-1 truncate ml-2 transition-colors",
                          activeStream?.streamNo === stream.streamNo && activeStream?.source === stream.source
                            ? "text-emerald-500/70"
                            : "text-slate-500 group-hover:text-slate-400"
                      )}>
                        {stream.language} • {stream.source}
                      </span>
                    </div>
                    {activeStream?.streamNo === stream.streamNo && activeStream?.source === stream.source && (
                        <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
