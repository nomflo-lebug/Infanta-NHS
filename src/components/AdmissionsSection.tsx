import React from 'react';
import { 
  FileCheck2, 
  Search, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  Download,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Building2,
  FileText
} from 'lucide-react';

interface AdmissionsSectionProps {
  onOpenPortal: (role?: 'student_parent' | 'teacher' | 'admin') => void;
  onOpenEnrollmentPortal?: (tab?: 'enroll' | 'status' | 'guidelines') => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({ 
  onOpenPortal,
  onOpenEnrollmentPortal 
}) => {
  return (
    <section id="admissions" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
              Admissions & Enrollment Office
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              S.Y. 2026–2027 Open
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Join the Infanta NHS Scholastic Community
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            In accordance with DepEd Order No. 03, s. 2018, public high school basic education at Infanta National High School is 100% free with <strong>NO ENTRANCE FEES OR MANDATORY COLLECTIONS</strong>. We welcome elementary graduates, junior high completers, and transferees.
          </p>
        </div>

        {/* Dedicated Standalone Portal Banner */}
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/60 relative overflow-hidden mb-12">
          {/* Subtle Background Graphic */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL DEPED SEPARATE PORTAL LAUNCHED</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-crest tracking-tight text-white">
                Dedicated Online Enrollment Portal
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                To serve learners, parents, and guardians with a seamless registration experience, the <strong>Basic Education Enrollment Form (BEEF)</strong> and <strong>Application Status Tracker</strong> now operate within their own independent, high-speed portal.
              </p>
            </div>

            {/* Feature Grid inside Banner */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 flex items-start gap-2.5">
                <FileCheck2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">DepEd Form BEEF</div>
                  <div className="text-[11px] text-slate-300">Fast 4-step registration for JHS & SHS</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 flex items-start gap-2.5">
                <Search className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Instant Status Tracker</div>
                  <div className="text-[11px] text-slate-300">Live verification code lookup</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">100% Free Education</div>
                  <div className="text-[11px] text-slate-300">No fees or collections</div>
                </div>
              </div>
            </div>

            {/* Launch Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <button
                onClick={() => onOpenEnrollmentPortal && onOpenEnrollmentPortal('enroll')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-sm font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Open Online Enrollment Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenEnrollmentPortal && onOpenEnrollmentPortal('status')}
                className="px-5 py-3.5 bg-white/15 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 flex items-center gap-2 cursor-pointer transition-colors backdrop-blur-xs"
              >
                <Search className="w-4 h-4 text-amber-300" />
                <span>Track Application Status</span>
              </button>

              <button
                onClick={() => onOpenEnrollmentPortal && onOpenEnrollmentPortal('guidelines')}
                className="px-4 py-3.5 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Admission Guidelines</span>
              </button>
            </div>
          </div>
        </div>

        {/* Educational Programs & Requirements Matrix */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Junior High */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Grades 7 to 10</span>
              <h4 className="text-lg font-bold text-slate-900">Junior High School & STE Program</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepting elementary completers for the Regular K-to-12 JHS curriculum and the prestigious <strong>Special Science Program (STE)</strong> featuring advanced robotics, calculus, and research.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>PSA Birth Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>DepEd SF9 / Form 138 Report Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Certificate of Good Moral Character</span>
              </div>
            </div>
            <button
              onClick={() => onOpenEnrollmentPortal && onOpenEnrollmentPortal('enroll')}
              className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-blue-900 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Enroll for Junior High
            </button>
          </div>

          {/* Card 2: Senior High */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">Grades 11 & 12</span>
              <h4 className="text-lg font-bold text-slate-900">Senior High Academic & TVL Strands</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete career pathways: Academic Track (<strong>STEM, ABM, HUMSS</strong>) and Technical-Vocational Track (<strong>ICT, Home Economics, Electrical EIM, EPAS</strong>) with TESDA national certification support.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Grade 10 JHS Completer Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NCAE Result (for strand guidance)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>DepEd SHS Voucher Qualified</span>
              </div>
            </div>
            <button
              onClick={() => onOpenEnrollmentPortal && onOpenEnrollmentPortal('enroll')}
              className="w-full py-2 bg-slate-100 hover:bg-indigo-50 text-indigo-900 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Enroll for Senior High
            </button>
          </div>

          {/* Card 3: Assistance & Registrar Desk */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Registrar Assistance</span>
              <h4 className="text-lg font-bold text-slate-900">Physical In-Campus Registration</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learners without internet access can visit the <strong>Public Assistance Desk</strong> at the INHS Gymnasium. Assistance personnel are ready to guide you through registration.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div><strong>Schedule:</strong> Monday to Friday (8:00 AM – 4:00 PM)</div>
              <div><strong>Venue:</strong> INHS Gymnasium & Admin Building</div>
              <div><strong>Hotline:</strong> (042) 535-2144 · admin@inhs.deped.gov.ph</div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
            >
              View Campus Contact Details
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
