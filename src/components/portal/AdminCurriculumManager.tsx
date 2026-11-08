import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Layers, 
  Clock, 
  FileText, 
  GraduationCap, 
  Building2,
  X,
  Save,
  Sparkles
} from 'lucide-react';
import { schoolDb } from '../../services/schoolDatabase';
import { CurriculumSubject, GradeLevel, TermSemester, TrackType, StrandType } from '../../types/school';

export const AdminCurriculumManager: React.FC = () => {
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Adding / Editing
  const [showModal, setShowModal] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formGrade, setFormGrade] = useState<GradeLevel>(7);
  const [formTerm, setFormTerm] = useState<TermSemester>(1);
  const [formTrack, setFormTrack] = useState<TrackType>('Junior High School');
  const [formStrand, setFormStrand] = useState<string>('All Strands');
  const [formUnits, setFormUnits] = useState<number>(4);
  const [formDepartment, setFormDepartment] = useState('Languages & Humanities');
  const [formDescription, setFormDescription] = useState('');

  // Alerts
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const sync = () => {
      setSubjects(schoolDb.getCurriculumSubjects());
    };
    sync();
    const unsub = schoolDb.subscribe(sync);
    return () => unsub();
  }, []);

  const notify = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredSubjects = subjects.filter(s => {
    if (selectedGrade !== 'All' && s.gradeLevel.toString() !== selectedGrade) {
      return false;
    }
    if (selectedTerm !== 'All' && s.term.toString() !== selectedTerm) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const code = s.subjectCode.toLowerCase();
      const title = s.subjectTitle.toLowerCase();
      const dept = (s.department || '').toLowerCase();
      return code.includes(q) || title.includes(q) || dept.includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingSubjectId(null);
    setFormCode('');
    setFormTitle('');
    setFormGrade(selectedGrade !== 'All' ? Number(selectedGrade) as GradeLevel : 7);
    setFormTerm(selectedTerm !== 'All' ? Number(selectedTerm) as TermSemester : 1);
    setFormTrack(Number(selectedGrade) >= 11 ? 'Academic Track' : 'Junior High School');
    setFormStrand('All Strands');
    setFormUnits(4);
    setFormDepartment('Science & Mathematics');
    setFormDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (subj: CurriculumSubject) => {
    setEditingSubjectId(subj.id);
    setFormCode(subj.subjectCode);
    setFormTitle(subj.subjectTitle);
    setFormGrade(subj.gradeLevel);
    setFormTerm(subj.term);
    setFormTrack(subj.track);
    setFormStrand(subj.strand || 'All Strands');
    setFormUnits(subj.units);
    setFormDepartment(subj.department || 'General');
    setFormDescription(subj.description || '');
    setShowModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formTitle.trim()) {
      alert('Please fill out Subject Code and Subject Title.');
      return;
    }

    if (editingSubjectId) {
      const ok = schoolDb.updateCurriculumSubject(editingSubjectId, {
        subjectCode: formCode.trim().toUpperCase(),
        subjectTitle: formTitle.trim(),
        gradeLevel: formGrade,
        term: formTerm,
        track: formTrack,
        strand: formStrand === 'All Strands' ? undefined : (formStrand as StrandType),
        units: Number(formUnits),
        department: formDepartment.trim(),
        description: formDescription.trim(),
      });
      if (ok) {
        notify('success', `Subject ${formCode.toUpperCase()} updated successfully.`);
        setShowModal(false);
      } else {
        notify('error', 'Failed to update subject.');
      }
    } else {
      const created = schoolDb.addCurriculumSubject({
        subjectCode: formCode.trim().toUpperCase(),
        subjectTitle: formTitle.trim(),
        gradeLevel: formGrade,
        term: formTerm,
        track: formTrack,
        strand: formStrand === 'All Strands' ? undefined : (formStrand as StrandType),
        units: Number(formUnits),
        department: formDepartment.trim(),
        description: formDescription.trim(),
      });
      notify('success', `Subject ${created.subjectCode} added to Grade ${created.gradeLevel} Term ${created.term}.`);
      setShowModal(false);
    }
  };

  const handleDeleteSubject = (subj: CurriculumSubject) => {
    if (confirm(`Are you sure you want to delete ${subj.subjectCode} - ${subj.subjectTitle}?`)) {
      schoolDb.deleteCurriculumSubject(subj.id);
      notify('success', `Deleted ${subj.subjectCode}.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset curriculum subject catalog to official DepEd standard offerings across all 3 terms?')) {
      schoolDb.resetCurriculumToDefault();
      notify('success', 'Curriculum offerings reset to DepEd baseline for all 3 terms.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
              Academic Curriculum Encoding
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-mono font-bold">
              3 Terms / Semesters Per Year
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-crest tracking-tight text-slate-900 mt-1">
            Official Subject Offerings by Year Level & Term
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Encode and manage all official learning areas and curriculum subjects for Grades 7 to 12 across Term 1, Term 2, and Term 3.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-900 hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restore standard DepEd subjects across all 3 terms"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Encode New Subject</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        {/* Term / Semester Pills - Highlighted for 3 terms */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Term / Semester:
            </span>
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setSelectedTerm('All')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedTerm === 'All' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                All 3 Terms
              </button>
              <button
                onClick={() => setSelectedTerm('1')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedTerm === '1' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                Term 1 (1st Sem)
              </button>
              <button
                onClick={() => setSelectedTerm('2')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedTerm === '2' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                Term 2 (2nd Sem)
              </button>
              <button
                onClick={() => setSelectedTerm('3')}
                className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedTerm === '3' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:text-blue-900'
                }`}
              >
                Term 3 (3rd Sem)
              </button>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Showing <strong>{filteredSubjects.length}</strong> encoded subjects
          </div>
        </div>

        {/* Grade Level Selector & Keyword Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">Year Level:</span>
            <div className="flex flex-wrap gap-1">
              {['All', '7', '8', '9', '10', '11', '12'].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {g === 'All' ? 'All Grades' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search code, title, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-hidden focus:border-blue-900"
            />
          </div>
        </div>
      </div>

      {/* Curriculum Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-3 w-28">Subject Code</th>
              <th className="p-3">Subject Title & Scope</th>
              <th className="p-3 text-center w-20">Grade</th>
              <th className="p-3 text-center w-28">Term / Sem</th>
              <th className="p-3">Track / Strand</th>
              <th className="p-3 text-center w-20">Units / Hrs</th>
              <th className="p-3 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSubjects.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-mono font-bold text-blue-950">
                  {s.subjectCode}
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 text-sm">{s.subjectTitle}</div>
                  <div className="text-[11px] text-slate-500">{s.department}</div>
                  {s.description && (
                    <div className="text-[10px] text-slate-400 italic line-clamp-1">{s.description}</div>
                  )}
                </td>
                <td className="p-3 text-center font-bold text-slate-800">
                  Grade {s.gradeLevel}
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                    s.term === 1 
                      ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                      : s.term === 2 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    Term {s.term}
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-800">{s.track}</div>
                  {s.strand && (
                    <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 mt-0.5">
                      {s.strand}
                    </span>
                  )}
                </td>
                <td className="p-3 text-center font-mono font-semibold text-slate-700">
                  {s.units} hrs
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      title="Edit Subject"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(s)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredSubjects.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No subjects found matching the filter criteria. Click "Encode New Subject" to add.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* MODAL: Encode / Edit Curriculum Subject */}
      {/* ========================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 text-amber-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-crest text-white">
                    {editingSubjectId ? 'Modify Curriculum Subject' : 'Encode New Curriculum Subject'}
                  </h4>
                  <div className="text-xs text-slate-400">
                    S.Y. 2026–2027 Academic Offerings
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSubject} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs text-slate-800 bg-slate-50">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MATH7-T1, STEM-PHYS1"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono uppercase focus:outline-hidden focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekly Units / Hours *</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono focus:outline-hidden focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science 7 (Scientific Investigation & Matter)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-blue-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Level *</label>
                  <select
                    value={formGrade}
                    onChange={(e) => {
                      const g = Number(e.target.value) as GradeLevel;
                      setFormGrade(g);
                      if (g >= 11) {
                        setFormTrack('Academic Track');
                      } else {
                        setFormTrack('Junior High School');
                      }
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold cursor-pointer"
                  >
                    <option value={7}>Grade 7 (Junior High)</option>
                    <option value={8}>Grade 8 (Junior High)</option>
                    <option value={9}>Grade 9 (Junior High)</option>
                    <option value={10}>Grade 10 (Junior High)</option>
                    <option value={11}>Grade 11 (Senior High)</option>
                    <option value={12}>Grade 12 (Senior High)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Term / Semester (3 per School Year) *
                  </label>
                  <select
                    value={formTerm}
                    onChange={(e) => setFormTerm(Number(e.target.value) as TermSemester)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold text-blue-950 cursor-pointer"
                  >
                    <option value={1}>Term 1 (First Term / 1st Trimester)</option>
                    <option value={2}>Term 2 (Second Term / 2nd Trimester)</option>
                    <option value={3}>Term 3 (Third Term / 3rd Trimester)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Track</label>
                  <select
                    value={formTrack}
                    onChange={(e) => setFormTrack(e.target.value as TrackType)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                  >
                    <option value="Junior High School">Junior High School</option>
                    <option value="Academic Track">Academic Track (SHS)</option>
                    <option value="TVL Track">TVL Track (SHS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strand / Program Specialization</label>
                  <select
                    value={formStrand}
                    onChange={(e) => setFormStrand(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                  >
                    <option value="All Strands">All Strands / Core Subject</option>
                    <option value="Regular JHS">Regular JHS</option>
                    <option value="Special Science Program (STE)">Special Science Program (STE)</option>
                    <option value="STEM">STEM</option>
                    <option value="ABM">ABM</option>
                    <option value="HUMSS">HUMSS</option>
                    <option value="TVL - ICT (Computer Systems)">TVL - ICT (Computer Systems)</option>
                    <option value="TVL - Home Economics">TVL - Home Economics</option>
                    <option value="TVL - Electrical Installation and Maintenance (EIM)">TVL - Electrical Installation (EIM)</option>
                    <option value="TVL - Electronic Products Assembly and Servicing (EPAS)">TVL - Electronics (EPAS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                >
                  <option value="Science & Mathematics">Science & Mathematics</option>
                  <option value="Languages & Humanities">Languages & Humanities</option>
                  <option value="Social Sciences & Araling Panlipunan">Social Sciences & Araling Panlipunan</option>
                  <option value="Technical-Vocational & Livelihood (TVL)">Technical-Vocational & Livelihood (TVL)</option>
                  <option value="MAPEH & Values Education">MAPEH & Values Education</option>
                  <option value="Senior High Academic Core">Senior High Academic Core</option>
                  <option value="Research & Capstone">Research & Capstone</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Learning Competency / Description</label>
                <textarea
                  rows={2}
                  placeholder="Key topics, prerequisites, laboratory hours..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-blue-900"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{editingSubjectId ? 'Update Subject' : 'Save Subject to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
