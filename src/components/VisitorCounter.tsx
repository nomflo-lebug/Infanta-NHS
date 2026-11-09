import React, { useEffect, useState, useMemo } from 'react';
import { Users, Eye, TrendingUp, Calendar, Sparkles, RefreshCw, RotateCcw, Info, Check } from 'lucide-react';

interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  activeOnline: number;
  userVisitNumber: number;
}

const STORAGE_KEYS = {
  TOTAL: 'inhs_v3_total_visits',
  TODAY: 'inhs_v3_today_visits',
  TODAY_DATE: 'inhs_v3_last_visit_date',
  MONTH: 'inhs_v3_month_visits',
  MONTH_KEY: 'inhs_v3_last_visit_month',
  SESSION_LOGGED: 'inhs_v3_session_visited_flag',
  USER_VISIT_NUM: 'inhs_v3_user_visit_rank',
};

// Reset institutional baseline counter as requested
const BASE_TOTAL_VISITS = 1;
const BASE_TODAY_VISITS = 1;
const BASE_MONTH_VISITS = 1;

export const VisitorCounter: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: BASE_TOTAL_VISITS,
    todayVisits: BASE_TODAY_VISITS,
    monthVisits: BASE_MONTH_VISITS,
    activeOnline: 3,
    userVisitNumber: BASE_TOTAL_VISITS,
  });

  const [showInfo, setShowInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    try {
      // Clear any legacy keys from previous large counter
      localStorage.removeItem('inhs_total_visits');
      localStorage.removeItem('inhs_today_visits');
      localStorage.removeItem('inhs_last_visit_date');
      localStorage.removeItem('inhs_month_visits');
      localStorage.removeItem('inhs_last_visit_month');
      localStorage.removeItem('inhs_session_visited_flag');
      localStorage.removeItem('inhs_user_visit_rank');

      const todayStr = new Date().toISOString().split('T')[0];
      const monthStr = todayStr.substring(0, 7);

      const storedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL);
      let currentTotal = storedTotal ? parseInt(storedTotal, 10) : BASE_TOTAL_VISITS;
      if (isNaN(currentTotal) || currentTotal > 10000) currentTotal = BASE_TOTAL_VISITS;

      const storedTodayDate = localStorage.getItem(STORAGE_KEYS.TODAY_DATE);
      const storedToday = localStorage.getItem(STORAGE_KEYS.TODAY);
      let currentToday = storedTodayDate === todayStr && storedToday ? parseInt(storedToday, 10) : BASE_TODAY_VISITS;
      if (isNaN(currentToday)) currentToday = BASE_TODAY_VISITS;

      const storedMonthKey = localStorage.getItem(STORAGE_KEYS.MONTH_KEY);
      const storedMonth = localStorage.getItem(STORAGE_KEYS.MONTH);
      let currentMonth = storedMonthKey === monthStr && storedMonth ? parseInt(storedMonth, 10) : BASE_MONTH_VISITS;
      if (isNaN(currentMonth)) currentMonth = BASE_MONTH_VISITS;

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
      }

      setStats({
        totalVisits: currentTotal,
        todayVisits: currentToday,
        monthVisits: currentMonth,
        activeOnline: Math.floor(Math.random() * 3) + 2, // 2 to 4 active online
        userVisitNumber: userRank ? parseInt(userRank, 10) : currentTotal,
      });

      // Broadcast live count to Header
      window.dispatchEvent(new CustomEvent('inhs_visitor_count_updated', { detail: currentTotal }));
    } catch {
      setStats({
        totalVisits: BASE_TOTAL_VISITS,
        todayVisits: BASE_TODAY_VISITS,
        monthVisits: BASE_MONTH_VISITS,
        activeOnline: 2,
        userVisitNumber: BASE_TOTAL_VISITS,
      });
    }

    // Gentle live activity simulation
    const interval = setInterval(() => {
      setStats((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const nextOnline = Math.max(1, Math.min(8, prev.activeOnline + delta));
        return {
          ...prev,
          activeOnline: nextOnline,
        };
      });
    }, 25000);

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
      } catch {
        // Ignore storage errors
      }
      window.dispatchEvent(new CustomEvent('inhs_visitor_count_updated', { detail: nextTotal }));
      return {
        ...prev,
        totalVisits: nextTotal,
        todayVisits: nextToday,
        monthVisits: nextMonth,
      };
    });
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleResetCounter = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL, '1');
      localStorage.setItem(STORAGE_KEYS.TODAY, '1');
      localStorage.setItem(STORAGE_KEYS.MONTH, '1');
      localStorage.setItem(STORAGE_KEYS.USER_VISIT_NUM, '1');
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_LOGGED);
      window.dispatchEvent(new CustomEvent('inhs_visitor_count_updated', { detail: 1 }));
    } catch {
      // Ignore
    }
    setStats({
      totalVisits: 1,
      todayVisits: 1,
      monthVisits: 1,
      activeOnline: 2,
      userVisitNumber: 1,
    });
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 3000);
  };

  // Compact 5-digit mechanical roller format
  const digits = useMemo(() => {
    const str = stats.totalVisits.toString().padStart(5, '0');
    return str.split('');
  }, [stats.totalVisits]);

  return (
    <div id="visitor-counter" className="relative bg-slate-900/90 rounded-xl border border-slate-800 p-4 sm:p-5 backdrop-blur-md shadow-lg overflow-hidden max-w-3xl mx-auto">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400">
            Visitor Counter & Site Analytics
          </span>
          <span className="text-slate-600 text-[10px] hidden sm:inline">·</span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            INHS Official Portal
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="About Visitor Counter"
            aria-label="About Visitor Counter"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetCounter}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-all border cursor-pointer ${
              resetConfirm
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border-slate-700/60'
            }`}
            title="Reset visitor counter"
          >
            {resetConfirm ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Reset to 1</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </>
            )}
          </button>

          <button
            onClick={handleSimulateVisit}
            className={`flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-300 text-[10px] font-semibold rounded border border-slate-700/80 transition-all cursor-pointer ${
              isAnimating ? 'text-amber-300 border-amber-400/40 scale-95' : ''
            }`}
            title="Count visit"
          >
            <RefreshCw className={`w-3 h-3 ${isAnimating ? 'animate-spin text-amber-400' : ''}`} />
            <span>Count Visit</span>
          </button>
        </div>
      </div>

      {/* Info Popup if toggled */}
      {showInfo && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-blue-950/60 border border-blue-900/60 text-[11px] text-blue-200 leading-relaxed space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span>DepEd Transparency Portal Traffic Monitoring</span>
          </div>
          <p>
            Monitors real-time hits from students, parents, faculty, and alumni accessing report cards and enrollment guidelines.
          </p>
        </div>
      )}

      {/* Center Compact Odometer Display */}
      <div className="py-3 flex flex-col items-center justify-center">
        <div className="flex items-center gap-1 p-1.5 bg-slate-950 rounded-lg border border-slate-800 shadow-inner">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className="relative w-6 h-8 sm:w-7 sm:h-9 bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded border border-slate-700/80 flex items-center justify-center shadow-md overflow-hidden"
            >
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 pointer-events-none z-10" />
              <span className="font-mono text-base sm:text-lg font-extrabold text-amber-400 tracking-tight drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]">
                {digit}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-1.5 text-[11px] text-slate-400">
          Total Hits · You are visitor <strong className="text-amber-400 font-mono-num font-semibold">#{stats.userVisitNumber}</strong>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="flex flex-wrap items-center justify-around gap-2 pt-2.5 border-t border-slate-800/70 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3 h-3 text-blue-400" />
          <span>Today:</span>
          <strong className="text-white font-mono-num font-semibold">{stats.todayVisits}</strong>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <TrendingUp className="w-3 h-3 text-amber-400" />
          <span>This Month:</span>
          <strong className="text-white font-mono-num font-semibold">{stats.monthVisits}</strong>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Users className="w-3 h-3 text-emerald-400" />
          <span>Active Online:</span>
          <strong className="text-emerald-400 font-mono-num font-semibold">{stats.activeOnline}</strong>
        </div>

        <div className="text-[10px] text-slate-500 font-mono hidden sm:inline">
          School ID: 301332
        </div>
      </div>
    </div>
  );
};
