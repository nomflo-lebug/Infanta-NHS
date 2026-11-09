import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  UserMinus, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  FileText, 
  Sparkles,
  X,
  Save,
  ChevronDown,
  Cloud,
  Upload
} from 'lucide-react';
import { schoolDb } from '../../services/schoolDatabase';
import { backupSectionSF1ToDrive, signInWithGoogle, getAccessToken } from '../../services/googleDriveService';
import { 
  StudentProfile, 
  SchoolClassSection, 
  Teacher, 
  GradeLevel, 
  StrandType,
  INFANTA_BARANGAYS 
} from '../../types/school';

interface TeacherAdvisoryManagerProps {
  currentTeacher: Teacher;
  isCurrentUserAdmin?: boolean;
}

export const TeacherAdvisoryManager: React.FC<TeacherAdvisoryManagerProps> = ({
  currentTeacher,
  isCurrentUserAdmin = false,
}) => {
  const [sections, setSections] = useState<SchoolClassSection[]>(schoolDb.getSections());
  const [students, setStudents] = useState<StudentProfile[]>(schoolDb.getStudents());
  
  // Find sections where this teacher is adviser
  const teacherAdvSections = sections.filter(
    s => s.adviserId === currentTeacher.id || s.adviserName === currentTeacher.name
  );

  // If no direct adviser section found or admin, fallback to first available or allow selection
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    teacherAdvSections[0]?.id || sections[0]?.id || ''
  );

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollMode, setEnrollMode] = useState<'existing' | 'new'>('existing');
  const [selectedStudentToEnroll, setSelectedStudentToEnroll] = useState('');

  // Editing student state
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editMiddleName, setEditMiddleName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editExtension, setEditExtension] = useState('');
  const [editLrn, setEditLrn] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female'>('Male');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editAge, setEditAge] = useState(15);
  const [editBarangay, setEditBarangay] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editGuardianName, setEditGuardianName] = useState('');
  const [editGuardianRelationship, setEditGuardianRelationship] = useState('Mother');
  const [editGuardianContact, setEditGuardianContact] = useState('');
  const [editAdviserRemarks, setEditAdviserRemarks] = useState('');

  // New Student Profile Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newMiddleName, setNewMiddleName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newExtension, setNewExtension] = useState('');
  const [newLrn, setNewLrn] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female'>('Male');
  const [newBirthDate, setNewBirthDate] = useState('2010-01-01');
  const [newBarangay, setNewBarangay] = useState('Barangay Poblacion 38');
  const [newContact, setNewContact] = useState('0917-000-0000');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianRelationship, setNewGuardianRelationship] = useState('Mother');
  const [newGuardianContact, setNewGuardianContact] = useState('0917-000-0000');
  const [newRemarks, setNewRemarks] = useState('Officially enrolled by class adviser.');

  // Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  const handleBackupSF1ToDrive = async () => {
    if (!currentSection) return;
    
    if (!confirm(`Upload official DepEd SF1 Register for "${currentSection.sectionName}" (${sectionStudents.length} learners) to the linked Google Drive folder?`)) {
      return;
    }

    setIsUploadingToDrive(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let token = await getAccessToken();
      if (!token) {
        const res = await signInWithGoogle();
        token = res.accessToken;
      }

      await backupSectionSF1ToDrive(currentSection, sectionStudents);
      setSuccessMessage(`Success! SF1 School Register for "${currentSection.sectionName}" has been uploaded to your Google Drive folder.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to upload SF1 to Google Drive.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const refreshData = () => {
    setSections(schoolDb.getSections());
    setStudents(schoolDb.getStudents());
  };

  useEffect(() => {
    const unsub = schoolDb.subscribe(refreshData);
    return () => unsub();
  }, []);

  const currentSection = sections.find(s => s.id === selectedSectionId) || teacherAdvSections[0] || sections[0];

  // Students in this advisory section
  const sectionStudents = students.filter(s => {
    if (!currentSection) return false;
    return s.section === currentSection.sectionName || currentSection.studentIds?.includes(s.id);
  });

  // Students available to enroll
  const unassignedStudents = students.filter(s => {
    if (!currentSection) return false;
    return s.section !== currentSection.sectionName && !currentSection.studentIds?.includes(s.id);
  });

  // Filtered by search
  const displayedStudents = sectionStudents.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.lrn.includes(q) ||
      s.guardianName.toLowerCase().includes(q)
    );
  });

  // Open Edit Modal with student info
  const handleStartEdit = (st: StudentProfile) => {
    setEditingStudent(st);
    setEditFirstName(st.firstName);
    setEditMiddleName(st.middleName || '');
    setEditLastName(st.lastName);
    setEditExtension(st.extensionName || '');
    setEditLrn(st.lrn);
    setEditGender(st.gender);
    setEditBirthDate(st.birthDate || '2010-01-01');
    setEditAge(st.age || 15);
    setEditBarangay(st.barangay || 'Barangay Poblacion 38');
    setEditContact(st.contactNumber || '');
    setEditGuardianName(st.guardianName || '');
    setEditGuardianRelationship(st.guardianRelationship || 'Parent');
    setEditGuardianContact(st.guardianContact || '');
    setEditAdviserRemarks(st.adviserRemarks || '');
    setErrorMessage(null);
  };

  // Save Modified Student Information
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (!editFirstName.trim() || !editLastName.trim() || !editLrn.trim()) {
      setErrorMessage('First name, last name, and LRN are required.');
      return;
    }

    const updated: StudentProfile = {
      ...editingStudent,
      firstName: editFirstName.trim(),
      middleName: editMiddleName.trim(),
      lastName: editLastName.trim(),
      extensionName: editExtension.trim() || undefined,
      lrn: editLrn.trim(),
      gender: editGender,
      birthDate: editBirthDate,
      age: Number(editAge),
      barangay: editBarangay.trim(),
      contactNumber: editContact.trim(),
      guardianName: editGuardianName.trim(),
      guardianRelationship: editGuardianRelationship.trim(),
      guardianContact: editGuardianContact.trim(),
      adviserRemarks: editAdviserRemarks.trim(),
    };

    schoolDb.saveStudent(updated);
    setSuccessMessage(`Updated information for ${updated.firstName} ${updated.lastName} successfully!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    setEditingStudent(null);
    refreshData();
  };

  // Enroll existing student
  const handleEnrollExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSection || !selectedStudentToEnroll) return;

    schoolDb.addStudentToSection(currentSection.id, selectedStudentToEnroll);
    const stud = students.find(s => s.id === selectedStudentToEnroll);

    setSuccessMessage(`Enrolled "${stud?.firstName} ${stud?.lastName}" into ${currentSection.sectionName}!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    setSelectedStudentToEnroll('');
    setShowEnrollModal(false);
    refreshData();
  };

  // Add & Enroll New Student Profile
  const handleEnrollNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSection) return;

    if (!newFirstName.trim() || !newLastName.trim()) {
      setErrorMessage('First Name and Last Name are required.');
      return;
    }

    const created = schoolDb.createAndAssignStudent(currentSection.id, {
      firstName: newFirstName.trim(),
      middleName: newMiddleName.trim() || undefined,
      lastName: newLastName.trim(),
      gender: newGender,
      lrn: newLrn.trim() || undefined,
      guardianName: newGuardianName.trim() || undefined,
      contactNumber: newContact.trim() || undefined,
    });

    if (created) {
      // Update additional fields if provided
      const fullCreated: StudentProfile = {
        ...created,
        extensionName: newExtension.trim() || undefined,
        birthDate: newBirthDate,
        barangay: newBarangay.trim(),
        guardianRelationship: newGuardianRelationship.trim(),
        guardianContact: newGuardianContact.trim(),
        adviserRemarks: newRemarks.trim() || `Enrolled by adviser ${currentTeacher.name}.`,
      };
      schoolDb.saveStudent(fullCreated);

      setSuccessMessage(`Learner "${fullCreated.firstName} ${fullCreated.lastName}" (LRN: ${fullCreated.lrn}) enrolled successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);

      // Reset
      setNewFirstName('');
      setNewMiddleName('');
      setNewLastName('');
      setNewExtension('');
      setNewLrn('');
      setNewGuardianName('');
      setShowEnrollModal(false);
      refreshData();
    }
  };

  // Remove student from section
  const handleRemoveFromSection = (student: StudentProfile) => {
    if (!currentSection) return;
    if (confirm(`Remove "${student.firstName} ${student.lastName}" from your advisory section (${currentSection.sectionName})?`)) {
      schoolDb.removeStudentFromSection(currentSection.id, student.id);
      setSuccessMessage(`Student "${student.firstName} ${student.lastName}" removed from advisory section.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      refreshData();
    }
  };

  // Delete student profile completely
  const handleDeleteStudent = (student: StudentProfile) => {
    if (confirm(`Permanent action: Delete student record for "${student.firstName} ${student.lastName}" (LRN: ${student.lrn}) from the school database?`)) {
      schoolDb.deleteStudent(student.id);
      setSuccessMessage(`Student record permanently removed.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Advisory Header & Section Switcher */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                Class Adviser Management Console
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Adviser: {currentTeacher.name} ({currentTeacher.title})
              </h3>
              <p className="text-xs text-slate-500">
                Enroll, remove, and update personal & academic records of learners in your advisory section.
              </p>
            </div>
          </div>

          {/* Section Selector if teacher advises or if admin */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Advisory Class:</span>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="text-xs sm:text-sm font-bold text-blue-950 p-2 rounded-lg border border-slate-300 bg-slate-50 focus:border-blue-900 focus:outline-hidden cursor-pointer"
            >
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.sectionName} (Grade {sec.gradeLevel} · {sec.strand})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Section Profile Card */}
        {currentSection && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-crest text-slate-900">{currentSection.sectionName}</span>
                <span className="bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded text-[10px]">
                  Grade {currentSection.gradeLevel} · {currentSection.track}
                </span>
                <span className="bg-amber-100 text-amber-900 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  Rm: {currentSection.roomNumber}
                </span>
              </div>
              <div className="text-slate-600">
                Strand: <strong>{currentSection.strand}</strong> · School Year: <strong>2026–2027</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-bold text-slate-900 font-mono-num text-sm">
                  {sectionStudents.length} / {currentSection.maxCapacity || 45} Learners
                </div>
                <div className="text-[11px] text-slate-500">
                  {sectionStudents.filter(s => s.gender === 'Male').length} Male · {sectionStudents.filter(s => s.gender === 'Female').length} Female
                </div>
              </div>

              <button
                onClick={() => setShowEnrollModal(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll Learner</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Roster Table & Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Official Class Roster ({displayedStudents.length} Learners)
            </h4>
            <span className="text-[11px] text-slate-500">
              * Click "Edit Details" to modify any learner's profile, contact, or guardian info.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learner name or LRN..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden w-48 sm:w-64"
              />
            </div>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer no-print transition-colors"
              title="Print DepEd SF1 School Register"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print SF1</span>
            </button>

            <button
              onClick={handleBackupSF1ToDrive}
              disabled={isUploadingToDrive}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer no-print transition-colors disabled:opacity-50"
              title="Upload official SF1 School Register to linked Google Drive folder"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-700" />
              <span>{isUploadingToDrive ? 'Uploading...' : 'Save SF1 to Drive'}</span>
            </button>
          </div>
        </div>

        {/* Table of Students */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-8">#</th>
                <th className="p-3">Learner Name</th>
                <th className="p-3">LRN (12 Digits)</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Age / Birth Date</th>
                <th className="p-3">Address & Guardian</th>
                <th className="p-3">Adviser Remarks</th>
                <th className="p-3 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                  
                  <td className="p-3">
                    <div className="font-bold text-slate-900">
                      {st.lastName}, {st.firstName} {st.middleName ? `${st.middleName[0]}.` : ''} {st.extensionName || ''}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-num">
                      ID: {st.id} · {st.enrollmentStatus}
                    </div>
                  </td>

                  <td className="p-3 font-mono font-semibold text-blue-900">
                    {st.lrn}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      st.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {st.gender}
                    </span>
                  </td>

                  <td className="p-3 text-slate-600">
                    <div>{st.age} years old</div>
                    <div className="text-[10px] text-slate-400 font-mono">{st.birthDate}</div>
                  </td>

                  <td className="p-3 text-slate-700">
                    <div>{st.guardianName} ({st.guardianRelationship})</div>
                    <div className="text-[10px] text-slate-500 font-mono-num">{st.guardianContact || st.contactNumber}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{st.barangay}</div>
                  </td>

                  <td className="p-3 text-slate-600 italic text-[11px] max-w-[160px]">
                    <span className="line-clamp-2">{st.adviserRemarks || 'No remarks recorded.'}</span>
                  </td>

                  <td className="p-3 text-right no-print">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleStartEdit(st)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Modify student information"
                      >
                        <Edit3 className="w-3 h-3 text-blue-700" />
                        <span>Edit Info</span>
                      </button>

                      <button
                        onClick={() => handleRemoveFromSection(st)}
                        className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded cursor-pointer transition-colors"
                        title="Remove learner from your class (unenroll)"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteStudent(st)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                        title="Permanently delete learner record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayedStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-300" />
                    <p>No students found matching your criteria.</p>
                    <button
                      onClick={() => setShowEnrollModal(true)}
                      className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Enroll Students into {currentSection?.sectionName}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. ENROLL STUDENT MODAL (Existing or New Learner) */}
      {/* ========================================================================= */}
      {showEnrollModal && currentSection && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Enroll Student into {currentSection.sectionName}
                </h4>
                <span className="text-xs text-slate-500">
                  Adviser: {currentTeacher.name} · S.Y. 2026–2027
                </span>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mode switch */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setEnrollMode('existing')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                  enrollMode === 'existing'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Select Unassigned Student ({unassignedStudents.length})
              </button>
              <button
                type="button"
                onClick={() => setEnrollMode('new')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                  enrollMode === 'new'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Register New Learner
              </button>
            </div>

            {/* Sub-mode A: Select existing student */}
            {enrollMode === 'existing' && (
              <form onSubmit={handleEnrollExisting} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Learner to Enroll *
                  </label>
                  <select
                    required
                    value={selectedStudentToEnroll}
                    onChange={(e) => setSelectedStudentToEnroll(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="">-- Choose student from database --</option>
                    {unassignedStudents.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.lastName}, {st.firstName} (LRN: {st.lrn}) — Status: {st.section || 'Unassigned'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-[11px] leading-relaxed">
                  Enrolling this learner will assign them to <strong>{currentSection.sectionName}</strong> and set you ({currentTeacher.name}) as their official class adviser.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStudentToEnroll}
                    className="px-5 py-2 bg-emerald-800 disabled:bg-slate-300 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                  >
                    Enroll Learner
                  </button>
                </div>
              </form>
            )}

            {/* Sub-mode B: Register complete new learner profile */}
            {enrollMode === 'new' && (
              <form onSubmit={handleEnrollNewStudent} className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="e.g. Jose"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="e.g. Rizal"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={newMiddleName}
                      onChange={(e) => setNewMiddleName(e.target.value)}
                      placeholder="e.g. Protacio"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Extension (Jr./III)</label>
                    <input
                      type="text"
                      value={newExtension}
                      onChange={(e) => setNewExtension(e.target.value)}
                      placeholder="e.g. Jr."
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">DepEd 12-Digit LRN</label>
                    <input
                      type="text"
                      maxLength={12}
                      value={newLrn}
                      onChange={(e) => setNewLrn(e.target.value)}
                      placeholder="Leave empty to auto-generate"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender / Sex *</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={newBirthDate}
                      onChange={(e) => setNewBirthDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Barangay (Infanta, Quezon)</label>
                    <select
                      value={newBarangay}
                      onChange={(e) => setNewBarangay(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {INFANTA_BARANGAYS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      value={newGuardianName}
                      onChange={(e) => setNewGuardianName(e.target.value)}
                      placeholder="e.g. Teodora Alonso"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Guardian Relationship</label>
                    <input
                      type="text"
                      value={newGuardianRelationship}
                      onChange={(e) => setNewGuardianRelationship(e.target.value)}
                      placeholder="e.g. Mother, Father, Guardian"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Guardian Mobile Contact</label>
                    <input
                      type="text"
                      value={newGuardianContact}
                      onChange={(e) => setNewGuardianContact(e.target.value)}
                      placeholder="e.g. 0917-123-4567"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student Mobile</label>
                    <input
                      type="text"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      placeholder="e.g. 0919-876-5432"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Adviser Remarks</label>
                  <input
                    type="text"
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    placeholder="e.g. Enrolled in regular academic curriculum with complete credentials."
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                  >
                    Register & Enroll Learner
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODIFY STUDENT INFORMATION MODAL */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 my-auto animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Modify Student Information
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    LRN: {editingStudent.lrn} · {editingStudent.section}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudentEdit} className="space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Names */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={editMiddleName}
                    onChange={(e) => setEditMiddleName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* LRN & Extension */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">DepEd 12-Digit LRN *</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={editLrn}
                    onChange={(e) => setEditLrn(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Extension</label>
                  <input
                    type="text"
                    value={editExtension}
                    onChange={(e) => setEditExtension(e.target.value)}
                    placeholder="e.g. Jr., III"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Gender, Birth Date, Age */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender / Sex *</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={10}
                    max={25}
                    value={editAge}
                    onChange={(e) => setEditAge(parseInt(e.target.value, 10))}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Address & Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Barangay (Infanta)</label>
                  <select
                    value={editBarangay}
                    onChange={(e) => setEditBarangay(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {INFANTA_BARANGAYS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Learner Contact Number</label>
                  <input
                    type="text"
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Full Name</label>
                  <input
                    type="text"
                    value={editGuardianName}
                    onChange={(e) => setEditGuardianName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={editGuardianRelationship}
                    onChange={(e) => setEditGuardianRelationship(e.target.value)}
                    placeholder="Mother, Father"
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guardian Mobile Contact</label>
                <input
                  type="text"
                  value={editGuardianContact}
                  onChange={(e) => setEditGuardianContact(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              {/* Narrative remarks for SF9 */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adviser Narrative Remarks (DepEd SF9 Report Card)
                </label>
                <textarea
                  rows={2}
                  value={editAdviserRemarks}
                  onChange={(e) => setEditAdviserRemarks(e.target.value)}
                  placeholder="e.g. Shows commendable aptitude in mathematics and science. Demonstrates respectful conduct."
                  className="w-full p-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>Save Updated Information</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
