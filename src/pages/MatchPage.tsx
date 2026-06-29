import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatches, getStreams, getImageUrl } from "../lib/api";
import { Match, Stream } from "../types";
import { Loader2, ArrowRight, MonitorPlay, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "../lib/utils";

export default function MatchPage() {
  const { sportId, matchId } = useParams<{ sportId: string; matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sportId || !matchId) return;

    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch match details
        const matches = await getMatches(sportId!);
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
  }, [sportId, matchId]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500/50" />
        <h2 className="font-tajawal text-2xl font-bold text-white">{error || "المباراة غير موجودة"}</h2>
        <Link to="/" className="mt-4 flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const isLive = Math.abs(Date.now() - match.date) < 2 * 60 * 60 * 1000;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-slate-900/50 p-6 border border-slate-800">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to={`/sport/${sportId}`} className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <div className="flex items-center gap-3 md:gap-6">
            <img 
              src={getImageUrl(match.teams.home.badge, true)} 
              alt={match.teams.home.name} 
              className="h-12 w-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg==';
              }}
            />
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-500">VS</span>
            </div>
            <img 
              src={getImageUrl(match.teams.away.badge, true)} 
              alt={match.teams.away.name} 
              className="h-12 w-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIwLjVjNC44MjgtMi4zNTcgOC02Ljc3OSA4LTExLjVWNWMtMi42Ny0uNzE4LTUuMzM0LTEuNzItOC0zLTIuNjY2IDEuMjgxLTUuMzMxIDIuMjgyLTggM3Y0YzAgNC43MjEgMy4xNzIgOS4xNDMgOCAxMS41eiIvPjwvc3ZnPg==';
              }}
            />
          </div>
          
          <div>
            <h1 className="font-tajawal text-xl md:text-2xl font-bold text-white">
              {match.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {format(new Date(match.date), "EEEE, dd MMMM - p", { locale: ar })}
            </p>
          </div>
        </div>
        
        {isLive && (
          <div className="flex items-center gap-2 self-start md:self-auto rounded-full bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </span>
            مباشر الآن
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Player Area */}
        <div className="flex-1 space-y-4">
          {window !== window.top && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-500 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium font-tajawal">
                يبدو أنك تتصفح من داخل نافذة مصغرة. إذا واجهت رسالة "Remove sandbox attributes"، يرجى فتح التطبيق في علامة تبويب جديدة بالضغط على زر (Open in new tab) أعلى يمين الشاشة.
              </p>
            </div>
          )}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-2xl">
            {activeStream ? (
              <iframe 
                src={activeStream.embedUrl} 
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                scrolling="no"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                <MonitorPlay className="h-12 w-12 opacity-50" />
                <p className="font-tajawal">لا يوجد بث متاح حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* Server List */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="mb-4 font-tajawal text-lg font-bold text-white flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-emerald-500" />
              سيرفرات البث
            </h3>
            
            {streams.length === 0 ? (
              <p className="text-sm text-slate-500">لا توجد سيرفرات متاحة</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollbar-hide pr-1">
                {streams.map((stream) => (
                  <button
                    key={`${stream.source}-${stream.id}-${stream.streamNo}`}
                    onClick={() => setActiveStream(stream)}
                    className={cn(
                      "flex items-center justify-between rounded-xl p-3 text-right transition-all border",
                      activeStream?.streamNo === stream.streamNo
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-transparent bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm flex items-center gap-2">
                        سيرفر {stream.streamNo}
                        {stream.hd && (
                          <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
                            HD
                          </span>
                        )}
                      </span>
                      <span className="text-xs opacity-60 line-clamp-1 truncate ml-2">
                        {stream.language}
                      </span>
                    </div>
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
