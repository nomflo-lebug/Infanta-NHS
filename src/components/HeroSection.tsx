import React from 'react';
import { 
  ArrowRight, 
  GraduationCap, 
  FileText, 
  Award, 
  CheckCircle2, 
  Users, 
  Compass, 
  Sparkles,
  BookOpenCheck
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenPortal: (role?: 'student_parent' | 'teacher' | 'admin') => void;
  onOpenEnrollmentPortal?: (tab?: 'enroll' | 'status' | 'guidelines') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenPortal,
  onOpenEnrollmentPortal,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Campus Facade with Scrim */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <img
          src="/assets/images/school_campus_facade_1793804196290.jpg"
          alt="Infanta National High School Campus"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-blue-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24">
        {/* Urgent Announcement Ticker */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-200 text-xs font-medium mb-6 backdrop-blur-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>DepEd Early Registration for S.Y. 2026-2027 is Ongoing · Grade 7 & Grade 11</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Main Hero Narrative */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-400">
                Honor · Excellence · Service
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-crest tracking-tight leading-tight text-white drop-shadow-xs">
                Infanta National High School
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                A premier public secondary institution in Northern Quezon, dedicated to fostering scientific inquiry, academic competence, technical-vocational mastery, and values-centered citizenship.
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenEnrollmentPortal ? onOpenEnrollmentPortal('enroll') : onNavigate('admissions')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-sm font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                title="Launch Dedicated Online Enrollment Portal"
              >
                <FileText className="w-4 h-4" />
                <span>Online Enrollment Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenPortal('student_parent')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-900/90 hover:bg-blue-800 text-white border border-blue-400/30 text-sm font-semibold rounded-lg shadow-md backdrop-blur-xs transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Student & Parent Portal</span>
              </button>

              <button
                onClick={() => onNavigate('senior-high')}
                className="inline-flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-300" />
                <span>Senior High Strands</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>DepEd K-12 Enhanced Basic Education</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Special Science Curriculum (STE)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>TESDA NC II TVL Assessment Center</span>
              </div>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 p-6 shadow-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Portals & Quick Actions</div>
              <h2 className="text-lg font-bold text-white mt-1">Student Academic Hub</h2>
              <p className="text-xs text-slate-400 mt-1">Check grades, attendance, and quarterly remarks.</p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => onOpenPortal('student_parent')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition-colors cursor-pointer group"
              >
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    Learner & Parent Access
                  </div>
                  <div className="text-xs text-slate-400">View Form 138/SF9, GPA & attendance</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </button>

              <button
                onClick={() => onOpenPortal('teacher')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition-colors cursor-pointer group"
              >
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    Faculty Grade Encoding
                  </div>
                  <div className="text-xs text-slate-400">Encode quarterly ratings & adviser remarks</div>
                </div>
                <BookOpenCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </button>

              <button
                onClick={() => onOpenPortal('admin')}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition-colors cursor-pointer group"
              >
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    School Administration
                  </div>
                  <div className="text-xs text-slate-400">Enrollment approval & school updates</div>
                </div>
                <Award className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">
                School ID: <span className="font-mono-num text-slate-300">301332</span> · Division of Quezon
              </span>
            </div>
          </div>
        </div>

        {/* 4-Metric Institutional Proof Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-amber-400">4,428</div>
            <div className="text-xs text-slate-300 font-medium">Officially Enrolled Learners</div>
            <div className="text-[11px] text-slate-500">S.Y. 2026–2027 (JHS & SHS)</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-blue-400">200+</div>
            <div className="text-xs text-slate-300 font-medium">Personnel</div>
            <div className="text-[11px] text-slate-500">Teaching & Non-Teaching Staff</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-emerald-400">100%</div>
            <div className="text-xs text-slate-300 font-medium">K-12 Accreditation</div>
            <div className="text-[11px] text-slate-500">STE, Academic & TVL Strands</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-slate-200">1947</div>
            <div className="text-xs text-slate-300 font-medium">Year Established</div>
            <div className="text-[11px] text-slate-500">79 Years of Public Heritage</div>
          </div>
        </div>
      </div>
    </section>
  );
};
