import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, ArrowUp } from 'lucide-react';
import { VisitorCounter } from './VisitorCounter';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPortal: (role?: 'student_parent' | 'teacher' | 'admin') => void;
  onOpenEnrollmentPortal?: (tab?: 'enroll' | 'status' | 'guidelines') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  onOpenPortal,
  onOpenEnrollmentPortal 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      
      {/* DepEd Transparency & Mission Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold font-crest">
              INHS
            </div>
            <div>
              <div className="text-white font-bold tracking-wide">
                Department of Education · Republic of the Philippines
              </div>
              <div className="text-slate-400 text-[11px]">
                Schools Division of Quezon · District of Infanta · School ID: <span className="font-mono text-amber-300 font-semibold">301332</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>DepEd "No Collection" Policy Compliant</span>
            </span>
            <span className="text-slate-700">|</span>
            <span>Freedom of Information (FOI)</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: School Identity */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/INHS_LOGO_v2_3c57a62d.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/logo_cropped.png';
                  }}
                  alt="Infanta NHS Official Logo"
                  className="w-full h-full object-cover scale-[1.04] rounded-full"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold font-crest text-white">Infanta National High School</h4>
                <div className="text-[11px] text-amber-400 font-medium">Infanta, Quezon · Est. 1947</div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              Serving the educational needs of youth in Infanta, Real, General Nakar, and the Polillo group of islands since 1947. Providing free quality basic education with values, academic vigor, and technical mastery.
            </p>

            <div className="space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Poblacion 38, Infanta, Quezon 4336</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono-num">(042) 535-2144 / 0917-889-1240</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono">301332@deped.gov.ph</span>
              </div>
            </div>
          </div>

          {/* Col 3: Academic Programs */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Academic Programs</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('junior-high')} className="hover:text-white transition-colors cursor-pointer">
                  Junior High (Grades 7–10)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('junior-high')} className="hover:text-white transition-colors cursor-pointer">
                  Special Science Program (STE)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('senior-high')} className="hover:text-white transition-colors cursor-pointer">
                  Senior High: STEM Strand
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('senior-high')} className="hover:text-white transition-colors cursor-pointer">
                  Senior High: ABM & HUMSS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('senior-high')} className="hover:text-white transition-colors cursor-pointer">
                  TVL: ICT, HE, EIM & EPAS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Services */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Online Services</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => onOpenEnrollmentPortal ? onOpenEnrollmentPortal('enroll') : onNavigate('admissions')} 
                  className="hover:text-white transition-colors cursor-pointer text-amber-300 font-semibold"
                >
                  Online Enrollment Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPortal('student_parent')} className="hover:text-white transition-colors cursor-pointer">
                  Student Report Card (SF9)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPortal('teacher')} className="hover:text-white transition-colors cursor-pointer">
                  Faculty Grading Console
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPortal('admin')} className="hover:text-white transition-colors cursor-pointer">
                  Registrar / Admin Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Request Form 137 / SF10
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: School Life */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Campus Community</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('student-life')} className="hover:text-white transition-colors cursor-pointer">
                  Learner Government (SSLG)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('student-life')} className="hover:text-white transition-colors cursor-pointer">
                  Ang Tinig & The Voice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('student-life')} className="hover:text-white transition-colors cursor-pointer">
                  Boy Scouts & Girl Scouts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('updates')} className="hover:text-white transition-colors cursor-pointer">
                  Announcements & Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Administration & Faculty
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Official Web Traffic & Visitor Analytics Counter */}
        <div className="mt-12">
          <VisitorCounter />
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; 1947–2026 Infanta National High School · All Rights Reserved. Department of Education Region IV-A.
          </div>
          <div className="flex items-center gap-4">
            <span>Republic Act 10173 (Data Privacy Act)</span>
            <span className="text-slate-700">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
