/**
 * Infanta National High School
 * Official School Website & Academic Management Portal
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { JuniorHighSection } from './components/JuniorHighSection';
import { SeniorHighSection } from './components/SeniorHighSection';
import { StudentLifeSection } from './components/StudentLifeSection';
import { SchoolUpdatesSection } from './components/SchoolUpdatesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PortalModal } from './components/portal/PortalModal';
import { EnrollmentPortalModal } from './components/portal/EnrollmentPortalModal';
import { Role } from './types/school';
import { GraduationCap, ArrowRight, FileCheck2 } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalRole, setPortalRole] = useState<Role>('student_parent');
  const [enrollmentPortalOpen, setEnrollmentPortalOpen] = useState(false);
  const [enrollmentTab, setEnrollmentTab] = useState<'enroll' | 'status' | 'guidelines'>('enroll');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 185;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - headerHeight - 16);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset < 120) {
        setActiveSection('home');
        return;
      }
      const sectionIds = ['updates', 'admissions', 'junior-high', 'senior-high', 'student-life', 'about', 'contact'];
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 185;
      const triggerY = window.pageYOffset + headerHeight + 50;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sectionIds[i]);
        if (sec) {
          const top = sec.getBoundingClientRect().top + window.pageYOffset;
          if (triggerY >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenPortal = (role: Role = 'student_parent') => {
    setPortalRole(role);
    setPortalOpen(true);
  };

  const handleOpenEnrollmentPortal = (tab: 'enroll' | 'status' | 'guidelines' = 'enroll') => {
    setEnrollmentTab(tab);
    setEnrollmentPortalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Sticky Header with School Logo Placeholder & Identity */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenPortal={handleOpenPortal}
        onOpenEnrollmentPortal={handleOpenEnrollmentPortal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with Campus Facade & Mission */}
        <HeroSection
          onNavigate={handleNavigate}
          onOpenPortal={handleOpenPortal}
          onOpenEnrollmentPortal={handleOpenEnrollmentPortal}
        />

        {/* School Updates & Activities Bulletin */}
        <SchoolUpdatesSection />

        {/* Admissions & Online Enrollment Guide */}
        <AdmissionsSection 
          onOpenPortal={handleOpenPortal}
          onOpenEnrollmentPortal={handleOpenEnrollmentPortal}
        />

        {/* Junior High School (Grades 7 to 10 + STE) */}
        <JuniorHighSection onNavigateToEnroll={() => handleOpenEnrollmentPortal('enroll')} />

        {/* Senior High School (Academic & TVL Strands + Labs) */}
        <SeniorHighSection onNavigateToEnroll={() => handleOpenEnrollmentPortal('enroll')} />

        {/* Student Life & Organizations (SSLG, Journalism, Clubs) */}
        <StudentLifeSection />

        {/* About Infanta National High School (History, VMV, Admin) */}
        <AboutSection />

        {/* Contact & Public Assistance Desk */}
        <ContactSection />
      </main>

      {/* Official DepEd Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPortal={handleOpenPortal}
        onOpenEnrollmentPortal={handleOpenEnrollmentPortal}
      />

      {/* Interactive Academic Portal Modal (Faculty, Admin, Students) */}
      <PortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
        initialRole={portalRole}
      />

      {/* Dedicated Standalone Online Enrollment Portal Modal */}
      <EnrollmentPortalModal
        isOpen={enrollmentPortalOpen}
        onClose={() => setEnrollmentPortalOpen(false)}
        initialTab={enrollmentTab}
      />

      {/* Persistent Floating Quick Launchers */}
      <aside aria-label="Portal Quick Launchers" className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-30 no-print flex flex-col items-end gap-2.5">
        <button
          onClick={() => handleOpenEnrollmentPortal('enroll')}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-full shadow-lg hover:shadow-xl border border-emerald-400/40 transition-all duration-200 cursor-pointer group"
          title="Open Dedicated Online Enrollment Portal"
        >
          <FileCheck2 className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold tracking-wide">
            Enroll Online
          </span>
          <span className="hidden sm:inline text-[10px] bg-emerald-950 text-emerald-300 font-mono px-1.5 py-0.5 rounded-full font-bold">
            2026–2027
          </span>
        </button>

        <button
          onClick={() => handleOpenPortal('student_parent')}
          className="flex items-center gap-2.5 px-4 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-full shadow-xl hover:shadow-2xl border border-amber-400/30 transition-all duration-200 cursor-pointer group"
          title="Open Infanta NHS Portal (Faculty / Admin / Students)"
        >
          <GraduationCap className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            INHS Portal Access
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300 hidden sm:inline group-hover:translate-x-0.5 transition-transform" />
        </button>
      </aside>
    </div>
  );
}
