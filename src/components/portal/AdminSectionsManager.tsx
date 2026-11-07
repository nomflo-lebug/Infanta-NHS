import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  UserPlus, 
  GraduationCap, 
  Trash2, 
  Edit3, 
  Printer, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ChevronRight, 
  Filter,
  Layers,
  Sparkles,
  BookOpen,
  Lock,
  Key,
  ShieldAlert
} from 'lucide-react';
import { schoolDb } from '../../services/schoolDatabase';
import { 
  SchoolClassSection, 
  StudentProfile, 
  Teacher, 
  GradeLevel, 
  TrackType, 
  StrandType 
} from '../../types/school';

export const AdminSectionsManager: React.FC = () => {
  const [sections, setSections] = useState<SchoolClassSection[]>(schoolDb.getSections());
  const [students, setStudents] = useState<StudentProfile[]>(schoolDb.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(schoolDb.getTeachers());

  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'All' | GradeLevel>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Section Roster Drawer / Modal
  const [activeRosterSection, setActiveRosterSection] = useState<SchoolClassSection | null>(null);

  // Edit Section State (Requires Admin Password)
  const [editingSection, setEditingSection] = useState<SchoolClassSection | null>(null);
  const [editSectionName, setEditSectionName] = useState('');
  const [editGradeLevel, setEditGradeLevel] = useState<GradeLevel>(7);
  const [editTrack, setEditTrack] = useState<TrackType>('Junior High School');
  const [editStrand, setEditStrand] = useState<StrandType>('Regular JHS');
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editAdviserId, setEditAdviserId] = useState('');
  const [editMaxCapacity, setEditMaxCapacity] = useState(45);
  const [editAdminPassword, setEditAdminPassword] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Section State (Requires Admin Password)
  const [deletingSection, setDeletingSection] = useState<SchoolClassSection | null>(null);
  const [deleteAdminPassword, setDeleteAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Create Section Modal
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [newGradeLevel, setNewGradeLevel] = useState<GradeLevel>(7);
  const [newSectionName, setNewSectionName] = useState('');
  const [newTrack, setNewTrack] = useState<TrackType>('Junior High School');
  const [newStrand, setNewStrand] = useState<StrandType>('Regular JHS');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newAdviserId, setNewAdviserId] = useState<string>(teachers[0]?.id || '');
  const [newMaxCapacity, setNewMaxCapacity] = useState<number>(45);

  // Add Student to Section Drawer / Modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentAssignMode, setStudentAssignMode] = useState<'existing' | 'quick_new'>('existing');
  const [selectedStudentToAssign, setSelectedStudentToAssign] = useState<string>('');
  
  // Quick New Student Form
  const [quickFirstName, setQuickFirstName] = useState('');
  const [quickMiddleName, setQuickMiddleName] = useState('');
  const [quickLastName, setQuickLastName] = useState('');
  const [quickGender, setQuickGender] = useState<'Male' | 'Female'>('Male');
  const [quickLrn, setQuickLrn] = useState('');
  const [quickGuardian, setQuickGuardian] = useState('');
  const [quickContact, setQuickContact] = useState('');

  // Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshData = () => {
    setSections(schoolDb.getSections());
    setStudents(schoolDb.getStudents());
    setTeachers(schoolDb.getTeachers());
  };

  // Adjust Track & Strand defaults when Grade Level changes
  const handleGradeLevelChange = (g: GradeLevel) => {
    setNewGradeLevel(g);
    if (g <= 10) {
      setNewTrack('Junior High School');
      setNewStrand('Regular JHS');
    } else {
      setNewTrack('Academic Track');
      setNewStrand('STEM');
    }
  };

  // Create Class / Section
  const handleCreateSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!newSectionName.trim() || !newRoomNumber.trim()) {
      setErrorMessage('Please fill in section name and room designation.');
      return;
    }

    const adviser = teachers.find(t => t.id === newAdviserId) || teachers[0];

    const created = schoolDb.addSection({
      gradeLevel: newGradeLevel,
      sectionName: newSectionName.trim(),
      track: newTrack,
      strand: newStrand,
      roomNumber: newRoomNumber.trim(),
      adviserId: adviser?.id || 't-101',
      adviserName: adviser?.name || 'Faculty Member',
      schoolYear: '2026–2027',
      maxCapacity: newMaxCapacity || 45,
    });

    setSuccessMessage(`Section "${created.sectionName}" created successfully!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    // Reset
    setNewSectionName('');
    setNewRoomNumber('');
    setShowCreateSectionModal(false);
    refreshData();
  };

  // Open Edit Section Modal
  const handleOpenEditSection = (sec: SchoolClassSection) => {
    setEditingSection(sec);
    setEditSectionName(sec.sectionName);
    setEditGradeLevel(sec.gradeLevel);
    setEditTrack(sec.track);
    setEditStrand(sec.strand);
    setEditRoomNumber(sec.roomNumber);
    setEditAdviserId(sec.adviserId);
    setEditMaxCapacity(sec.maxCapacity || 45);
    setEditAdminPassword('');
    setEditError(null);
  };

  // Submit Edit Section with Admin Password requirement
  const handleSaveEditSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    if (!editSectionName.trim() || !editRoomNumber.trim()) {
      setEditError('Section name and room number are required.');
      return;
    }

    if (!schoolDb.verifyAdminPassword(editAdminPassword)) {
      setEditError('Authentication failed: Incorrect Admin password. Section modification not authorized.');
      return;
    }

    const adviser = teachers.find(t => t.id === editAdviserId) || teachers[0];
    const prevName = editingSection.sectionName;
    const newName = editSectionName.trim();

    schoolDb.updateSection(editingSection.id, {
      sectionName: newName,
      gradeLevel: editGradeLevel,
      track: editTrack,
      strand: editStrand,
      roomNumber: editRoomNumber.trim(),
      adviserId: adviser?.id || 't-101',
      adviserName: adviser?.name || 'Faculty Member',
      maxCapacity: editMaxCapacity || 45,
    });

    // If section name changed, update student records enrolled in it
    if (prevName !== newName) {
      students.forEach(st => {
        if (st.section === prevName) {
          schoolDb.saveStudent({
            ...st,
            section: newName,
            gradeLevel: editGradeLevel,
            track: editTrack,
            strand: editStrand,
            adviserId: adviser?.id || st.adviserId,
            adviserName: adviser?.name || st.adviserName,
          });
        }
      });
    }

    setSuccessMessage(`Section "${newName}" modified successfully!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    setEditingSection(null);
    refreshData();
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteSection = (sec: SchoolClassSection) => {
    setDeletingSection(sec);
    setDeleteAdminPassword('');
    setDeleteError(null);
  };

  // Confirm Delete Section with Admin Password requirement
  const handleConfirmDeleteSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingSection) return;

    if (!schoolDb.verifyAdminPassword(deleteAdminPassword)) {
      setDeleteError('Authentication failed: Incorrect Admin password. Deletion not authorized.');
      return;
    }

    // Unassign students
    students.forEach(st => {
      if (st.section === deletingSection.sectionName) {
        schoolDb.saveStudent({
          ...st,
          section: 'Unassigned',
        });
      }
    });

    schoolDb.deleteSection(deletingSection.id);
    setSuccessMessage(`Section "${deletingSection.sectionName}" permanently deleted.`);
    setTimeout(() => setSuccessMessage(null), 3500);

    if (activeRosterSection?.id === deletingSection.id) {
      setActiveRosterSection(null);
    }
    setDeletingSection(null);
    refreshData();
  };

  // Assign Existing Student to Active Section
  const handleAssignExistingStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRosterSection || !selectedStudentToAssign) return;

    schoolDb.addStudentToSection(activeRosterSection.id, selectedStudentToAssign);
    const assignedStud = students.find(s => s.id === selectedStudentToAssign);

    setSuccessMessage(`Enrolled "${assignedStud?.firstName} ${assignedStud?.lastName}" into ${activeRosterSection.sectionName}!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    setSelectedStudentToAssign('');
    setShowAddStudentModal(false);
    refreshData();
    // Update active roster view
    const updatedSec = schoolDb.getSectionById(activeRosterSection.id);
    if (updatedSec) setActiveRosterSection(updatedSec);
  };

  // Quick Create & Enroll Student
  const handleQuickCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRosterSection) return;

    if (!quickFirstName.trim() || !quickLastName.trim()) {
      setErrorMessage('Student first name and last name are required.');
      return;
    }

    const created = schoolDb.createAndAssignStudent(activeRosterSection.id, {
      firstName: quickFirstName.trim(),
      middleName: quickMiddleName.trim() || undefined,
      lastName: quickLastName.trim(),
      gender: quickGender,
      lrn: quickLrn.trim() || undefined,
      guardianName: quickGuardian.trim() || undefined,
      contactNumber: quickContact.trim() || undefined,
    });

    if (created) {
      setSuccessMessage(`Created and enrolled learner "${created.firstName} ${created.lastName}" (LRN: ${created.lrn}) into ${activeRosterSection.sectionName}!`);
      setTimeout(() => setSuccessMessage(null), 4000);

      // Reset
      setQuickFirstName('');
      setQuickMiddleName('');
      setQuickLastName('');
      setQuickLrn('');
      setQuickGuardian('');
      setQuickContact('');
      setShowAddStudentModal(false);
      refreshData();
      const updatedSec = schoolDb.getSectionById(activeRosterSection.id);
      if (updatedSec) setActiveRosterSection(updatedSec);
    }
  };

  // Remove Student from Section
  const handleRemoveStudent = (studentId: string) => {
    if (!activeRosterSection) return;
    const stud = students.find(s => s.id === studentId);
    if (confirm(`Remove "${stud?.firstName} ${stud?.lastName}" from Section ${activeRosterSection.sectionName}?`)) {
      schoolDb.removeStudentFromSection(activeRosterSection.id, studentId);
      setSuccessMessage(`Student removed from section.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      refreshData();
      const updatedSec = schoolDb.getSectionById(activeRosterSection.id);
      if (updatedSec) setActiveRosterSection(updatedSec);
    }
  };

  // Filter sections
  const filteredSections = sections.filter(sec => {
    if (selectedGradeFilter !== 'All' && sec.gradeLevel !== selectedGradeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sec.sectionName.toLowerCase().includes(q) ||
        sec.adviserName.toLowerCase().includes(q) ||
        sec.strand.toLowerCase().includes(q) ||
        sec.roomNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Students in active section
  const activeSectionStudents = students.filter(s => {
    if (!activeRosterSection) return false;
    return s.section === activeRosterSection.sectionName || activeRosterSection.studentIds?.includes(s.id);
  });

  // Available students to assign (unassigned or from other sections)
  const availableToAssign = students.filter(s => {
    if (!activeRosterSection) return false;
    return s.section !== activeRosterSection.sectionName && !activeRosterSection.studentIds?.includes(s.id);
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Department of Education · Division of Quezon
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              S.Y. 2026–2027
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-crest text-slate-900 mt-0.5">
            Class & Section Management
          </h3>
          <p className="text-xs text-slate-500">
            Create academic sections for Grades 7 to 12, appoint teacher advisers, and enroll students into class rosters.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateSectionModal(true);
            setErrorMessage(null);
          }}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Create New Class / Section</span>
        </button>
      </div>

      {/* Alert Feedback */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total School Sections</div>
          <div className="text-2xl font-bold font-mono-num text-slate-900">{sections.length} Classes</div>
          <div className="text-[10px] text-slate-400">JHS & SHS Active</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-blue-900 uppercase">Junior High Classes</div>
          <div className="text-2xl font-bold font-mono-num text-blue-900">
            {sections.filter(s => s.gradeLevel <= 10).length}
          </div>
          <div className="text-[10px] text-slate-400">Grades 7, 8, 9, 10 + STE</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Senior High Classes</div>
          <div className="text-2xl font-bold font-mono-num text-emerald-700">
            {sections.filter(s => s.gradeLevel >= 11).length}
          </div>
          <div className="text-[10px] text-slate-400">Academic & TVL Strands</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Total Enrolled Learners</div>
          <div className="text-2xl font-bold font-mono-num text-amber-700">
            {students.length} Learners
          </div>
          <div className="text-[10px] text-slate-400">Official Student Records</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 7, 8, 9, 10, 11, 12] as const).map(g => (
            <button
              key={g.toString()}
              onClick={() => setSelectedGradeFilter(g)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedGradeFilter === g
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'All' ? 'All Grades' : `Grade ${g}`}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search section name, adviser, or room..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map(sec => {
          const enrolledCount = students.filter(s => s.section === sec.sectionName || sec.studentIds?.includes(s.id)).length;
          const capacity = sec.maxCapacity || 45;
          const pct = Math.min(100, Math.round((enrolledCount / capacity) * 100));

          return (
            <div
              key={sec.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    sec.gradeLevel <= 10
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  }`}>
                    Grade {sec.gradeLevel} · {sec.track.replace('Track', '').trim()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditSection(sec)}
                      className="text-slate-400 hover:text-blue-900 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Modify class section (Admin password required)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteSection(sec)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete class section (Admin password required)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    {sec.sectionName}
                  </h4>
                  <div className="text-xs text-blue-900 font-medium mt-0.5">
                    {sec.strand}
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Adviser:</span>
                    <span>{sec.adviserName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Room:</span>
                    <span className="font-mono text-[11px]">{sec.roomNumber}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Capacity Gauge */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Class Enrollment</span>
                  <span className="font-bold font-mono-num text-slate-800">
                    {enrolledCount} / {capacity} Learners
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct >= 90 ? 'bg-amber-500' : 'bg-blue-700'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <button
                  onClick={() => {
                    setActiveRosterSection(sec);
                    setShowAddStudentModal(false);
                  }}
                  className="w-full mt-3 py-2 bg-slate-100 hover:bg-blue-900 hover:text-white text-blue-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage Class Roster & Students</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="col-span-full bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-400 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-slate-300" />
            <p>No classes or sections found for this grade level.</p>
            <button
              onClick={() => setShowCreateSectionModal(true)}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Create New Section Now
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION ROSTER DRAWER / MODAL */}
      {/* ========================================================================= */}
      {activeRosterSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-scale-up">
            
            {/* Roster Header */}
            <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-blue-950 border border-blue-700 text-amber-300 px-2 py-0.5 rounded font-mono">
                    Grade {activeRosterSection.gradeLevel} · {activeRosterSection.strand}
                  </span>
                  <span className="text-slate-400 text-xs">Room: {activeRosterSection.roomNumber}</span>
                </div>
                <h3 className="text-xl font-bold font-crest text-white">
                  Class Roster: {activeRosterSection.sectionName}
                </h3>
                <p className="text-xs text-slate-300">
                  Adviser: <strong>{activeRosterSection.adviserName}</strong> · S.Y. 2026–2027
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Students to Section</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer no-print"
                  title="Print DepEd SF1 style class roster"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Roster</span>
                </button>
                <button
                  onClick={() => setActiveRosterSection(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Roster Table Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing <strong>{activeSectionStudents.length}</strong> enrolled learners ({activeSectionStudents.filter(s => s.gender === 'Male').length} Male, {activeSectionStudents.filter(s => s.gender === 'Female').length} Female)
                </span>
                <span className="font-mono">
                  Capacity: {activeSectionStudents.length} / {activeRosterSection.maxCapacity || 45}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-10">#</th>
                      <th className="p-3">Learner Reference Number (LRN)</th>
                      <th className="p-3">Learner Full Name</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">General Average</th>
                      <th className="p-3">Guardian & Contact</th>
                      <th className="p-3 text-right no-print">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {activeSectionStudents.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-mono font-semibold text-blue-900">{st.lrn}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {st.lastName}, {st.firstName} {st.middleName ? `${st.middleName[0]}.` : ''}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            st.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {st.gender}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {st.generalAverage ? `${st.generalAverage.toFixed(2)}%` : 'No rating yet'}
                        </td>
                        <td className="p-3 text-slate-600">
                          <div>{st.guardianName}</div>
                          <div className="text-[11px] text-slate-400 font-mono-num">{st.contactNumber}</div>
                        </td>
                        <td className="p-3 text-right no-print">
                          <button
                            onClick={() => handleRemoveStudent(st.id)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}

                    {activeSectionStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 space-y-2">
                          <p>No learners currently enrolled in this section.</p>
                          <button
                            onClick={() => setShowAddStudentModal(true)}
                            className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Add Students Now</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Strip */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>DepEd Form 1 (School Register) Standard Sync</span>
              <button
                onClick={() => setActiveRosterSection(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD STUDENTS MODAL (Existing or Quick Add) */}
      {/* ========================================================================= */}
      {showAddStudentModal && activeRosterSection && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Enroll Students into {activeRosterSection.sectionName}
                </h4>
                <span className="text-xs text-slate-500">
                  Grade {activeRosterSection.gradeLevel} · {activeRosterSection.strand}
                </span>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Sub-mode selector */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStudentAssignMode('existing')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                  studentAssignMode === 'existing'
                    ? 'bg-white text-blue-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Select Registered Student ({availableToAssign.length})
              </button>
              <button
                type="button"
                onClick={() => setStudentAssignMode('quick_new')}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                  studentAssignMode === 'quick_new'
                    ? 'bg-white text-blue-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Quick Add New Learner
              </button>
            </div>

            {/* Mode 1: Assign Existing Student */}
            {studentAssignMode === 'existing' && (
              <form onSubmit={handleAssignExistingStudent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Learner to Enroll *
                  </label>
                  <select
                    required
                    value={selectedStudentToAssign}
                    onChange={(e) => setSelectedStudentToAssign(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="">-- Choose a student from database --</option>
                    {availableToAssign.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.lastName}, {st.firstName} (LRN: {st.lrn}) — Currently: {st.section || 'Unassigned'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-blue-900 text-[11px] leading-relaxed">
                  Assigning a student updates their official section, curriculum strand, and teacher adviser records automatically.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStudentToAssign}
                    className="px-5 py-2 bg-blue-900 disabled:bg-slate-300 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                  >
                    Enroll into {activeRosterSection.sectionName}
                  </button>
                </div>
              </form>
            )}

            {/* Mode 2: Quick Create & Enroll New Student */}
            {studentAssignMode === 'quick_new' && (
              <form onSubmit={handleQuickCreateStudent} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={quickFirstName}
                      onChange={(e) => setQuickFirstName(e.target.value)}
                      placeholder="e.g. Gabriel"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={quickLastName}
                      onChange={(e) => setQuickLastName(e.target.value)}
                      placeholder="e.g. Mendoza"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={quickMiddleName}
                      onChange={(e) => setQuickMiddleName(e.target.value)}
                      placeholder="e.g. Ramos"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      value={quickGender}
                      onChange={(e) => setQuickGender(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DepEd 12-Digit LRN (Optional)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={quickLrn}
                    onChange={(e) => setQuickLrn(e.target.value)}
                    placeholder="Leave blank to auto-generate 12-digit LRN"
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      value={quickGuardian}
                      onChange={(e) => setQuickGuardian(e.target.value)}
                      placeholder="e.g. Teresa Mendoza"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={quickContact}
                      onChange={(e) => setQuickContact(e.target.value)}
                      placeholder="e.g. 0919-445-6789"
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                  >
                    Create & Enroll Learner
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE NEW SECTION MODAL */}
      {/* ========================================================================= */}
      {showCreateSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Create New Class / Section</h4>
                  <span className="text-xs text-slate-500">Configure grade, curriculum, and class adviser</span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateSectionModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateSectionSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade Level *</label>
                  <select
                    value={newGradeLevel}
                    onChange={(e) => handleGradeLevelChange(parseInt(e.target.value, 10) as GradeLevel)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value={7}>Grade 7 (JHS)</option>
                    <option value={8}>Grade 8 (JHS)</option>
                    <option value={9}>Grade 9 (JHS)</option>
                    <option value={10}>Grade 10 (JHS)</option>
                    <option value={11}>Grade 11 (SHS)</option>
                    <option value={12}>Grade 12 (SHS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Name *</label>
                  <input
                    type="text"
                    required
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder={newGradeLevel <= 10 ? "e.g. Diamond, Sapphire, Pearl" : "e.g. STEM - Copernicus, TVL - Volta"}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden font-semibold"
                  />
                </div>
              </div>

              {/* Strand & Track */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curriculum Strand *</label>
                {newGradeLevel <= 10 ? (
                  <select
                    value={newStrand}
                    onChange={(e) => {
                      setNewStrand(e.target.value as StrandType);
                      setNewTrack('Junior High School');
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="Regular JHS">Regular Junior High School Curriculum</option>
                    <option value="Special Science Program (STE)">Special Science Program (STE)</option>
                  </select>
                ) : (
                  <select
                    value={newStrand}
                    onChange={(e) => {
                      const val = e.target.value as StrandType;
                      setNewStrand(val);
                      setNewTrack(val.includes('TVL') ? 'TVL Track' : 'Academic Track');
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="STEM">Academic: STEM (Science & Math)</option>
                    <option value="ABM">Academic: ABM (Accountancy & Business)</option>
                    <option value="HUMSS">Academic: HUMSS (Humanities & Social Sciences)</option>
                    <option value="TVL - ICT (Computer Systems)">TVL: ICT - Computer Systems Servicing (CSS)</option>
                    <option value="TVL - Electrical Installation and Maintenance (EIM)">TVL: Electrical Installation & Maintenance (EIM)</option>
                    <option value="TVL - Electronic Products Assembly and Servicing (EPAS)">TVL: Electronic Products Assembly (EPAS)</option>
                    <option value="TVL - Home Economics">TVL: Home Economics (Commercial Cooking / Bread & Pastry)</option>
                  </select>
                )}
              </div>

              {/* Room & Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Building *</label>
                  <input
                    type="text"
                    required
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="e.g. Bldg 2, Rm 204"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maximum Capacity</label>
                  <input
                    type="number"
                    min={20}
                    max={65}
                    value={newMaxCapacity}
                    onChange={(e) => setNewMaxCapacity(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Class Adviser */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher Adviser *</label>
                <select
                  value={newAdviserId}
                  onChange={(e) => setNewAdviserId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.title} - {t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateSectionModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                >
                  Create Section
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODIFY CLASS SECTION MODAL (Requires Admin Password) */}
      {/* ========================================================================= */}
      {editingSection && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Modify Class Section</h4>
                  <span className="text-xs text-slate-500">Updating: {editingSection.sectionName}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditSection} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade Level *</label>
                  <select
                    value={editGradeLevel}
                    onChange={(e) => {
                      const g = parseInt(e.target.value, 10) as GradeLevel;
                      setEditGradeLevel(g);
                      if (g <= 10) {
                        setEditTrack('Junior High School');
                        setEditStrand('Regular JHS');
                      } else {
                        setEditTrack('Academic Track');
                        setEditStrand('STEM');
                      }
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value={7}>Grade 7 (JHS)</option>
                    <option value={8}>Grade 8 (JHS)</option>
                    <option value={9}>Grade 9 (JHS)</option>
                    <option value={10}>Grade 10 (JHS)</option>
                    <option value={11}>Grade 11 (SHS)</option>
                    <option value={12}>Grade 12 (SHS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Name *</label>
                  <input
                    type="text"
                    required
                    value={editSectionName}
                    onChange={(e) => setEditSectionName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden font-semibold"
                  />
                </div>
              </div>

              {/* Strand */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curriculum Strand *</label>
                {editGradeLevel <= 10 ? (
                  <select
                    value={editStrand}
                    onChange={(e) => {
                      setEditStrand(e.target.value as StrandType);
                      setEditTrack('Junior High School');
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="Regular JHS">Regular Junior High School Curriculum</option>
                    <option value="Special Science Program (STE)">Special Science Program (STE)</option>
                  </select>
                ) : (
                  <select
                    value={editStrand}
                    onChange={(e) => {
                      const val = e.target.value as StrandType;
                      setEditStrand(val);
                      setEditTrack(val.includes('TVL') ? 'TVL Track' : 'Academic Track');
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="STEM">Academic: STEM (Science & Math)</option>
                    <option value="ABM">Academic: ABM (Accountancy & Business)</option>
                    <option value="HUMSS">Academic: HUMSS (Humanities & Social Sciences)</option>
                    <option value="TVL - ICT (Computer Systems)">TVL: ICT - Computer Systems Servicing (CSS)</option>
                    <option value="TVL - Electrical Installation and Maintenance (EIM)">TVL: Electrical Installation & Maintenance (EIM)</option>
                    <option value="TVL - Electronic Products Assembly and Servicing (EPAS)">TVL: Electronic Products Assembly (EPAS)</option>
                    <option value="TVL - Home Economics">TVL: Home Economics (Commercial Cooking / Bread & Pastry)</option>
                  </select>
                )}
              </div>

              {/* Room & Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Building Designation *</label>
                  <input
                    type="text"
                    required
                    value={editRoomNumber}
                    onChange={(e) => setEditRoomNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Maximum Capacity</label>
                  <input
                    type="number"
                    min={20}
                    max={65}
                    value={editMaxCapacity}
                    onChange={(e) => setEditMaxCapacity(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Adviser */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher Adviser *</label>
                <select
                  value={editAdviserId}
                  onChange={(e) => setEditAdviserId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.title} - {t.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Security Admin Password Required */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-blue-950 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-900" />
                    <span>Admin Password Confirmation Required *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Default: Inhs67890</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter Admin Password to confirm modification..."
                  value={editAdminPassword}
                  onChange={(e) => setEditAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border-2 border-blue-900/40 focus:border-blue-900 focus:outline-hidden font-mono font-bold bg-amber-50/50"
                />
                <p className="text-[10px] text-slate-500">
                  * For institutional security, class and curriculum modifications must be authorized with the school administrator password.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-amber-300" />
                  <span>Confirm & Save Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CLASS SECTION MODAL (Requires Admin Password) */}
      {/* ========================================================================= */}
      {deletingSection && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-rose-700">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Delete Class Section</h4>
                <span className="text-xs text-rose-600 font-semibold">High Privilege Administrative Action</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete section <strong>"{deletingSection.sectionName}"</strong> (Grade {deletingSection.gradeLevel} · {deletingSection.strand})?
            </p>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
              Enrolled students in this section will be marked as <strong>"Unassigned"</strong> and can be re-enrolled into another section.
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDeleteSection} className="space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-900">Enter Admin Password to Authorize *</label>
                  <span className="text-[10px] text-slate-500 font-mono">Default: Inhs67890</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Admin password..."
                  value={deleteAdminPassword}
                  onChange={(e) => setDeleteAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border-2 border-rose-300 focus:border-rose-600 focus:outline-hidden font-mono font-bold bg-rose-50/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingSection(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Authorize & Delete Section</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
