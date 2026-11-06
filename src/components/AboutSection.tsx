import React, { useState } from 'react';
import { 
  Building2, 
  Target, 
  Compass, 
  Heart, 
  Users, 
  ShieldCheck, 
  Award, 
  Microscope, 
  Laptop, 
  Hammer, 
  BookOpen, 
  Activity,
  Check
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vmv' | 'admin' | 'facilities'>('overview');

  const facilities = [
    {
      title: 'STE Science & Research Laboratories',
      icon: Microscope,
      desc: 'Equipped with binocular compound microscopes, spectrophotometers, digital balances, and fume hoods supporting student investigatory projects.',
    },
    {
      title: 'ICT & Multimedia Computer Centers',
      icon: Laptop,
      desc: 'Three networked computer laboratories with high-speed internet, dedicated server racks, and licensed computer systems servicing (CSS) test benches.',
    },
    {
      title: 'Technical-Vocational Workshops',
      icon: Hammer,
      desc: 'TESDA-standard facilities for Electrical Installation & Maintenance (EIM), Electronic Products Assembly & Servicing (EPAS), and Commercial Bread & Pastry baking ovens.',
    },
    {
      title: 'Learning Resource Management Center (LRMS)',
      icon: BookOpen,
      desc: 'Comprehensive library containing over 14,000 reference books, digital kiosk databases, DepEd modules, and an interactive quiet study area.',
    },
    {
      title: 'Multipurpose Covered Court & Athletic Oval',
      icon: Activity,
      desc: 'Full-sized hardwood-style basketball & volleyball court hosting division meets, district sports, school assemblies, and physical development activities.',
    },
    {
      title: 'Guidance & DRRM Command Center',
      icon: ShieldCheck,
      desc: 'Staffed with licensed guidance counselors for mental wellness, alongside proactive flood/typhoon DRRM emergency response gear for coastal Quezon safety.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
            About Our Institution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Infanta National High School
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Established in 1947 in the coastal municipality of Infanta, Quezon, our school stands as the beacon of secondary education, empowering generations of scholars and builders across the Pacific seaboard.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            History & Heritage
          </button>
          <button
            onClick={() => setActiveTab('vmv')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'vmv'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vision, Mission & Core Values
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Administration & Faculty
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'facilities'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Campus Facilities
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                <strong>Infanta National High School (INHS)</strong>, situated in Barangay Poblacion 38, Infanta, Quezon, was founded in 1947 to serve the young minds of northern Quezon. Over nearly eight decades, the institution has grown into a premier secondary comprehensive hub serving not only Infanta but also learners from Real, General Nakar, and the Polillo Group of Islands.
              </p>
              <p>
                Under the direct supervision of the <strong>Department of Education, Schools Division of Quezon</strong> (Region IV-A CALABARZON), INHS offers both complete Junior High School (Grades 7–10) including the Special Science Curriculum (STE) and an expansive Senior High School program (Grades 11–12) encompassing Academic and Technical-Vocational-Livelihood (TVL) tracks.
              </p>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mt-4 space-y-2">
                <div className="text-xs uppercase font-bold text-blue-900">Official DepEd Accreditation Details</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>School ID: <strong className="text-slate-900 font-mono-num">301332</strong></div>
                  <div>Curriculum: <strong className="text-slate-900">K-12 Enhanced</strong></div>
                  <div>Division: <strong className="text-slate-900">Quezon</strong></div>
                  <div>Established: <strong className="text-slate-900 font-mono-num">1947</strong></div>
                  <div>Classification: <strong className="text-slate-900">Public Secondary</strong></div>
                  <div>Accreditation: <strong className="text-slate-900">DepEd & TESDA</strong></div>
                  <div>Official Enrollment: <strong className="text-slate-900 font-mono-num">4,428 Learners</strong></div>
                  <div>Personnel: <strong className="text-slate-900 font-mono-num">200+ Staff</strong></div>
                  <div>Current Term: <strong className="text-slate-900 font-mono-num">S.Y. 2026–2027</strong></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full overflow-hidden flex items-center justify-center shadow-md">
                  <img
                    src="/assets/aistudio/INHS_LOGO_v2_3c57a62d.png"
                    alt="Official Infanta National High School Emblem"
                    className="w-full h-full object-cover scale-[1.04] rounded-full"
                  />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Official School Seal</span>
                  <h3 className="text-lg font-bold font-crest leading-snug">Infanta National High School</h3>
                  <span className="text-xs text-slate-300 font-mono-num">Infanta, Quezon · Est. 1947</span>
                </div>
              </div>

              <div className="space-y-3 pt-1 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>The Flaming Torch:</strong> Blazing with yellow, blue, and red flames, symbolizing burning truth, wisdom, and the Filipino patriotic spirit.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>The Open Book & Sunburst:</strong> Depicts the unceasing pursuit of academic enlightenment and intellectual illumination radiating throughout Quezon.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>Classical Doric Columns:</strong> Flanking both sides, representing structural firmness, moral discipline, and public institutional integrity.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>Infanta Land Silhouette & Laurel Wreath:</strong> The geographic shape of Infanta inscribed with Baybayin and 1947, crowned with laurel leaves of triumph and honor.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vmv' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Vision */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">DepEd Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.
              </p>
              <p className="text-xs text-slate-500 italic">
                As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.
              </p>
            </div>

            {/* Mission */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">DepEd Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Students learn in a child-friendly, gender-sensitive, safe, and motivating environment.</li>
                <li>Teachers facilitate learning and constantly nurture every learner.</li>
                <li>Administrators and staff ensure an enabling and supportive foundation for effective learning.</li>
                <li>Family, community, and other stakeholders are actively engaged.</li>
              </ul>
            </div>

            {/* Core Values */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">DepEd Core Values</h3>
              <div className="space-y-3 pt-1">
                <div>
                  <div className="text-xs font-bold text-blue-900">Maka-Diyos</div>
                  <div className="text-xs text-slate-600">Faith in God, moral integrity, spiritual respect</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">Makatao</div>
                  <div className="text-xs text-slate-600">Empathy, humanitarian respect, and equality</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">Makakalikasan</div>
                  <div className="text-xs text-slate-600">Stewardship of forests, coastal waters, and ecosystems</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">Makabansa</div>
                  <div className="text-xs text-slate-600">Civic duty, patriotism, and pride in Filipino culture</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-900 font-bold">School Principal IV</div>
                <h4 className="text-base font-bold text-slate-900">Dr. Ronaldo M. Coronado, EdD</h4>
                <p className="text-xs text-slate-600">Oversees total institutional governance, curriculum implementation, and stakeholder linkages.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-900 font-bold">Asst. Principal - Junior High</div>
                <h4 className="text-base font-bold text-slate-900">Mrs. Elena P. Alcantara</h4>
                <p className="text-xs text-slate-600">Heads Grades 7 to 10 instruction, Special Science Curriculum (STE), and student services.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-900 font-bold">Asst. Principal - Senior High</div>
                <h4 className="text-base font-bold text-slate-900">Engr. Vicente G. Ramos</h4>
                <p className="text-xs text-slate-600">Coordinates Academic (STEM, HUMSS, ABM) and TVL tracks, TESDA assessments, and work immersion.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-900 font-bold">Head Teacher - Science & Math</div>
                <h4 className="text-base font-bold text-slate-900">Mrs. Josefina M. Alcala</h4>
                <p className="text-xs text-slate-600">Master Teacher II, Division Coach for Investigatory Projects and Regional Science Fair.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-900 font-bold">Head Teacher - Languages</div>
                <h4 className="text-base font-bold text-slate-900">Ms. Carmela V. Hernandez</h4>
                <p className="text-xs text-slate-600">Adviser for Campus Journalism (Ang Tinig & The Voice) and National Reading Month programs.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs uppercase tracking-wider text-blue-900 font-bold">Head Teacher - TVL & TLE</div>
                <h4 className="text-base font-bold text-slate-900">Engr. Danilo S. Morfe</h4>
                <p className="text-xs text-slate-600">TESDA Accredited Assessor for Computer Systems Servicing, Electrical Installation (EIM), and Electronics (EPAS) programs.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div key={idx} className="p-5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{fac.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{fac.desc}</p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
