import React, { useState } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Briefcase, 
  Building, 
  Wrench, 
  ChefHat, 
  Fish, 
  Sparkles, 
  Check, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface SeniorHighSectionProps {
  onNavigateToEnroll: () => void;
}

export const SeniorHighSection: React.FC<SeniorHighSectionProps> = ({ onNavigateToEnroll }) => {
  const [selectedTrack, setSelectedTrack] = useState<'academic' | 'tvl'>('academic');
  const [selectedStrand, setSelectedStrand] = useState<'stem' | 'abm' | 'humss' | 'tvl_ict' | 'tvl_he' | 'tvl_eim' | 'tvl_epas'>('stem');

  const strandDetails: Record<string, {
    title: string;
    badge: string;
    description: string;
    subjects: string[];
    careers: string[];
    partner: string;
  }> = {
    stem: {
      title: 'Science, Technology, Engineering & Mathematics (STEM)',
      badge: 'Academic Track',
      description: 'Prepares future scientists, software engineers, medical professionals, and innovators through high-level calculus, physics, and empirical research.',
      subjects: ['Pre-Calculus & Basic Calculus', 'General Physics 1 & 2', 'General Chemistry 1 & 2', 'General Biology 1 & 2', 'Inquiries, Investigations & Immersion'],
      careers: ['Civil / Mechanical / Software Engineering', 'Doctor of Medicine & Nursing', 'Biotechnology & Data Science', 'Architecture & Marine Science'],
      partner: 'LGU Infanta Engineering Office, DepEd Science Research Hub'
    },
    abm: {
      title: 'Accountancy, Business & Management (ABM)',
      badge: 'Academic Track',
      description: 'Focuses on financial literacy, enterprise management, accounting principles, and marketing strategies for competitive corporate and entrepreneurial leadership.',
      subjects: ['Fundamentals of ABM 1 & 2', 'Business Finance', 'Principles of Marketing', 'Business Mathematics', 'Applied Economics'],
      careers: ['Certified Public Accountant (CPA)', 'Corporate Financial Analyst', 'Entrepreneur & Business Manager', 'Banker / Investment Consultant'],
      partner: 'Infanta Credit & Development Cooperative, Rural Bank of Infanta'
    },
    humss: {
      title: 'Humanities & Social Sciences (HUMSS)',
      badge: 'Academic Track',
      description: 'Nurtures critical discourse, civic awareness, ethical jurisprudence, creative expression, and community service for future lawyers, educators, and journalists.',
      subjects: ['Disciplines & Ideas in Social Sciences', 'Creative Writing / Malikhaing Pagsulat', 'Philippine Politics and Governance', 'Community Engagement & Solidarity', 'Trends, Networks & 21st Century Skills'],
      careers: ['Law & Juris Doctor', 'Broadcast & Investigative Journalism', 'Secondary & Tertiary Education', 'Psychology & Guidance Counseling'],
      partner: 'Infanta Municipal Trial Court, Sangguniang Bayan of Infanta'
    },
    tvl_ict: {
      title: 'TVL: Information & Communications Technology (ICT)',
      badge: 'TVL Track · TESDA NC II',
      description: 'Hands-on technical mastery in computer hardware servicing, local and wide area networking, server setup, and technical troubleshooting.',
      subjects: ['Computer Systems Servicing (CSS NC II)', 'Network Configuration & Crimping', 'Server Installation & Active Directory', 'Technical Drafting & Animation', 'Work Immersion Practicum'],
      careers: ['Certified Network Technician', 'Computer Systems Administrator', 'IT Support Specialist', 'Hardware Repair Entrepreneur'],
      partner: 'Infanta IT Solutions, Quezon Cable System Provider'
    },
    tvl_he: {
      title: 'TVL: Home Economics (HE)',
      badge: 'TVL Track · TESDA NC II',
      description: 'Culinary craftsmanship, commercial baking, patisserie techniques, food safety, and hospitality service management for commercial kitchens.',
      subjects: ['Bread and Pastry Production NC II', 'Commercial Cookery NC II', 'Food and Beverage Services NC II', 'Kitchen Safety & HACCP', 'Culinary Entrepreneurship'],
      careers: ['Head Baker & Pastry Chef', 'Commercial Kitchen Supervisor', 'Catering Business Owner', 'Cruise Ship Food & Beverage Staff'],
      partner: 'Pacific Coast Hotels & Resorts, Infanta Bakeries Association'
    },
    tvl_eim: {
      title: 'TVL: Electrical Installation & Maintenance (EIM)',
      badge: 'TVL Track · TESDA NC II',
      description: 'Comprehensive electrical circuitry, residential and commercial wiring installation, power distribution panels, circuit breaker diagnostics, and safety compliance according to the Philippine Electrical Code (PEC).',
      subjects: ['Electrical Installation & Maintenance NC II', 'Philippine Electrical Code (PEC)', 'Roughing-in & Cable Pulling', 'Panel Board Assembly & Conduit Bending', 'Electrical Safety & Troubleshooting'],
      careers: ['Licensed Master Electrician (LME)', 'Commercial Building Electrician', 'Electrical Project Contractor', 'Substation & Power Plant Technician'],
      partner: 'Quezon I Electric Cooperative (QUEZELCO I), Infanta Municipal Engineering Office'
    },
    tvl_epas: {
      title: 'TVL: Electronic Products Assembly & Servicing (EPAS)',
      badge: 'TVL Track · TESDA NC II',
      description: 'Specialized training in PCB design, precision soldering, semiconductor troubleshooting, consumer audio-video electronics repair, and industrial electronic equipment diagnostics.',
      subjects: ['Electronic Products Assembly & Servicing NC II', 'Schematic Diagram Interpretation', 'PCB Soldering & Desoldering Techniques', 'Consumer Electronics Servicing (Audio/Video)', 'Industrial Electronics Diagnostics'],
      careers: ['Certified Electronics Technician', 'Consumer Electronics Service Center Specialist', 'Instrumentation & Calibration Technician', 'Audio-Video Equipment Specialist'],
      partner: 'Infanta Electronics Servicing Hub, Northern Quezon Technology Guild'
    }
  };

  const current = strandDetails[selectedStrand] || strandDetails.stem;

  return (
    <section id="senior-high" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
            Grades 11 & 12 Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Senior High School Tracks & Strands
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Equipping learners with academic excellence for university education and TESDA National Certifications (NC II) for immediate industry readiness or entrepreneurship.
          </p>
        </div>

        {/* Media Feature Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg border border-slate-200">
          <div className="grid lg:grid-cols-12 items-center bg-slate-900 text-white">
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                World-Class Experiential Learning
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-crest leading-snug">
                Advanced Science Labs & Industry Work Immersion
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Senior high students at Infanta NHS gain practical, hands-on experience in our modern science laboratories and through 80 to 320 hours of off-campus Work Immersion with local government units, hospitals, financial cooperatives, and technical workshops in Infanta and Quezon province.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400 font-mono-num">
                <span>· 80-320 Hours Work Immersion</span>
                <span>· DepEd Senior High Voucher Center</span>
                <span>· 100% Free Tuition</span>
              </div>
            </div>
            <div className="lg:col-span-5 h-64 lg:h-full min-h-[280px]">
              <img
                src="/src/assets/images/classroom_stem_laboratory_1793804197413.jpg"
                alt="Infanta NHS STEM Science Laboratory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-95"
              />
            </div>
          </div>
        </div>

        {/* Track Selector & Strand Explorer */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-3">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Select Curricular Offering:
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg">
              <button
                onClick={() => {
                  setSelectedTrack('academic');
                  setSelectedStrand('stem');
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedTrack === 'academic'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Academic Track (STEM, ABM, HUMSS)
              </button>
              <button
                onClick={() => {
                  setSelectedTrack('tvl');
                  setSelectedStrand('tvl_ict');
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedTrack === 'tvl'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                TVL Track (ICT, HE, EIM, EPAS)
              </button>
            </div>
          </div>

          {/* Strand Buttons */}
          <div className="flex flex-wrap gap-2">
            {selectedTrack === 'academic' ? (
              <>
                <button
                  onClick={() => setSelectedStrand('stem')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'stem'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  STEM (Science & Tech)
                </button>
                <button
                  onClick={() => setSelectedStrand('abm')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'abm'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ABM (Business & Accountancy)
                </button>
                <button
                  onClick={() => setSelectedStrand('humss')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'humss'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  HUMSS (Humanities & Social Sciences)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedStrand('tvl_ict')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'tvl_ict'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  TVL - ICT (Computer Systems Servicing)
                </button>
                <button
                  onClick={() => setSelectedStrand('tvl_he')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'tvl_he'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  TVL - Home Economics (Bread & Pastry)
                </button>
                <button
                  onClick={() => setSelectedStrand('tvl_eim')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'tvl_eim'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  TVL - Electrical Installation & Maintenance (EIM)
                </button>
                <button
                  onClick={() => setSelectedStrand('tvl_epas')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedStrand === 'tvl_epas'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  TVL - Electronic Products Assembly & Servicing (EPAS)
                </button>
              </>
            )}
          </div>

          {/* Detailed Strand Showcase Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  {current.badge}
                </span>
                <h4 className="text-xl sm:text-2xl font-bold font-crest text-slate-900 mt-1">
                  {current.title}
                </h4>
              </div>

              <button
                onClick={onNavigateToEnroll}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Enroll in this Strand</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {current.description}
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Specialized Learning Areas
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {current.subjects.map((sub, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-900 font-bold">·</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  University Degrees & Career Pathways
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {current.careers.map((car, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">·</span>
                      <span>{car}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Work Immersion Partner Entities
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {current.partner}
                </p>
                <div className="pt-2 text-[11px] text-slate-500">
                  Includes direct supervisor evaluations and real workplace competency grading.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
