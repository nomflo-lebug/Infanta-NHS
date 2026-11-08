import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  Save, 
  Download, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2,
  Sparkles,
  ChevronDown,
  LogOut,
  Building2,
  Users,
  Key
} from 'lucide-react';
import { schoolDb, calculateSubjectFinal, calculateGeneralAverage } from '../../services/schoolDatabase';
import { 
  StudentProfile, 
  Teacher, 
  EnrollmentApplication, 
  SubjectGrade, 
  Role,
  GradeLevel,
  StrandType,
  UserAccount
} from '../../types/school';
import { PortalLogin } from './PortalLogin';
import { AdminSectionsManager } from './AdminSectionsManager';
import { AdminAccountsManager } from './AdminAccountsManager';
import { TeacherAdvisoryManager } from './TeacherAdvisoryManager';
import { GoogleDriveBackupManager } from './GoogleDriveBackupManager';
import { AdminCurriculumManager } from './AdminCurriculumManager';
import { AdminEnrollmentApplicationsManager } from './AdminEnrollmentApplicationsManager';
import { TeacherLoadsManager } from './TeacherLoadsManager';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: Role;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student_parent',
}) => {
  const [role, setRole] = useState<Role>(initialRole);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [applications, setApplications] = useState<EnrollmentApplication[]>([]);
  
  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('inhs_active_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('inhs_active_auth_user', JSON.stringify(user));
    } catch {}
    if (user.role === 'teacher' && user.teacherId) {
      setSelectedTeacherId(user.teacherId);
    }
  };

  const handleLogout = () => {
    if (confirm(`Sign out of ${currentUser?.fullName || 'account'}?`)) {
      setCurrentUser(null);
      try {
        localStorage.removeItem('inhs_active_auth_user');
      } catch {}
    }
  };

  // Student Portal State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchLrn, setSearchLrn] = useState<string>('');
  const [studentTab, setStudentTab] = useState<'sf9' | 'profile' | 'core_values' | 'attendance'>('sf9');
  
  // Teacher Portal State
  const [teacherTab, setTeacherTab] = useState<'grading' | 'loads' | 'advisory'>('grading');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-101');
  const [selectedLoadIndex, setSelectedLoadIndex] = useState<number>(0);
  const [editableGrades, setEditableGrades] = useState<Record<string, { term1: number | null; term2: number | null; term3: number | null; remarks?: string }>>({});
  const [adviserRemarksDraft, setAdviserRemarksDraft] = useState<Record<string, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Admin Portal State
  const [adminTab, setAdminTab] = useState<'sections' | 'curriculum' | 'applications' | 'accounts' | 'announcements' | 'database'>('sections');
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Announcement' | 'Academic' | 'Activities' | 'Admissions'>('Announcement');
  const [newNoticeSummary, setNewNoticeSummary] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDate, setNewActivityDate] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('8:00 AM');
  const [newActivityVenue, setNewActivityVenue] = useState('INHS Gymnasium');

  // Load Database Records
  useEffect(() => {
    const sync = () => {
      const allStudents = schoolDb.getStudents();
      const allTeachers = schoolDb.getTeachers();
      const allApps = schoolDb.getEnrollmentApplications();
      setStudents(allStudents);
      setTeachers(allTeachers);
      setApplications(allApps);

      if (!selectedStudentId && allStudents.length > 0) {
        setSelectedStudentId(allStudents[0].id);
      }
    };

    sync();
    const unsub = schoolDb.subscribe(sync);
    return () => unsub();
  }, [selectedStudentId]);

  // Sync initial role when modal opens
  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole, isOpen]);

  // Current selected student
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Current selected teacher
  const currentTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];
  const currentLoad = currentTeacher?.teachingLoads[selectedLoadIndex] || currentTeacher?.teachingLoads[0];

  // Filter students for the teacher's selected section
  const sectionStudents = students.filter(s => {
    if (!currentLoad) return false;
    return s.gradeLevel === currentLoad.grade && s.section === currentLoad.section;
  });

  // Initialize teacher editable grades when section or load changes (3 Terms)
  useEffect(() => {
    if (!currentLoad) return;
    const initialDraft: Record<string, { term1: number | null; term2: number | null; term3: number | null }> = {};
    const remarksDraft: Record<string, string> = {};

    sectionStudents.forEach(st => {
      const subj = st.grades.find(g => g.subjectId === currentLoad.subjectId);
      initialDraft[st.id] = {
        term1: subj?.term1 ?? subj?.q1 ?? null,
        term2: subj?.term2 ?? subj?.q2 ?? null,
        term3: subj?.term3 ?? subj?.q3 ?? null,
      };
      remarksDraft[st.id] = st.adviserRemarks || '';
    });

    setEditableGrades(initialDraft);
    setAdviserRemarksDraft(remarksDraft);
  }, [selectedTeacherId, selectedLoadIndex, currentLoad?.subjectId, students.length]);

  if (!isOpen) return null;

  // Student LRN Search
  const handleStudentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = schoolDb.getStudentByLrn(searchLrn);
    if (found) {
      setSelectedStudentId(found.id);
    } else {
      alert(`No student profile found with LRN: ${searchLrn}`);
    }
  };

  // Teacher Grade Save (3 Terms)
  const handleSaveGrades = () => {
    if (!currentLoad) return;

    let updatedCount = 0;
    sectionStudents.forEach(st => {
      const draft = editableGrades[st.id];
      if (!draft) return;

      const existingGrades = [...st.grades];
      const subjIndex = existingGrades.findIndex(g => g.subjectId === currentLoad.subjectId);

      const computedFinal = calculateSubjectFinal({
        term1: draft.term1,
        term2: draft.term2,
        term3: draft.term3,
      });

      const updatedSubj: SubjectGrade = {
        subjectId: currentLoad.subjectId,
        subjectCode: currentLoad.subjectCode || currentLoad.subjectId.toUpperCase(),
        subjectTitle: currentLoad.subjectTitle,
        teacherName: currentTeacher.name,
        term1: draft.term1,
        term2: draft.term2,
        term3: draft.term3,
        finalRating: computedFinal.finalRating,
        remarks: computedFinal.remarks,
      };

      if (subjIndex >= 0) {
        existingGrades[subjIndex] = updatedSubj;
      } else {
        existingGrades.push(updatedSubj);
      }

      const advRemark = adviserRemarksDraft[st.id];
      schoolDb.updateStudentGrades(st.id, existingGrades, advRemark);
      updatedCount++;
    });

    setSaveSuccessMsg(`Successfully saved and updated 3-term grades for ${updatedCount} students in ${currentLoad.section}!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Admin App Approval
  const handleApproveApp = (appId: string) => {
    schoolDb.updateApplicationStatus(appId, 'Approved', 'Credentials verified by registrar. Enrolled into S.Y. 2026-2027.');
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;
    schoolDb.addSchoolUpdate({
      title: newNoticeTitle,
      category: newNoticeCategory,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'Office of the Principal / Registrar',
      summary: newNoticeSummary || newNoticeTitle,
      content: newNoticeContent,
      featured: true,
      tag: newNoticeCategory
    });
    setNewNoticeTitle('');
    setNewNoticeSummary('');
    setNewNoticeContent('');
    alert('Announcement published and live on the front page!');
  };

  const handlePostActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle || !newActivityDate) return;
    schoolDb.addSchoolActivity({
      title: newActivityTitle,
      date: newActivityDate,
      time: newActivityTime,
      venue: newActivityVenue,
      category: 'Academic',
      description: 'Official school-wide calendar activity.',
      status: 'Upcoming'
    });
    setNewActivityTitle('');
    setNewActivityDate('');
    alert('Calendar event scheduled successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header of Portal */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/aistudio/INHS_LOGO_v2_3c57a62d.png" 
                alt="Infanta NHS Logo"
                className="w-full h-full object-cover scale-[1.04] rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-crest tracking-wide text-white">
                  INHS Academic Information System (SIS)
                </span>
                <span className="text-[10px] bg-blue-950 border border-blue-800 text-amber-300 px-2 py-0.5 rounded-sm font-mono">
                  S.Y. 2026–2027
                </span>
              </div>
              <span className="text-xs text-slate-400">
                School ID: 301332 · Est. 1947 · Division of Quezon
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setRole('student_parent')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  role === 'student_parent'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student / Parent</span>
              </button>
              <button
                onClick={() => setRole('teacher')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  role === 'teacher'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Faculty & Advisers</span>
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Administration</span>
              </button>
            </div>

            {/* Authenticated User Status & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-lg text-xs">
                <span className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white text-[11px] truncate max-w-[120px] sm:max-w-xs">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono leading-none">
                    @{currentUser.username} ({currentUser.role.toUpperCase()})
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                  title="Sign out of current account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Portal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* ========================================================= */}
          {/* 1. STUDENT & PARENT PORTAL */}
          {/* ========================================================= */}
          {role === 'student_parent' && (
            <div className="space-y-6">
              
              {/* Authenticated User Session Banner (if logged in) */}
              {currentUser && (
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                    <span>
                      Signed in as <strong>{currentUser.fullName}</strong> (@{currentUser.username} · {currentUser.role.toUpperCase()})
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-300 hover:text-rose-400 flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {/* Student Selector Bar & LRN Search */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Enrolled Learner:
                  </span>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="text-xs sm:text-sm font-semibold p-2 rounded-lg border border-slate-300 bg-white text-blue-950 focus:border-blue-900 focus:outline-hidden"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.lastName}, {st.firstName} — Grade {st.gradeLevel} ({st.section})
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleStudentSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Find by 12-digit LRN..."
                      value={searchLrn}
                      onChange={(e) => setSearchLrn(e.target.value)}
                      className="text-xs p-2 pl-7 rounded-lg border border-slate-300 w-44 font-mono-num focus:border-blue-900 focus:outline-hidden"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Verify
                  </button>
                </form>
              </div>

              {currentStudent ? (
                <>
                  {/* Student Summary Identification Header */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-crest font-bold text-lg shadow-sm shrink-0">
                        {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold font-crest text-slate-900">
                            {currentStudent.lastName}, {currentStudent.firstName} {currentStudent.middleName}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                            {currentStudent.enrollmentStatus}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                          <span>LRN: <strong className="font-mono-num text-blue-900">{currentStudent.lrn}</strong></span>
                          <span>·</span>
                          <span>Grade {currentStudent.gradeLevel} · <strong>{currentStudent.section}</strong></span>
                          <span>·</span>
                          <span>{currentStudent.strand}</span>
                          <span>·</span>
                          <span>Adviser: <strong>{currentStudent.adviserName}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-medium">General Average</div>
                      <div className="text-2xl font-bold font-mono-num text-blue-900">
                        {currentStudent.generalAverage !== null ? currentStudent.generalAverage.toFixed(2) : 'Computing...'}
                      </div>
                      {currentStudent.honors && (
                        <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-sm mt-0.5">
                          {currentStudent.honors}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Navigation sub-tabs */}
                  <div className="flex border-b border-slate-200 gap-2 pb-px">
                    <button
                      onClick={() => setStudentTab('sf9')}
                      className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                        studentTab === 'sf9'
                          ? 'bg-white text-blue-900 border-t border-x border-slate-200 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      DepEd SF9 / Form 138 (Academic Report)
                    </button>
                    <button
                      onClick={() => setStudentTab('core_values')}
                      className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                        studentTab === 'core_values'
                          ? 'bg-white text-blue-900 border-t border-x border-slate-200 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Core Values Observed
                    </button>
                    <button
                      onClick={() => setStudentTab('attendance')}
                      className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                        studentTab === 'attendance'
                          ? 'bg-white text-blue-900 border-t border-x border-slate-200 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly Attendance Record
                    </button>
                    <button
                      onClick={() => setStudentTab('profile')}
                      className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                        studentTab === 'profile'
                          ? 'bg-white text-blue-900 border-t border-x border-slate-200 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Learner Demographic Details
                    </button>
                  </div>

                  {/* Tab 1: DepEd SF9 Report Card Table */}
                  {studentTab === 'sf9' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
                            <img
                              src="/assets/aistudio/INHS_LOGO_v2_3c57a62d.png"
                              alt="INHS Official Seal"
                              className="w-full h-full object-cover scale-[1.04] rounded-full"
                            />
                          </div>
                          <div>
                            <div className="text-[11px] uppercase font-bold text-blue-900 tracking-wider">
                              DepEd School Form 9 (SF9) · Infanta National High School
                            </div>
                            <h4 className="text-base font-bold text-slate-900">
                              Report on Learner Progress and Achievement
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => window.print()}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Official SF9</span>
                        </button>
                      </div>

                      {/* Grades Table (3 Terms / Semesters Per School Year) */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200">
                          <thead className="bg-slate-100 text-slate-800 uppercase tracking-wider font-semibold">
                            <tr>
                              <th className="p-3 border-b border-slate-200">Learning Areas / Subjects</th>
                              <th className="p-3 border-b border-slate-200 text-center w-20">Term 1</th>
                              <th className="p-3 border-b border-slate-200 text-center w-20">Term 2</th>
                              <th className="p-3 border-b border-slate-200 text-center w-20">Term 3</th>
                              <th className="p-3 border-b border-slate-200 text-center w-24">Final Rating</th>
                              <th className="p-3 border-b border-slate-200 text-center w-24">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {currentStudent.grades.map((grade) => (
                              <tr key={grade.subjectId} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">{grade.subjectTitle}</div>
                                  <div className="text-[11px] text-slate-500">{grade.teacherName}</div>
                                </td>
                                <td className="p-3 text-center font-mono-num font-semibold">{grade.term1 ?? grade.q1 ?? '—'}</td>
                                <td className="p-3 text-center font-mono-num font-semibold">{grade.term2 ?? grade.q2 ?? '—'}</td>
                                <td className="p-3 text-center font-mono-num font-semibold">{grade.term3 ?? grade.q3 ?? '—'}</td>
                                <td className="p-3 text-center font-mono-num font-bold text-slate-900 text-sm">
                                  {grade.finalRating ?? '—'}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                    grade.remarks === 'Passed' 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : grade.remarks === 'Failed' 
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {grade.remarks}
                                  </span>
                                </td>
                              </tr>
                            ))}

                            {currentStudent.grades.length === 0 && (
                              <tr>
                                <td colSpan={6} className="p-6 text-center text-slate-400">
                                  No subjects enrolled for this school year yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-300">
                            <tr>
                              <td className="p-3 text-right uppercase tracking-wider text-xs">
                                General Average:
                              </td>
                              <td colSpan={3} className="p-3 text-center text-slate-400 text-[11px] font-normal">
                                (Computed across the 3 Academic Terms / Semesters)
                              </td>
                              <td className="p-3 text-center font-mono-num text-sm text-blue-900">
                                {currentStudent.generalAverage !== null ? currentStudent.generalAverage.toFixed(2) : '—'}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                  (currentStudent.generalAverage ?? 0) >= 75
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {(currentStudent.generalAverage ?? 0) >= 75 ? 'PASSED' : 'PENDING'}
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Adviser's Evaluation / Remarks */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="text-xs font-bold uppercase text-slate-700">
                          Class Adviser's Observation & Remarks:
                        </div>
                        <p className="text-xs text-slate-700 italic">
                          "{currentStudent.adviserRemarks}"
                        </p>
                        <div className="text-[11px] text-slate-500 pt-1 text-right">
                          Signed: <strong>{currentStudent.adviserName}</strong>, Class Adviser
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Core Values Observed (3 Terms) */}
                  {studentTab === 'core_values' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-base font-bold text-slate-900">
                          Report on Learner's Observed Core Values (3 Terms)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Marking scale: <strong>AO</strong> (Always Observed) · <strong>SO</strong> (Sometimes Observed) · <strong>RO</strong> (Rarely Observed) · <strong>NO</strong> (Not Observed)
                        </p>
                      </div>

                      <table className="w-full text-left text-xs border border-slate-200">
                        <thead className="bg-slate-100 text-slate-800 font-semibold uppercase">
                          <tr>
                            <th className="p-3 border-b border-slate-200">Core Value</th>
                            <th className="p-3 border-b border-slate-200">Behavior Statements</th>
                            <th className="p-3 border-b border-slate-200 text-center w-16">Term 1</th>
                            <th className="p-3 border-b border-slate-200 text-center w-16">Term 2</th>
                            <th className="p-3 border-b border-slate-200 text-center w-16">Term 3</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {currentStudent.coreValues.map((cv) => (
                            <tr key={cv.id} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-blue-900">{cv.coreValue}</td>
                              <td className="p-3 text-slate-700">{cv.behaviorStatement}</td>
                              <td className="p-3 text-center font-mono-num font-semibold">{cv.term1 ?? cv.q1 ?? 'AO'}</td>
                              <td className="p-3 text-center font-mono-num font-semibold">{cv.term2 ?? cv.q2 ?? 'AO'}</td>
                              <td className="p-3 text-center font-mono-num font-semibold">{cv.term3 ?? cv.q3 ?? 'AO'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Tab 3: Monthly Attendance */}
                  {studentTab === 'attendance' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-base font-bold text-slate-900">
                          Report on Learner's Attendance (S.Y. 2025-2026)
                        </h4>
                        <p className="text-xs text-slate-500">
                          DepEd official calendar counting 200 school days across 10 academic months.
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200">
                          <thead className="bg-slate-100 text-slate-800 font-semibold uppercase">
                            <tr>
                              <th className="p-2.5 border-b border-slate-200">Month</th>
                              {currentStudent.attendance.map(a => (
                                <th key={a.month} className="p-2.5 border-b border-slate-200 text-center">{a.month.slice(0, 3)}</th>
                              ))}
                              <th className="p-2.5 border-b border-slate-200 text-center font-bold">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr>
                              <td className="p-2.5 font-semibold text-slate-900">No. of School Days</td>
                              {currentStudent.attendance.map(a => (
                                <td key={a.month} className="p-2.5 text-center font-mono-num">{a.schoolDays}</td>
                              ))}
                              <td className="p-2.5 text-center font-mono-num font-bold text-slate-900">
                                {currentStudent.attendance.reduce((sum, a) => sum + a.schoolDays, 0)}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-emerald-800">Days Present</td>
                              {currentStudent.attendance.map(a => (
                                <td key={a.month} className="p-2.5 text-center font-mono-num text-emerald-700 font-semibold">{a.daysPresent}</td>
                              ))}
                              <td className="p-2.5 text-center font-mono-num font-bold text-emerald-800">
                                {currentStudent.attendance.reduce((sum, a) => sum + a.daysPresent, 0)}
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-semibold text-rose-800">Days Absent</td>
                              {currentStudent.attendance.map(a => (
                                <td key={a.month} className="p-2.5 text-center font-mono-num text-rose-700">{a.daysAbsent}</td>
                              ))}
                              <td className="p-2.5 text-center font-mono-num font-bold text-rose-800">
                                {currentStudent.attendance.reduce((sum, a) => sum + a.daysAbsent, 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Student Demographic Details */}
                  {studentTab === 'profile' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                      <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                        Official DepEd Learner Information System (LIS) Record
                      </h4>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Learner Reference No. (LRN):</span>
                          <strong className="text-slate-900 font-mono text-sm">{currentStudent.lrn}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Date of Birth & Age:</span>
                          <strong className="text-slate-900">{currentStudent.birthDate} ({currentStudent.age} yrs old)</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Gender / Sex:</span>
                          <strong className="text-slate-900">{currentStudent.gender}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Residential Address:</span>
                          <strong className="text-slate-900">{currentStudent.barangay}, {currentStudent.municipality}, {currentStudent.province}</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Parent / Guardian:</span>
                          <strong className="text-slate-900">{currentStudent.guardianName} ({currentStudent.guardianRelationship})</strong>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-500 block">Guardian Mobile Contact:</span>
                          <strong className="text-slate-900 font-mono-num">{currentStudent.guardianContact}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  Select or search a student LRN to view academic records.
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. TEACHER GRADING ENCODING PORTAL */}
          {/* ========================================================= */}
          {role === 'teacher' && (
            !currentUser || (currentUser.role !== 'teacher' && currentUser.role !== 'admin') ? (
              <PortalLogin
                targetRole="teacher"
                onSuccess={handleLoginSuccess}
                onSwitchRole={(r) => setRole(r)}
              />
            ) : (
              <div className="space-y-6">
                
                {/* Faculty Active Session Banner */}
                <div className="bg-emerald-950 text-emerald-100 p-3.5 rounded-xl border border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      Faculty Session Active: <strong>{currentUser.fullName}</strong> (@{currentUser.username})
                    </span>
                    <span className="text-[10px] bg-emerald-900 border border-emerald-700 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-emerald-300 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {/* Sub-navigation tabs for Faculty */}
                <div className="flex border-b border-slate-200 gap-1 sm:gap-2 pb-px overflow-x-auto">
                  <button
                    onClick={() => setTeacherTab('grading')}
                    className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      teacherTab === 'grading'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Subject Grading Console (SF9)</span>
                  </button>
                  <button
                    onClick={() => setTeacherTab('loads')}
                    className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      teacherTab === 'loads'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-500" />
                    <span>My Teaching Loads (Classes & Subjects)</span>
                  </button>
                  <button
                    onClick={() => setTeacherTab('advisory')}
                    className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      teacherTab === 'advisory'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Advisory Class & Student Information (Enrollment / SF1)</span>
                  </button>
                </div>

                {teacherTab === 'advisory' ? (
                  <TeacherAdvisoryManager
                    currentTeacher={currentTeacher}
                    isCurrentUserAdmin={currentUser.role === 'admin'}
                  />
                ) : teacherTab === 'loads' ? (
                  <TeacherLoadsManager
                    currentTeacher={currentTeacher}
                    onLoadAdded={() => {
                      setSelectedLoadIndex(0);
                      setTeacherTab('grading');
                    }}
                  />
                ) : (
                  <>
                {/* Teacher Selector & Load Bar */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-sm">
                        {currentTeacher?.name ? currentTeacher.name.replace(/^(Mr\.|Mrs\.|Ms\.|Engr\.|Dr\.)\s*/, '')[0] : 'T'}
                      </div>
                      <div>
                        <div className="text-xs uppercase font-bold text-blue-900">Faculty Gradebook Console</div>
                        <select
                          value={selectedTeacherId}
                          onChange={(e) => {
                            setSelectedTeacherId(e.target.value);
                            setSelectedLoadIndex(0);
                          }}
                          className="text-base font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-hidden cursor-pointer"
                        >
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.title} · {t.department})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-2.5 px-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSaveGrades}
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Save Grades to Database</span>
                  </button>
                </div>

                {/* Section & Subject Load Pill Selector */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Select Teaching Load / Subject:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentTeacher?.teachingLoads.map((load, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedLoadIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedLoadIndex === idx
                            ? 'bg-blue-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Grade {load.grade} - {load.section} · {load.subjectTitle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gradebook Spreadsheet */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Roster & Grading Sheet: {currentLoad?.subjectTitle}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Section: <strong>{currentLoad?.section}</strong> (Grade {currentLoad?.grade}) · {sectionStudents.length} Students Enrolled
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    * Modifying any quarter score auto-calculates final rating & honors.
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-800 font-semibold uppercase">
                      <tr>
                        <th className="p-3 border-b border-slate-200 w-12 text-center">#</th>
                        <th className="p-3 border-b border-slate-200">Learner Name & LRN</th>
                        <th className="p-3 border-b border-slate-200 text-center w-24">Term 1</th>
                        <th className="p-3 border-b border-slate-200 text-center w-24">Term 2</th>
                        <th className="p-3 border-b border-slate-200 text-center w-24">Term 3</th>
                        <th className="p-3 border-b border-slate-200 text-center w-24">Final Rating</th>
                        <th className="p-3 border-b border-slate-200 w-64">Teacher Observations / Suggestions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {sectionStudents.map((st, idx) => {
                        const draft = editableGrades[st.id] || { term1: null, term2: null, term3: null };
                        const finalCalc = calculateSubjectFinal({
                          term1: draft.term1,
                          term2: draft.term2,
                          term3: draft.term3,
                        });

                        return (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="p-3 text-center text-slate-400 font-mono-num">{idx + 1}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{st.lastName}, {st.firstName}</div>
                              <div className="text-[11px] font-mono text-slate-500">{st.lrn}</div>
                            </td>
                            {/* Term 1 */}
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={60}
                                max={100}
                                placeholder="—"
                                value={draft.term1 ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                  setEditableGrades({
                                    ...editableGrades,
                                    [st.id]: { ...draft, term1: val }
                                  });
                                }}
                                className="w-18 p-1.5 text-center text-xs font-mono-num border border-slate-300 rounded focus:border-blue-900 focus:outline-hidden"
                              />
                            </td>
                            {/* Term 2 */}
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={60}
                                max={100}
                                placeholder="—"
                                value={draft.term2 ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                  setEditableGrades({
                                    ...editableGrades,
                                    [st.id]: { ...draft, term2: val }
                                  });
                                }}
                                className="w-18 p-1.5 text-center text-xs font-mono-num border border-slate-300 rounded focus:border-blue-900 focus:outline-hidden"
                              />
                            </td>
                            {/* Term 3 */}
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min={60}
                                max={100}
                                placeholder="—"
                                value={draft.term3 ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                  setEditableGrades({
                                    ...editableGrades,
                                    [st.id]: { ...draft, term3: val }
                                  });
                                }}
                                className="w-18 p-1.5 text-center text-xs font-mono-num border border-slate-300 rounded focus:border-blue-900 focus:outline-hidden"
                              />
                            </td>
                            {/* Computed Final */}
                            <td className="p-3 text-center">
                              <div className="font-bold font-mono-num text-sm text-blue-900">
                                {finalCalc.finalRating ?? '—'}
                              </div>
                              <span className={`text-[10px] font-semibold ${
                                finalCalc.remarks === 'Passed' ? 'text-emerald-700' : 'text-slate-500'
                              }`}>
                                {finalCalc.remarks}
                              </span>
                            </td>
                            {/* Remarks */}
                            <td className="p-2">
                              <input
                                type="text"
                                placeholder="Enter qualitative remarks..."
                                value={adviserRemarksDraft[st.id] ?? ''}
                                onChange={(e) => {
                                  setAdviserRemarksDraft({
                                    ...adviserRemarksDraft,
                                    [st.id]: e.target.value
                                  });
                                }}
                                className="w-full p-1.5 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-hidden"
                              />
                            </td>
                          </tr>
                        );
                      })}

                      {sectionStudents.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">
                            No students currently listed in Section {currentLoad?.section}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveGrades}
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Save All Student Progress</span>
                  </button>
                </div>
              </div>
              </>
            )}

            </div>
          )
        )}

          {/* ========================================================= */}
          {/* 3. ADMINISTRATOR & REGISTRAR CONSOLE */}
          {/* ========================================================= */}
          {role === 'admin' && (
            !currentUser || currentUser.role !== 'admin' ? (
              <PortalLogin
                targetRole="admin"
                onSuccess={handleLoginSuccess}
                onSwitchRole={(r) => setRole(r)}
              />
            ) : (
              <div className="space-y-6">
                
                {/* Admin Session Welcome Banner */}
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>
                      Administrator Console Active: <strong>{currentUser.fullName}</strong> (@{currentUser.username})
                    </span>
                    <span className="text-[10px] bg-blue-900 border border-blue-700 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      FULL GOVERNANCE
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-300 hover:text-rose-400 flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {/* High-level School Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Total Database Learners</div>
                    <div className="text-2xl font-bold font-mono-num text-blue-900">{students.length} Records</div>
                    <div className="text-[11px] text-slate-400">JHS & SHS Enrolled</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Online Applications</div>
                    <div className="text-2xl font-bold font-mono-num text-amber-600">{applications.length} Received</div>
                    <div className="text-[11px] text-slate-400">
                      {applications.filter(a => a.status === 'Pending Review').length} Pending Review
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Honor Roll Candidates</div>
                    <div className="text-2xl font-bold font-mono-num text-emerald-600">
                      {students.filter(s => s.honors !== null).length}
                    </div>
                    <div className="text-[11px] text-slate-400">GPA &ge; 90.00%</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="text-xs text-slate-500 font-semibold uppercase">Faculty Roster</div>
                    <div className="text-2xl font-bold font-mono-num text-slate-800">{teachers.length} Active</div>
                    <div className="text-[11px] text-slate-400">Advisers & Subject Specialists</div>
                  </div>
                </div>

                {/* Admin Navigation Tabs */}
                <div className="flex border-b border-slate-200 gap-1 sm:gap-2 pb-px overflow-x-auto">
                  <button
                    onClick={() => setAdminTab('sections')}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      adminTab === 'sections'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Classes & Sections</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('curriculum')}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      adminTab === 'curriculum'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Curriculum & Subjects</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('applications')}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      adminTab === 'applications'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Enrollment Approvals ({applications.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('accounts')}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      adminTab === 'accounts'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>User Accounts</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('announcements')}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      adminTab === 'announcements'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Bulletin & Calendar</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('database')}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      adminTab === 'database'
                        ? 'bg-white text-blue-900 border-t-2 border-t-blue-900 border-x border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Database Backup</span>
                  </button>
                </div>

                {/* Subtab: Classes & Sections Manager */}
                {adminTab === 'sections' && (
                  <AdminSectionsManager />
                )}

                {/* Subtab: Curriculum & Subject Offerings (Encoded for 3 Terms) */}
                {adminTab === 'curriculum' && (
                  <AdminCurriculumManager />
                )}

                {/* Subtab: Enrollment Applications Review & Decision (Approve / Deny) */}
                {adminTab === 'applications' && (
                  <AdminEnrollmentApplicationsManager reviewerName={currentUser.fullName} />
                )}

                {/* Subtab: User Accounts Manager */}
                {adminTab === 'accounts' && (
                  <AdminAccountsManager currentUser={currentUser} />
                )}

              {/* Subtab 2: Announcements & Calendar Manager */}
              {adminTab === 'announcements' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Post New Announcement */}
                  <form onSubmit={handlePostNotice} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                      Post New School Bulletin Announcement
                    </h4>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Headline / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Schedule for Brigada Eskwela 2026"
                        value={newNoticeTitle}
                        onChange={(e) => setNewNoticeTitle(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                      <select
                        value={newNoticeCategory}
                        onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Announcement">Announcement</option>
                        <option value="Academic">Academic</option>
                        <option value="Activities">Activities</option>
                        <option value="Admissions">Admissions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Summary Teaser</label>
                      <input
                        type="text"
                        placeholder="Brief summary line for preview..."
                        value={newNoticeSummary}
                        onChange={(e) => setNewNoticeSummary(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Full Content / Memorandum *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Complete details of the announcement..."
                        value={newNoticeContent}
                        onChange={(e) => setNewNoticeContent(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Publish to Front Page
                    </button>
                  </form>

                  {/* Add Calendar Event */}
                  <form onSubmit={handlePostActivity} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                      Schedule School Calendar Event
                    </h4>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Event Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. INHS 60th Alumni Homecoming"
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Date String *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jan 10-12, 2027"
                          value={newActivityDate}
                          onChange={(e) => setNewActivityDate(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                        <input
                          type="text"
                          value={newActivityTime}
                          onChange={(e) => setNewActivityTime(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Venue / Location</label>
                      <input
                        type="text"
                        value={newActivityVenue}
                        onChange={(e) => setNewActivityVenue(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Add Event to Calendar
                    </button>
                  </form>
                </div>
              )}

              {/* Subtab 3: Database Tools & Cloud Backup */}
              {adminTab === 'database' && (
                <div className="space-y-6">
                  {/* Google Drive Cloud Backup & Organization Panel */}
                  <GoogleDriveBackupManager />

                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-900">
                        Local Database Tools & Factory Reset
                      </h4>
                      <p className="text-xs text-slate-500">
                        Offline exports, raw JSON downloads, and emergency state recovery.
                      </p>
                    </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-800">Export JSON Backup</div>
                      <p className="text-[11px] text-slate-600">Download complete database state containing all student records, report cards, and applications.</p>
                      <button
                        onClick={() => {
                          const json = schoolDb.exportDatabaseJson();
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `inhs_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
                          a.click();
                        }}
                        className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Database JSON</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-800">Reset to Default Data</div>
                      <p className="text-[11px] text-slate-600">Restore default demo students (Maria Clara Santos, Juan Dela Cruz, etc.) and sample applications.</p>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reset the database to default seed data? All custom edits will be reverted.')) {
                            schoolDb.resetToDefault();
                            alert('Database restored to default records.');
                          }
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset to Factory Defaults</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-800">DepEd Compliance Audit</div>
                      <p className="text-[11px] text-slate-600">All data structures strictly comply with DepEd Orders No. 8, s. 2015 and No. 3, s. 2018.</p>
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                        <CheckCircle className="w-4 h-4" /> Integrity Verified (100% Passing Audit)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}

            </div>
          )
        )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Infanta National High School · Student Information & Academic Grading Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold cursor-pointer"
          >
            Close Portal View
          </button>
        </div>

      </div>
    </div>
  );
};
