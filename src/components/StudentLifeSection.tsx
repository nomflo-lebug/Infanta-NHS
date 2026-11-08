import React, { useState } from 'react';
import { 
  Users, 
  Newspaper, 
  Compass, 
  HeartHandshake, 
  Leaf, 
  Music, 
  Trophy, 
  Calendar,
  Sparkles
} from 'lucide-react';

import studentLifeImg from '../assets/images/school_student_life_1793804199202.jpg';

export const StudentLifeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sslg' | 'journalism' | 'clubs' | 'events'>('sslg');

  const clubs = [
    {
      name: 'Youth for Environment in Schools (YES-O)',
      icon: Leaf,
      lead: 'Environmental Protection',
      desc: 'Active coastal mangrove reforestation in Dinahican, zero-plastic waste advocacy, and vegetable seed dispersal programs.',
    },
    {
      name: 'Boy Scouts & Girl Scouts of the Philippines',
      icon: Compass,
      lead: 'Character & Survival Skills',
      desc: 'Annual jamborees, knot tying, civic discipline, emergency first-aid drills, and honor guard services for civic parades in Infanta.',
    },
    {
      name: 'Red Cross Youth (RCY) Council',
      icon: HeartHandshake,
      lead: 'Humanitarian & First-Aid',
      desc: 'Certified cardiopulmonary resuscitation (CPR) training, voluntary blood donor recruitment, and school health advocacy.',
    },
    {
      name: 'INHS Drum & Lyre Corps & Marching Band',
      icon: Music,
      lead: 'Music & Cultural Arts',
      desc: 'The official marching ensemble representing Infanta NHS during foundation days, municipal town fiestas, and division parade ceremonies.',
    },
    {
      name: 'Science & Math Explorers Guild',
      icon: Sparkles,
      lead: 'Scholastic Competitions',
      desc: 'Math challenge training, robotics programming exhibitions, science investigatory project brainstorming, and inter-school quiz bees.',
    },
    {
      name: 'Athletic Association (Tamaraws)',
      icon: Trophy,
      lead: 'Competitive Sports',
      desc: 'Varsity sports teams in basketball, volleyball, badminton, athletics, chess, and sepaktakraw for provincial meets.',
    },
  ];

  return (
    <section id="student-life" className="py-20 bg-white border-b border-slate-200 scroll-mt-48 sm:scroll-mt-52 lg:scroll-mt-56">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
            Holistic Learner Development
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Vibrant Student Life & Organizations
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Beyond academic classrooms, Infanta High empowers young leaders, journalists, athletes, artists, and environmental stewards through meaningful co-curricular participation.
          </p>
        </div>

        {/* Media Feature Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg border border-slate-200">
          <div className="grid lg:grid-cols-12 items-center bg-slate-900 text-white">
            <div className="lg:col-span-5 h-64 lg:h-full min-h-[280px] order-last lg:order-first">
              <img
                src={studentLifeImg}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/school_student_life_1793804199202.jpg';
                }}
                alt="Infanta NHS Learner Government Council and Student Life"
                className="w-full h-full object-cover object-center filter brightness-95"
              />
            </div>
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Youth Leadership & Governance
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-crest leading-snug">
                Supreme Secondary Learner Government (SSLG)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The SSLG is the highest governing student body of Infanta National High School. Elected by the student body, learner leaders organize anti-bullying initiatives, coastal clean-ups, mental health symposiums, and student rights dialogues in close partnership with school administration and the PTA.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400 font-mono-num">
                <span>· 100% Student-Led Initiatives</span>
                <span>· Democratic Election Every S.Y.</span>
                <span>· DepEd Order No. 47, s. 2014 Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px mb-8">
          <button
            onClick={() => setActiveTab('sslg')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sslg'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Learner Government & Leadership
          </button>
          <button
            onClick={() => setActiveTab('journalism')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'journalism'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Campus Journalism (Ang Tinig & The Voice)
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'clubs'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Clubs & Special Interest Groups
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'events'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Annual Traditions & Events
          </button>
        </div>

        {/* Tab 1: SSLG */}
        {activeTab === 'sslg' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Core Leadership Focus
              </div>
              <h4 className="text-base font-bold text-slate-900">Learner Rights & Inclusivity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The SSLG functions as the voice of every student. It conducts open forums with class presidents and submits student feedback regarding classroom conditions, library resources, and fair grading policies directly to the principal's office.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Community Outreach
              </div>
              <h4 className="text-base font-bold text-slate-900">Luntian Infanta Ecological Drive</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spearheading tree planting and coastal clean-up operations in coastal barangays such as Dinahican and Binulasan, reinforcing Infanta NHS's commitment to the Makakalikasan core value.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Peer Mentorship
              </div>
              <h4 className="text-base font-bold text-slate-900">Barkada Kontra Droga (BKD)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A structured peer-to-peer anti-substance abuse and mental wellness movement encouraging positive youth activities, sports clinics, and creative arts outlets.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Journalism */}
        {activeTab === 'journalism' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-blue-900" />
                <div>
                  <h4 className="text-lg font-bold font-crest text-slate-900">Ang Tinig (The Voice - Filipino)</h4>
                  <span className="text-xs text-slate-500">Opisyal na Pampaaralang Pahayagan sa Filipino</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "Ang Tinig" has consistently earned awards in the Division Schools Press Conference (DSPC) and Regional Schools Press Conference (RSPC) for Editorial Writing (Editoryal), Column Writing (Kolum), Feature Writing (Lathalain), News Writing (Balita), and Radio Broadcasting.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                <strong>Tagapayo:</strong> Gng. Carmela V. Hernandez · Kasapi ng Association of Secondary School Paper Advisers (ASSPA)
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-amber-600" />
                <div>
                  <h4 className="text-lg font-bold font-crest text-slate-900">The Voice (English Publication)</h4>
                  <span className="text-xs text-slate-500">Official Campus Newspaper in English</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The school's English publication develops critical investigative reporters, photojournalists, science journalists, and layout graphic artists. Trains student writers in media ethics, digital publication, and fact-checking.
              </p>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                <strong>Adviser:</strong> Ms. Elena P. Alcantara · Division Champion in Collaborative Desktop Publishing (English)
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Clubs */}
        {activeTab === 'clubs' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="p-5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xs transition-all space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900">{c.lead}</div>
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Events */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-amber-600">August</div>
                <h5 className="text-sm font-bold text-slate-900">Brigada Eskwela & Balik-Eskwela</h5>
                <p className="text-xs text-slate-600">Community bayanihan painting classrooms, preparing desks, and repairing disaster shelters.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-amber-600">October</div>
                <h5 className="text-sm font-bold text-slate-900">Foundation Day & Science Month</h5>
                <p className="text-xs text-slate-600">Celebrating 60 years of public education, science investigatory fairs, and alumni grand reunion.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-amber-600">December</div>
                <h5 className="text-sm font-bold text-slate-900">Palarong Pampaaralan (Intramurals)</h5>
                <p className="text-xs text-slate-600">Three-day sports festival uniting Junior High levels and Senior High tracks in athletics.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold uppercase text-amber-600">May / June</div>
                <h5 className="text-sm font-bold text-slate-900">Moving-Up & Graduation Rites</h5>
                <p className="text-xs text-slate-600">Solemn commencement rites honoring Junior High completers and Senior High graduates.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
