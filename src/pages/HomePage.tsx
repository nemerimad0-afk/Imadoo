import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMatches } from "../lib/api";
import { Match } from "../types";
import { MatchCard } from "../components/MatchCard";
import { CalendarX2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HomePage() {
  const { sportId } = useParams<{ sportId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sportId) return;
    
    setLoading(true);
    getMatches(sportId)
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sportId]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-tajawal text-3xl font-bold tracking-tight text-white md:text-4xl">
            المباريات <span className="text-emerald-500">اليوم</span>
          </h1>
          <p className="mt-2 text-slate-400">
            أهم المواجهات والأحداث المباشرة
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
          <CalendarX2 className="h-12 w-12 text-slate-600" />
          <p className="font-tajawal text-lg text-slate-400">لا توجد مباريات متاحة حالياً في هذا القسم</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          <AnimatePresence mode="popLayout">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MatchCard match={match} sportId={sportId!} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
