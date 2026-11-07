import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenPortal: (role?: 'student_parent' | 'teacher' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About INHS' },
    { id: 'admissions', label: 'Admissions & Enrollment' },
    { id: 'junior-high', label: 'Junior High School' },
    { id: 'senior-high', label: 'Senior High School' },
    { id: 'student-life', label: 'Student Life' },
    { id: 'updates', label: 'Updates & Calendar' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Official DepEd Top Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 font-medium">
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-[11px]">Republic of the Philippines</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Department of Education</span>
            <span className="text-slate-600 hidden md:inline">·</span>
            <span className="hidden md:inline">Region IV-A CALABARZON</span>
            <span className="text-slate-600 hidden lg:inline">·</span>
            <span className="hidden lg:inline">Division of Quezon</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono-num text-slate-400">
            <button
              onClick={() => {
                const el = document.getElementById('visitor-counter');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/90 text-amber-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-400/50 transition-colors cursor-pointer"
              title="View Official Portal Visitor Counter & Web Analytics"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Visits:</span>
              <span className="font-semibold text-amber-300 font-mono">128K+</span>
            </button>
            <span className="text-slate-700">|</span>
            <span>School ID: <strong className="text-amber-300 font-semibold">301332</strong></span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Infanta, Quezon 4336</span>
          </div>
        </div>
      </div>

      {/* Row 1: Brand & School Identity (Allows Infanta National High School to fully stretch) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* School Brand Lockup */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-4 sm:gap-5 text-left group focus-visible:outline-hidden flex-1 min-w-0"
          >
            {/* Official School Logo (Cropped with circle to remove visible border edges, rendered large) */}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0 rounded-full overflow-hidden flex items-center justify-center shadow-sm">
              <img 
                src="/assets/aistudio/INHS_LOGO_v2_3c57a62d.png" 
                alt="Infanta National High School Official Seal" 
                className="w-full h-full object-cover scale-[1.04] rounded-full transition-transform group-hover:scale-110 duration-200"
              />
            </div>

            {/* School Name & Subtitles - Stretched across available width */}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-xs tracking-wider uppercase font-bold text-blue-900 truncate">
                Department of Education · Division of Quezon · District of Infanta
              </span>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-crest tracking-tight text-slate-900 leading-tight truncate">
                Infanta National High School
              </h1>
              <span className="text-xs sm:text-sm text-slate-600 font-medium hidden sm:block truncate mt-0.5">
                District of Infanta · Sapientia · Veritas · Virtus · Founded 1947
              </span>
            </div>
          </button>

          {/* Action Zone: Portal Access & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenPortal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>School Portal</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Dedicated Navigation Menu Bar (Arranged cleanly below the school name) */}
      <div className="hidden lg:block bg-slate-50/90 border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="flex items-center justify-start gap-1 overflow-x-auto py-1 text-xs font-semibold text-slate-700">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-blue-900 text-white shadow-xs font-bold' 
                      : 'hover:text-blue-900 hover:bg-slate-200/70 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors cursor-pointer ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal('student_parent');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Student & Parent Portal</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal('teacher');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-slate-700 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Teacher Grade Encoder</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
