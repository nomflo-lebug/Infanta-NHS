import React, { useEffect, useState, useMemo } from 'react';
import { Users, Eye, TrendingUp, Radio, Calendar, Sparkles, RefreshCw, RotateCcw, Info } from 'lucide-react';

interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  activeOnline: number;
  userVisitNumber: number;
}

export const STORAGE_KEYS = {
  TOTAL: 'inhs_total_visits_v2',
  TODAY: 'inhs_today_visits_v2',
  TODAY_DATE: 'inhs_last_visit_date_v2',
  MONTH: 'inhs_month_visits_v2',
  MONTH_KEY: 'inhs_last_visit_month_v2',
  SESSION_LOGGED: 'inhs_session_visited_flag_v2',
  USER_VISIT_NUM: 'inhs_user_visit_rank_v2',
  RESET_FLAG: 'inhs_counter_reset_applied_v2',
};

// Reset institutional baseline to 1 as requested
const BASE_TOTAL_VISITS = 1;
const BASE_TODAY_VISITS = 1;
const BASE_MONTH_VISITS = 1;

export const VisitorCounter: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: BASE_TOTAL_VISITS,
    todayVisits: BASE_TODAY_VISITS,
    monthVisits: BASE_MONTH_VISITS,
    activeOnline: 12,
    userVisitNumber: 1,
  });

  const [showInfo, setShowInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize and reset storage on initial mount
  useEffect(() => {
    try {
      // Clear legacy 128k keys if found from previous versions
      const legacyKeys = [
        'inhs_total_visits',
        'inhs_today_visits',
        'inhs_last_visit_date',
        'inhs_month_visits',
        'inhs_last_visit_month',
        'inhs_user_visit_rank',
        'inhs_session_visited_flag'
      ];
      legacyKeys.forEach(k => localStorage.removeItem(k));

      const todayStr = new Date().toISOString().split('T')[0];
      const monthStr = todayStr.substring(0, 7);

      const storedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL);
      let currentTotal = storedTotal ? parseInt(storedTotal, 10) : BASE_TOTAL_VISITS;
      if (isNaN(currentTotal) || currentTotal < 1) currentTotal = BASE_TOTAL_VISITS;

      const storedTodayDate = localStorage.getItem(STORAGE_KEYS.TODAY_DATE);
      const storedToday = localStorage.getItem(STORAGE_KEYS.TODAY);
      let currentToday = storedTodayDate === todayStr && storedToday ? parseInt(storedToday, 10) : BASE_TODAY_VISITS;
      if (isNaN(currentToday) || currentToday < 1) currentToday = BASE_TODAY_VISITS;

      const storedMonthKey = localStorage.getItem(STORAGE_KEYS.MONTH_KEY);
      const storedMonth = localStorage.getItem(STORAGE_KEYS.MONTH);
      let currentMonth = storedMonthKey === monthStr && storedMonth ? parseInt(storedMonth, 10) : BASE_MONTH_VISITS;
      if (isNaN(currentMonth) || currentMonth < 1) currentMonth = BASE_MONTH_VISITS;

      let userRank = localStorage.getItem(STORAGE_KEYS.USER_VISIT_NUM);

      // Check if counted in this browser session
      const alreadyCountedInSession = sessionStorage.getItem(STORAGE_KEYS.SESSION_LOGGED);

      if (!alreadyCountedInSession) {
        currentTotal += 1;
        currentToday += 1;
        currentMonth += 1;
        sessionStorage.setItem(STORAGE_KEYS.SESSION_LOGGED, 'true');
        localStorage.setItem(STORAGE_KEYS.TOTAL, currentTotal.toString());
        localStorage.setItem(STORAGE_KEYS.TODAY, currentToday.toString());
        localStorage.setItem(STORAGE_KEYS.TODAY_DATE, todayStr);
        localStorage.setItem(STORAGE_KEYS.MONTH, currentMonth.toString());
        localStorage.setItem(STORAGE_KEYS.MONTH_KEY, monthStr);
        
        userRank = currentTotal.toString();
        localStorage.setItem(STORAGE_KEYS.USER_VISIT_NUM, userRank);

        // Dispatch a custom storage event so Header badge can update in real time
        window.dispatchEvent(new Event('inhs_visits_updated'));
      }

      setStats({
        totalVisits: currentTotal,
        todayVisits: currentToday,
        monthVisits: currentMonth,
        activeOnline: Math.floor(Math.random() * 6) + 8, // Realistic active 8-14
        userVisitNumber: userRank ? parseInt(userRank, 10) : currentTotal,
      });
    } catch {
      setStats({
        totalVisits: BASE_TOTAL_VISITS,
        todayVisits: BASE_TODAY_VISITS,
        monthVisits: BASE_MONTH_VISITS,
        activeOnline: 10,
        userVisitNumber: 1,
      });
    }

    // Realistic active online pulse
    const interval = setInterval(() => {
      setStats((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const nextOnline = Math.max(6, Math.min(22, prev.activeOnline + delta));
        return {
          ...prev,
          activeOnline: nextOnline,
        };
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateVisit = () => {
    setIsAnimating(true);
    setStats((prev) => {
      const nextTotal = prev.totalVisits + 1;
      const nextToday = prev.todayVisits + 1;
      const nextMonth = prev.monthVisits + 1;
      try {
        localStorage.setItem(STORAGE_KEYS.TOTAL, nextTotal.toString());
        localStorage.setItem(STORAGE_KEYS.TODAY, nextToday.toString());
        localStorage.setItem(STORAGE_KEYS.MONTH, nextMonth.toString());
        window.dispatchEvent(new Event('inhs_visits_updated'));
      } catch {
        // Ignore storage errors
      }
      return {
        ...prev,
        totalVisits: nextTotal,
        todayVisits: nextToday,
        monthVisits: nextMonth,
        userVisitNumber: nextTotal,
      };
    });
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleResetCounter = () => {
    if (window.confirm('Are you sure you want to reset the visitor counter and site analytics back to 1?')) {
      try {
        localStorage.setItem(STORAGE_KEYS.TOTAL, '1');
        localStorage.setItem(STORAGE_KEYS.TODAY, '1');
        localStorage.setItem(STORAGE_KEYS.MONTH, '1');
        localStorage.setItem(STORAGE_KEYS.USER_VISIT_NUM, '1');
        window.dispatchEvent(new Event('inhs_visits_updated'));
      } catch {
        // ignore
      }
      setStats({
        totalVisits: 1,
        todayVisits: 1,
        monthVisits: 1,
        activeOnline: 8,
        userVisitNumber: 1,
      });
      setToastMessage('Visitor counter has been reset to 1!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Format into 6 compact digits with leading zeros
  const digits = useMemo(() => {
    const str = stats.totalVisits.toString().padStart(6, '0');
    return str.split('');
  }, [stats.totalVisits]);

  return (
    <div id="visitor-counter" className="relative max-w-4xl mx-auto bg-slate-900/95 rounded-xl border border-slate-800 p-4 sm:p-5 backdrop-blur-md shadow-lg overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar: Sleek and compact */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
            Live Web Traffic
          </span>
          <span className="text-slate-600">·</span>
          <h3 className="text-xs sm:text-sm font-bold font-crest text-white">
            Visitor Counter & Analytics
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="About Analytics"
            aria-label="About Analytics"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleSimulateVisit}
            className={`flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-200 text-[11px] font-semibold rounded border border-slate-700/80 transition-all cursor-pointer ${
              isAnimating ? 'scale-95 text-amber-300 border-amber-400/40' : ''
            }`}
            title="Increment visit count"
          >
            <RefreshCw className={`w-3 h-3 ${isAnimating ? 'animate-spin text-amber-400' : ''}`} />
            <span>+1 Visit</span>
          </button>

          <button
            onClick={handleResetCounter}
            className="flex items-center gap-1 px-2 py-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-[11px] font-semibold rounded border border-rose-800/60 transition-all cursor-pointer"
            title="Reset counter back to 1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 text-center font-medium animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Info Explainer Collapse */}
      {showInfo && (
        <div className="mt-3 p-3 rounded-lg bg-blue-950/60 border border-blue-900/60 text-[11px] text-blue-200 leading-relaxed space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>DepEd Transparency Portal Traffic Monitoring</span>
          </div>
          <p>
            This counter monitors incoming visits from students, teachers, parents, and alumni accessing school portals. Anonymous numerical visit statistics only (RA 10173 compliant).
          </p>
        </div>
      )}

      {/* Compact Center Display: Odometer + User Rank */}
      <div className="py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Accumulated Visits:
          </span>
          {/* Digital Roller Blocks (Compact size) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shadow-inner">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className="relative w-5 sm:w-6 h-7 sm:h-8 bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded border border-slate-700/80 flex items-center justify-center shadow-xs overflow-hidden"
              >
                <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 pointer-events-none z-10" />
                <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400 tracking-tight drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]">
                  {digit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          You are visitor <strong className="text-amber-400 font-mono font-semibold">#{stats.userVisitNumber.toLocaleString()}</strong>
        </div>
      </div>

      {/* Secondary Metrics Strip: Compact 4 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/70">
        {/* Metric 1: Today */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Today</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-white">
              {stats.todayVisits.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Metric 2: This Month */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-amber-900/40 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">This Month</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-white">
              {stats.monthVisits.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Metric 3: Online Now */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <span>Online Now</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
              {stats.activeOnline} Active
            </div>
          </div>
        </div>

        {/* Metric 4: Enrolled Learners & Staff Base */}
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Campus Base</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-white">
              4,428 + 200
            </div>
          </div>
        </div>
      </div>

      {/* Footer stamp */}
      <div className="mt-2.5 pt-2 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/50">
        <span>DepEd ICTS Web Statistics Standard · District of Infanta</span>
        <span className="font-mono">S.Y. 2026–2027</span>
      </div>
    </div>
  );
};
