import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMatches } from "../lib/api";
import { Match } from "../types";
import { MatchCard } from "../components/MatchCard";
import { CalendarX2, Loader2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HomePage() {
  const { filter } = useParams<{ filter: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMatches("football")
      .then((allMatches) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);

        const filtered = allMatches.filter((match) => {
          const d = new Date(match.date);
          if (filter === "today") return d >= today && d < tomorrow;
          if (filter === "tomorrow") return d >= tomorrow && d < dayAfter;
          return true; // all
        });

        // Sort: popular first, then by date
        filtered.sort((a, b) => {
            if (a.popular && !b.popular) return -1;
            if (!a.popular && b.popular) return 1;
            return a.date - b.date;
        });

        setMatches(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const titles: Record<string, string> = {
    today: "مباريات اليوم",
    tomorrow: "مباريات الغد",
    all: "جميع المباريات",
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-tajawal text-3xl font-black tracking-tight text-white md:text-5xl flex items-center gap-4">
            <Trophy className="h-8 w-8 md:h-12 md:w-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            {titles[filter || "today"]?.split(" ")[0]} <span className="text-emerald-500">{titles[filter || "today"]?.split(" ")[1]}</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 font-medium">
            أهم المواجهات والأحداث المباشرة بدقة عالية
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-slate-800/60 bg-slate-900/20 backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50">
            <CalendarX2 className="h-10 w-10 text-slate-500" />
          </div>
          <p className="font-tajawal text-xl font-bold text-slate-400">لا توجد مباريات متاحة حالياً في هذا القسم</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          <AnimatePresence mode="popLayout">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                }}
              >
                <MatchCard match={match} sportId="football" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
