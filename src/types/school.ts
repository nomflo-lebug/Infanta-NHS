/**
 * Infanta National High School
 * Data Models & Type Definitions
 */

export type Role = 'student_parent' | 'teacher' | 'admin';

export type GradeLevel = 7 | 8 | 9 | 10 | 11 | 12;

export type TrackType = 'Junior High School' | 'Academic Track' | 'TVL Track';

export type StrandType = 
  | 'Regular JHS'
  | 'Special Science Program (STE)'
  | 'STEM'
  | 'ABM'
  | 'HUMSS'
  | 'TVL - ICT (Computer Systems)'
  | 'TVL - Home Economics'
  | 'TVL - Electrical Installation and Maintenance (EIM)'
  | 'TVL - Electronic Products Assembly and Servicing (EPAS)';

export type EnrollmentStatus = 'Enrolled' | 'Pending Review' | 'Transferred In' | 'Graduated';

export interface SubjectGrade {
  subjectId: string;
  subjectCode: string;
  subjectTitle: string;
  teacherName: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  finalRating: number | null;
  remarks: 'Passed' | 'Failed' | 'Pending';
}

export type CoreValueRatingValue = 'AO' | 'SO' | 'RO' | 'NO'; // Always, Sometimes, Rarely, Not Observed

export interface CoreValueRating {
  id: string;
  coreValue: 'Maka-Diyos' | 'Makatao' | 'Makakalikasan' | 'Makabansa';
  behaviorStatement: string;
  q1: CoreValueRatingValue;
  q2: CoreValueRatingValue;
  q3: CoreValueRatingValue;
  q4: CoreValueRatingValue;
}

export interface AttendanceMonth {
  month: string;
  schoolDays: number;
  daysPresent: number;
  daysAbsent: number;
}

export interface StudentProfile {
  id: string;
  lrn: string; // 12-digit DepEd Learner Reference Number
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName?: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  age: number;
  barangay: string;
  municipality: string;
  province: string;
  contactNumber: string;
  guardianName: string;
  guardianRelationship: string;
  guardianContact: string;
  gradeLevel: GradeLevel;
  section: string;
  track: TrackType;
  strand: StrandType;
  adviserId: string;
  adviserName: string;
  schoolYear: string;
  enrollmentStatus: EnrollmentStatus;
  grades: SubjectGrade[];
  generalAverage: number | null;
  honors: string | null;
  attendance: AttendanceMonth[];
  coreValues: CoreValueRating[];
  adviserRemarks: string;
}

export interface Teacher {
  id: string;
  employeeNumber: string;
  name: string;
  title: string; // e.g. "Teacher III", "Master Teacher I"
  department: string;
  email: string;
  phone: string;
  advisorySection?: {
    grade: GradeLevel;
    section: string;
    strand: StrandType;
  };
  teachingLoads: {
    grade: GradeLevel;
    section: string;
    subjectId: string;
    subjectTitle: string;
  }[];
}

export interface EnrollmentApplication {
  id: string;
  submissionDate: string;
  applicationType: 'Grade 7 (Incoming JHS)' | 'Grade 11 (Incoming SHS)' | 'Transferee' | 'Balik-Aral';
  lrn?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName?: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  email: string;
  contactNumber: string;
  addressBarangay: string;
  previousSchool: string;
  targetGrade: GradeLevel;
  targetStrand: StrandType;
  guardianName: string;
  guardianContact: string;
  documentsSubmitted: string[];
  status: 'Pending Review' | 'Approved' | 'Requires Verification' | 'Rejected';
  notes?: string;
  assignedSection?: string;
}

export interface SchoolUpdate {
  id: string;
  title: string;
  category: 'Announcement' | 'Academic' | 'Activities' | 'Admissions' | 'Memorandum';
  date: string;
  author: string;
  summary: string;
  content: string;
  featured: boolean;
  tag: string;
}

export interface SchoolActivity {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: 'Examination' | 'Celebration' | 'Sports' | 'Academic' | 'Assembly';
  description: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export type AccountRole = 'admin' | 'teacher' | 'student';

export interface UserAccount {
  id: string;
  username: string; // e.g., 'Admin'
  password: string; // e.g., 'Inhs67890'
  role: AccountRole;
  fullName: string;
  designation: string; // e.g., 'System Administrator', 'Head Teacher'
  email?: string;
  phone?: string;
  teacherId?: string; // links to Teacher profile if role === 'teacher'
  createdAt: string;
  isPrimaryAdmin?: boolean; // prevents deleting main Admin
}

export interface SchoolClassSection {
  id: string;
  gradeLevel: GradeLevel;
  sectionName: string;
  track: TrackType;
  strand: StrandType;
  roomNumber: string;
  adviserId: string;
  adviserName: string;
  schoolYear: string;
  studentIds: string[];
  maxCapacity: number;
}

