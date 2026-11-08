import React, { useState } from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  Palette, 
  Trophy, 
  Check, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

interface JuniorHighSectionProps {
  onNavigateToEnroll: () => void;
}

export const JuniorHighSection: React.FC<JuniorHighSectionProps> = ({ onNavigateToEnroll }) => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<'ste' | 'regular' | 'spa_sps'>('ste');

  const regularSubjects = [
    { name: 'Filipino', desc: 'Ibong Adarna (Gr 7), Florante at Laura (Gr 8), Noli Me Tangere (Gr 9), El Filibusterismo (Gr 10)' },
    { name: 'English', desc: 'Philippine Literature, Afro-Asian Literature, Anglo-American Literature, World Literature' },
    { name: 'Mathematics', desc: 'Integrated Number Systems, Elementary Algebra, Deductive Geometry, Trigonometry & Statistics' },
    { name: 'Science', desc: 'General Science, Earth & Space, Living Things & Environment, Force, Motion & Energy' },
    { name: 'Araling Panlipunan', desc: 'Araling Asyano, Kasaysayan ng Daigdig, Ekonomiks, Mga Kontemporaryong Isyu' },
    { name: 'Edukasyon sa Pagpapakatao (EsP)', desc: 'Character education, moral discernment, ethical values, and civic responsibility' },
    { name: 'TLE (Tech & Livelihood Educ)', desc: 'Exploratory mini-courses in ICT, Agri-Fishery, Home Economics, and Industrial Arts' },
    { name: 'MAPEH', desc: 'Music, Arts, Physical Education, and Health with cultural folk dances and sports skills' },
  ];

  const steSubjects = [
    { title: 'Grade 7 STE', electives: 'Environmental Science, Scientific Methods, Integrated Science & Pre-Algebra' },
    { title: 'Grade 8 STE', electives: 'Biotechnology & Genetics, Advance Geometry, Investigatory Research Proposal' },
    { title: 'Grade 9 STE', electives: 'Consumer Chemistry, Advance Trigonometry, Investigatory Project Execution' },
    { title: 'Grade 10 STE', electives: 'Advance Physics & Calculus Foundations, Research Defense & Regional Science Fair' },
  ];

  return (
    <section id="junior-high" className="py-20 bg-white border-b border-slate-200 scroll-mt-48 sm:scroll-mt-52 lg:scroll-mt-56">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
            Grades 7 to 10 Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Junior High School Curriculum
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Building strong academic foundations in science, mathematics, language, and vocational exploratory skills to prepare adolescent learners for higher academic tracks and life.
          </p>
        </div>

        {/* Curriculum Selector Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px mb-8">
          <button
            onClick={() => setSelectedCurriculum('ste')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedCurriculum === 'ste'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-blue-700" />
            <span>Special Science Program (STE)</span>
          </button>
          <button
            onClick={() => setSelectedCurriculum('regular')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedCurriculum === 'regular'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Regular K-12 Curriculum</span>
          </button>
          <button
            onClick={() => setSelectedCurriculum('spa_sps')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedCurriculum === 'spa_sps'
                ? 'text-blue-900 border-b-2 border-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>Special Programs in Arts & Sports</span>
          </button>
        </div>

        {/* Tab 1: STE Program */}
        {selectedCurriculum === 'ste' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Flagship Academic Program</span>
                </div>
                <h3 className="text-2xl font-bold font-crest text-slate-900">
                  Science, Technology, and Engineering (STE) Program
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The STE Program is a specialized curriculum designed for scientifically and mathematically inclined learners. Students undergo rigorous laboratory experiments, investigatory project defense, and competitive mathematical training under Division and Regional mentor-coaches.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {steSubjects.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold uppercase text-blue-900">{item.title}</div>
                    <p className="text-xs text-slate-600">{item.electives}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-950 space-y-1">
                <strong>Retention & Screening Requirements:</strong>
                <div>Students must maintain a quarterly grade of at least 85% in Science, Mathematics, and English with no grade lower than 83% in any learning area, demonstrating continued scholastic dedication.</div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h4 className="text-lg font-bold font-crest text-amber-300">
                Why Choose Infanta NHS STE?
              </h4>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Research Mentorship:</strong> Direct coaching from Master Teachers for the National Science and Technology Fair (NSTF).</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Modern Laboratory Access:</strong> Specialized digital testing kits, microscopes, and chemical preparation areas.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Seamless Senior High Pathway:</strong> Automatic prioritization into the Grade 11 STEM strand.</span>
                </div>
              </div>

              <button
                onClick={onNavigateToEnroll}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for STE Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Regular Curriculum */}
        {selectedCurriculum === 'regular' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold font-crest text-slate-900">
                DepEd Enhanced Basic Education Curriculum
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                A holistic, culture-based, and child-friendly standard curriculum spanning 8 fundamental learning areas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {regularSubjects.map((sub, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xs transition-all space-y-1.5">
                  <div className="text-xs font-bold text-blue-900 uppercase">{sub.name}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sub.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span><strong>Grading Standard:</strong> DepEd Order No. 8, s. 2015 based on Written Work (30-40%), Performance Tasks (40-50%), and Quarterly Assessments (20%).</span>
              <button 
                onClick={onNavigateToEnroll}
                className="text-blue-900 font-bold hover:underline cursor-pointer"
              >
                Enroll Online &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: SPA & SPS */}
        {selectedCurriculum === 'spa_sps' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-900 text-emerald-200 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Special Program in the Arts (SPA)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nurtures student talents in Visual Arts, Music (vocal and instrumental drum & lyre), Creative Writing, Theatre Arts, and Dance (folk and contemporary). Students showcase their craft in annual school cultural festivals and division competitions.
              </p>
              <div className="text-xs font-semibold text-emerald-800">Majors: Visual Arts · Rondalla & Vocal Music · Folk Dance · Drama</div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Special Program in Sports (SPS)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated athletic training integrated with academic subjects. Geared towards high-potential student-athletes competing in Palarong Pampaaralan, provincial meets, and regional athletic meets across badminton, track & field, basketball, volleyball, and sepaktakraw.
              </p>
              <div className="text-xs font-semibold text-blue-900">Disciplines: Athletics · Basketball · Volleyball · Table Tennis · Badminton</div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
