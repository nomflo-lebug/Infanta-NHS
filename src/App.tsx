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
import { Role } from './types/school';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalRole, setPortalRole] = useState<Role>('student_parent');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenPortal = (role: Role = 'student_parent') => {
    setPortalRole(role);
    setPortalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Sticky Header with School Logo Placeholder & Identity */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenPortal={handleOpenPortal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with Campus Facade & Mission */}
        <HeroSection
          onNavigate={handleNavigate}
          onOpenPortal={handleOpenPortal}
        />

        {/* School Updates & Activities Bulletin */}
        <SchoolUpdatesSection />

        {/* Admissions & Online Enrollment (DepEd BEEG form) */}
        <AdmissionsSection onOpenPortal={handleOpenPortal} />

        {/* Junior High School (Grades 7 to 10 + STE) */}
        <JuniorHighSection onNavigateToEnroll={() => handleNavigate('admissions')} />

        {/* Senior High School (Academic & TVL Strands + Labs) */}
        <SeniorHighSection onNavigateToEnroll={() => handleNavigate('admissions')} />

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
      />

      {/* Interactive Academic Portal Modal */}
      <PortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
        initialRole={portalRole}
      />

      {/* Persistent Floating Portal Launcher */}
      <aside aria-label="Portal Quick Launcher" className="fixed bottom-20 sm:bottom-24 right-6 sm:right-8 z-30 no-print">
        <button
          onClick={() => handleOpenPortal('student_parent')}
          className="flex items-center gap-2.5 px-4 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-full shadow-xl hover:shadow-2xl border border-amber-400/30 transition-all duration-200 cursor-pointer group"
          title="Open Infanta NHS Portal"
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
