import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Sparkles,
  Layers,
  X,
  Save,
  Check
} from 'lucide-react';
import { schoolDb } from '../../services/schoolDatabase';
import { Teacher, TeachingLoad, SchoolClassSection, CurriculumSubject, GradeLevel, TermSemester } from '../../types/school';

interface TeacherLoadsManagerProps {
  currentTeacher: Teacher;
  onLoadAdded?: (newLoad: TeachingLoad) => void;
}

export const TeacherLoadsManager: React.FC<TeacherLoadsManagerProps> = ({
  currentTeacher,
  onLoadAdded,
}) => {
  const [sections, setSections] = useState<SchoolClassSection[]>([]);
  const [curriculumSubjects, setCurriculumSubjects] = useState<CurriculumSubject[]>([]);
  const [teacher, setTeacher] = useState<Teacher>(currentTeacher);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<TermSemester>(1);
  const [subjectSource, setSubjectSource] = useState<'curriculum' | 'custom'>('curriculum');
  const [selectedCurriculumSubjId, setSelectedCurriculumSubjId] = useState<string>('');
  const [customSubjectCode, setCustomSubjectCode] = useState('');
  const [customSubjectTitle, setCustomSubjectTitle] = useState('');
  const [scheduleTime, setScheduleTime] = useState('MWF 8:00 - 9:00 AM');
  const [roomNumber, setRoomNumber] = useState('');

  // Alerts
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const sync = () => {
      const allSections = schoolDb.getSections();
      const allSubjects = schoolDb.getCurriculumSubjects();
      setSections(allSections);
      setCurriculumSubjects(allSubjects);

      const refreshedTeacher = schoolDb.getTeacherById(currentTeacher.id);
      if (refreshedTeacher) {
        setTeacher(refreshedTeacher);
      }
    };
    sync();
    const unsub = schoolDb.subscribe(sync);
    return () => unsub();
  }, [currentTeacher.id]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAddModal = () => {
    if (sections.length > 0) {
      setSelectedSectionId(sections[0].id);
      setRoomNumber(sections[0].roomNumber || 'Rm 101');
    }
    setSelectedTerm(1);
    setSubjectSource('curriculum');
    setSelectedCurriculumSubjId('');
    setCustomSubjectCode('');
    setCustomSubjectTitle('');
    setScheduleTime('MWF 8:00 - 9:00 AM');
    setShowAddModal(true);
  };

  const currentSelectedSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  // Filter curriculum subjects for selected section's grade level and selected term
  const availableSubjectsForSection = curriculumSubjects.filter(s => {
    if (!currentSelectedSection) return false;
    return s.gradeLevel === currentSelectedSection.gradeLevel && s.term === selectedTerm;
  });

  const handleAddTeachingLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedSection) {
      alert('Please select a valid section.');
      return;
    }

    let subjCode = '';
    let subjTitle = '';
    let subjId = '';

    if (subjectSource === 'curriculum') {
      const foundSubj = curriculumSubjects.find(s => s.id === selectedCurriculumSubjId) || availableSubjectsForSection[0];
      if (!foundSubj) {
        alert('Please select a subject from the encoded curriculum offerings, or choose "Custom Subject" to enter manually.');
        return;
      }
      subjCode = foundSubj.subjectCode;
      subjTitle = foundSubj.subjectTitle;
      subjId = foundSubj.id;
    } else {
      if (!customSubjectTitle.trim()) {
        alert('Please enter a subject title.');
        return;
      }
      subjCode = customSubjectCode.trim().toUpperCase() || `SUBJ-${Math.floor(100 + Math.random() * 900)}`;
      subjTitle = customSubjectTitle.trim();
      subjId = `subj-${Date.now().toString().slice(-6)}`;
    }

    const created = schoolDb.addTeacherTeachingLoad(teacher.id, {
      grade: currentSelectedSection.gradeLevel,
      section: currentSelectedSection.sectionName,
      sectionId: currentSelectedSection.id,
      subjectId: subjId,
      subjectCode: subjCode,
      subjectTitle: subjTitle,
      term: selectedTerm,
      schedule: scheduleTime.trim() || undefined,
      room: (roomNumber.trim() || currentSelectedSection.roomNumber) || undefined,
    });

    if (created) {
      showToast('success', `Assigned ${subjTitle} in ${currentSelectedSection.sectionName} (Term ${selectedTerm}) to your teaching load!`);
      setShowAddModal(false);
      if (onLoadAdded) onLoadAdded(created);
    } else {
      showToast('error', 'Failed to add teaching load.');
    }
  };

  const handleRemoveLoad = (load: TeachingLoad) => {
    if (confirm(`Remove "${load.subjectTitle}" in ${load.section} (Term ${load.term}) from your teaching loads?`)) {
      const ok = schoolDb.removeTeacherTeachingLoad(teacher.id, load.id);
      if (ok) {
        showToast('success', `Removed ${load.subjectTitle} from teaching loads.`);
      } else {
        showToast('error', 'Failed to remove teaching load.');
      }
    }
  };

  const teachingLoads = teacher.teachingLoads || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
              Faculty Teaching Assignments
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
              Active Faculty: {teacher.name}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-crest tracking-tight text-slate-900 mt-1">
            My Teaching Loads & Class Sections
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add or manage the subjects and class sections you are currently teaching. Once added, students in these sections will automatically appear in your Subject Grading Console.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add Teaching Class / Subject</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {toast && (
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Teaching Loads Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachingLoads.map((load, idx) => {
          const sectionData = sections.find(s => s.sectionName === load.section);
          const studentCount = sectionData ? sectionData.studentIds.length : 0;

          return (
            <div key={load.id || idx} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 hover:border-blue-300 transition-colors shadow-2xs relative group">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    load.term === 1 ? 'bg-blue-100 text-blue-900' : load.term === 2 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    Term {load.term} (Semester {load.term})
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {load.subjectTitle}
                  </h4>
                  {load.subjectCode && (
                    <span className="font-mono text-[10px] text-slate-500 font-semibold block">
                      {load.subjectCode}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleRemoveLoad(load)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Remove teaching load"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    Grade {load.grade} — {load.section}
                  </span>
                </div>

                {load.room && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Venue: {load.room}</span>
                  </div>
                )}

                {load.schedule && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Schedule: {load.schedule}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <span>Enrolled Students:</span>
                  <strong className="font-mono text-blue-950 font-bold">{studentCount} Learners</strong>
                </div>
              </div>
            </div>
          );
        })}

        {teachingLoads.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h5 className="text-sm font-bold text-slate-700">No Teaching Classes Assigned Yet</h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Click the button above to assign the subjects you teach and the class sections you handle for S.Y. 2026–2027.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: Add Teaching Load / Class */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 text-amber-300 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-crest text-white">
                    Add Subject & Section to Teach
                  </h4>
                  <div className="text-xs text-slate-400">
                    Faculty: {teacher.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddTeachingLoad} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs text-slate-800 bg-slate-50">
              
              {/* Select Section */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Select Class Section to Teach *
                </label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => {
                    setSelectedSectionId(e.target.value);
                    const sec = sections.find(s => s.id === e.target.value);
                    if (sec?.roomNumber) setRoomNumber(sec.roomNumber);
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold text-blue-950 focus:outline-hidden focus:border-blue-900 cursor-pointer"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      Grade {s.gradeLevel} — {s.sectionName} ({s.strand})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Grade Level: <strong>Grade {currentSelectedSection?.gradeLevel}</strong> · Adviser: <strong>{currentSelectedSection?.adviserName}</strong>
                </span>
              </div>

              {/* Select Term */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Select Academic Term / Semester *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { term: 1, label: 'Term 1 (1st Sem)' },
                    { term: 2, label: 'Term 2 (2nd Sem)' },
                    { term: 3, label: 'Term 3 (3rd Sem)' }
                  ].map(t => (
                    <button
                      key={t.term}
                      type="button"
                      onClick={() => setSelectedTerm(t.term as TermSemester)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer text-center ${
                        selectedTerm === t.term
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selection Mode */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Select Subject Source *
                </label>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-300">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="subjSource"
                      checked={subjectSource === 'curriculum'}
                      onChange={() => setSubjectSource('curriculum')}
                      className="accent-blue-900"
                    />
                    <span>From Official Encoded Curriculum</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="subjSource"
                      checked={subjectSource === 'custom'}
                      onChange={() => setSubjectSource('custom')}
                      className="accent-blue-900"
                    />
                    <span>Custom Subject / Elective</span>
                  </label>
                </div>
              </div>

              {/* Option A: Curriculum Subject Dropdown */}
              {subjectSource === 'curriculum' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Subject for Grade {currentSelectedSection?.gradeLevel} (Term {selectedTerm}) *
                  </label>
                  {availableSubjectsForSection.length > 0 ? (
                    <select
                      value={selectedCurriculumSubjId || availableSubjectsForSection[0]?.id}
                      onChange={(e) => setSelectedCurriculumSubjId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900 cursor-pointer"
                    >
                      {availableSubjectsForSection.map(subj => (
                        <option key={subj.id} value={subj.id}>
                          {subj.subjectCode} — {subj.subjectTitle} ({subj.units} hrs)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                      No encoded subjects found for Grade {currentSelectedSection?.gradeLevel} in Term {selectedTerm}. Switch to "Custom Subject" or contact Admin to encode in Curriculum offerings.
                    </div>
                  )}
                </div>
              ) : (
                /* Option B: Custom Subject Fields */
                <div className="space-y-3 bg-white p-3 rounded-lg border border-slate-300">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SCI-ADV10, ROBOTICS-1"
                      value={customSubjectCode}
                      onChange={(e) => setCustomSubjectCode(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 font-mono uppercase focus:outline-hidden focus:border-blue-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subject Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Applied Electronics & Robotics"
                      value={customSubjectTitle}
                      onChange={(e) => setCustomSubjectTitle(e.target.value)}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-hidden focus:border-blue-900 text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Schedule and Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Schedule Days & Time</label>
                  <input
                    type="text"
                    placeholder="e.g. MWF 8:00 - 9:00 AM"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-hidden focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Classroom Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Lab Rm 201"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs focus:outline-hidden focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Assign to My Teaching Loads</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
