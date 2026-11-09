import React, { useEffect, useState, useMemo } from 'react';
import { Users, TrendingUp, Calendar, RefreshCw, RotateCcw, Check, Sparkles } from 'lucide-react';

interface VisitorStats {
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  activeOnline: number;
  userVisitNumber: number;
}

// Reset namespace for counter baseline
const STORAGE_KEYS = {
  TOTAL: 'inhs_v6_total_visits',
  TODAY: 'inhs_v6_today_visits',
  TODAY_DATE: 'inhs_v6_last_visit_date',
  MONTH: 'inhs_v6_month_visits',
  MONTH_KEY: 'inhs_v6_last_visit_month',
  SESSION_LOGGED: 'inhs_v6_session_visited_flag',
  USER_VISIT_NUM: 'inhs_v6_user_visit_rank',
};

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

  const [isAnimating, setIsAnimating] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    try {
      // Purge all legacy stored counts to strictly reset counter as requested
      const legacyKeys = [
        'inhs_total_visits', 'inhs_today_visits', 'inhs_last_visit_date', 
        'inhs_month_visits', 'inhs_last_visit_month', 'inhs_session_visited_flag',
        'inhs_user_visit_rank', 'inhs_v3_total_visits', 'inhs_v3_today_visits',
        'inhs_v3_last_visit_date', 'inhs_v3_month_visits', 'inhs_v3_last_visit_month',
        'inhs_v3_session_visited_flag', 'inhs_v3_user_visit_rank',
        'inhs_v4_total_visits', 'inhs_v5_total_visits'
      ];
      legacyKeys.forEach(k => localStorage.removeItem(k));

      const todayStr = new Date().toISOString().split('T')[0];
      const monthStr = todayStr.substring(0, 7);

      const storedTotal = localStorage.getItem(STORAGE_KEYS.TOTAL);
      let currentTotal = storedTotal ? parseInt(storedTotal, 10) : BASE_TOTAL_VISITS;
      if (isNaN(currentTotal) || currentTotal > 1000) currentTotal = BASE_TOTAL_VISITS;

      const storedTodayDate = localStorage.getItem(STORAGE_KEYS.TODAY_DATE);
      const storedToday = localStorage.getItem(STORAGE_KEYS.TODAY);
      let currentToday = storedTodayDate === todayStr && storedToday ? parseInt(storedToday, 10) : BASE_TODAY_VISITS;
      if (isNaN(currentToday)) currentToday = BASE_TODAY_VISITS;

      const storedMonthKey = localStorage.getItem(STORAGE_KEYS.MONTH_KEY);
      const storedMonth = localStorage.getItem(STORAGE_KEYS.MONTH);
      let currentMonth = storedMonthKey === monthStr && storedMonth ? parseInt(storedMonth, 10) : BASE_MONTH_VISITS;
      if (isNaN(currentMonth)) currentMonth = BASE_MONTH_VISITS;

      let userRank = localStorage.getItem(STORAGE_KEYS.USER_VISIT_NUM);

      const alreadyCountedInSession = sessionStorage.getItem(STORAGE_KEYS.SESSION_LOGGED);
      if (!alreadyCountedInSession) {
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
        activeOnline: 3,
        userVisitNumber: userRank ? parseInt(userRank, 10) : currentTotal,
      });

      window.dispatchEvent(new CustomEvent('inhs_visitor_count_updated', { detail: currentTotal }));
    } catch {
      setStats({
        totalVisits: BASE_TOTAL_VISITS,
        todayVisits: BASE_TODAY_VISITS,
        monthVisits: BASE_MONTH_VISITS,
        activeOnline: 3,
        userVisitNumber: BASE_TOTAL_VISITS,
      });
    }

    const interval = setInterval(() => {
      setStats((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const nextOnline = Math.max(2, Math.min(6, prev.activeOnline + delta));
        return { ...prev, activeOnline: nextOnline };
      });
    }, 30000);

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
        // ignore storage errors
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
      // ignore
    }
    setStats({
      totalVisits: 1,
      todayVisits: 1,
      monthVisits: 1,
      activeOnline: 2,
      userVisitNumber: 1,
    });
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2500);
  };

  // 5-digit compact roller
  const digits = useMemo(() => {
    const str = stats.totalVisits.toString().padStart(5, '0');
    return str.split('');
  }, [stats.totalVisits]);

  return (
    <div id="visitor-counter" className="relative bg-slate-900/95 rounded-xl border border-slate-800/90 p-3 sm:p-3.5 backdrop-blur-md shadow-md max-w-lg mx-auto">
      {/* Top micro bar */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
            Visitor Counter & Analytics
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetCounter}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold transition-all border cursor-pointer ${
              resetConfirm
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700/60'
            }`}
            title="Reset counter baseline to 1"
          >
            {resetConfirm ? (
              <>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                <span>Reset to 1</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </>
            )}
          </button>

          <button
            onClick={handleSimulateVisit}
            className={`flex items-center gap-1 px-1.5 py-0.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[9px] font-semibold rounded border border-slate-700/60 transition-all cursor-pointer ${
              isAnimating ? 'text-amber-300 border-amber-400/40 scale-95' : ''
            }`}
            title="Record simulated visit"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isAnimating ? 'animate-spin text-amber-400' : ''}`} />
            <span>+1 Hit</span>
          </button>
        </div>
      </div>

      {/* Main compact center row */}
      <div className="py-2.5 flex items-center justify-between gap-3">
        {/* Mechanical roller */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-md border border-slate-800/90 shadow-inner shrink-0">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className="relative w-5 h-7 bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded border border-slate-700/70 flex items-center justify-center shadow-xs"
            >
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/60 pointer-events-none" />
              <span className="font-mono text-sm font-bold text-amber-400">
                {digit}
              </span>
            </div>
          ))}
        </div>

        {/* Hits summary label */}
        <div className="text-right">
          <div className="text-[10px] text-slate-400">
            Total Portal Hits
          </div>
          <div className="text-xs font-semibold text-white">
            Visitor <span className="text-amber-400 font-mono">#{stats.userVisitNumber}</span>
          </div>
        </div>
      </div>

      {/* Bottom compact badge row */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/80 text-[10px]">
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar className="w-2.5 h-2.5 text-blue-400" />
          <span>Today:</span>
          <strong className="text-white font-mono">{stats.todayVisits}</strong>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <TrendingUp className="w-2.5 h-2.5 text-amber-400" />
          <span>Month:</span>
          <strong className="text-white font-mono">{stats.monthVisits}</strong>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Users className="w-2.5 h-2.5 text-emerald-400" />
          <span>Online:</span>
          <strong className="text-emerald-400 font-mono">{stats.activeOnline}</strong>
        </div>
      </div>
    </div>
  );
};
