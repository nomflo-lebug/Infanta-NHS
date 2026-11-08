/**
 * Infanta National High School Database Service
 * Provides client-side persistence (localStorage) with reactive listeners
 * and realistic Philippine DepEd student and school records.
 */

import {
  StudentProfile,
  Teacher,
  TeachingLoad,
  EnrollmentApplication,
  SchoolUpdate,
  SchoolActivity,
  SubjectGrade,
  AttendanceMonth,
  CoreValueRating,
  UserAccount,
  SchoolClassSection,
  CurriculumSubject,
  GradeLevel,
  TermSemester
} from '../types/school';

const DB_KEY = 'inhs_school_database_v3';

interface DatabaseSchema {
  students: StudentProfile[];
  teachers: Teacher[];
  curriculumSubjects: CurriculumSubject[];
  enrollmentApplications: EnrollmentApplication[];
  updates: SchoolUpdate[];
  activities: SchoolActivity[];
  accounts: UserAccount[];
  sections: SchoolClassSection[];
}

const DEFAULT_ATTENDANCE: AttendanceMonth[] = [
  { month: 'August', schoolDays: 21, daysPresent: 21, daysAbsent: 0 },
  { month: 'September', schoolDays: 22, daysPresent: 21, daysAbsent: 1 },
  { month: 'October', schoolDays: 21, daysPresent: 20, daysAbsent: 1 },
  { month: 'November', schoolDays: 20, daysPresent: 20, daysAbsent: 0 },
  { month: 'December', schoolDays: 14, daysPresent: 14, daysAbsent: 0 },
  { month: 'January', schoolDays: 21, daysPresent: 20, daysAbsent: 1 },
  { month: 'February', schoolDays: 19, daysPresent: 19, daysAbsent: 0 },
  { month: 'March', schoolDays: 22, daysPresent: 22, daysAbsent: 0 },
  { month: 'April', schoolDays: 18, daysPresent: 18, daysAbsent: 0 },
  { month: 'May', schoolDays: 20, daysPresent: 19, daysAbsent: 1 },
];

const DEFAULT_CORE_VALUES: CoreValueRating[] = [
  {
    id: 'cv1',
    coreValue: 'Maka-Diyos',
    behaviorStatement: 'Expresses spiritual beliefs while respecting diverse faiths and choices',
    term1: 'AO', term2: 'AO', term3: 'AO',
    q1: 'AO', q2: 'AO', q3: 'AO', q4: 'AO',
  },
  {
    id: 'cv2',
    coreValue: 'Makatao',
    behaviorStatement: 'Shows empathy, respect for human rights, and sensitivity to individual differences',
    term1: 'AO', term2: 'AO', term3: 'AO',
    q1: 'AO', q2: 'AO', q3: 'AO', q4: 'AO',
  },
  {
    id: 'cv3',
    coreValue: 'Makakalikasan',
    behaviorStatement: 'Cares for the environment and actively engages in coastal conservation efforts',
    term1: 'AO', term2: 'SO', term3: 'AO',
    q1: 'AO', q2: 'SO', q3: 'AO', q4: 'AO',
  },
  {
    id: 'cv4',
    coreValue: 'Makabansa',
    behaviorStatement: 'Demonstrates pride in Filipino heritage and abides by school and municipal laws',
    term1: 'AO', term2: 'AO', term3: 'AO',
    q1: 'AO', q2: 'AO', q3: 'AO', q4: 'AO',
  },
];

/**
 * Computes final rating and status across the 3 terms / semesters of the school year.
 */
export function calculateSubjectFinal(grades: { 
  term1?: number | null; 
  term2?: number | null; 
  term3?: number | null; 
  q1?: number | null; 
  q2?: number | null; 
  q3?: number | null; 
  q4?: number | null; 
}): { finalRating: number | null; remarks: 'Passed' | 'Failed' | 'Pending' } {
  const t1 = grades.term1 !== undefined && grades.term1 !== null ? grades.term1 : (grades.q1 ?? null);
  const t2 = grades.term2 !== undefined && grades.term2 !== null ? grades.term2 : (grades.q2 ?? null);
  const t3 = grades.term3 !== undefined && grades.term3 !== null ? grades.term3 : (grades.q3 ?? null);

  const valid = [t1, t2, t3].filter((v): v is number => v !== null && !isNaN(v));
  if (valid.length === 0) return { finalRating: null, remarks: 'Pending' };
  
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  const avg = Math.round(sum / valid.length);
  // 3 terms per school year: if all 3 terms graded, remark is final; otherwise pending
  const remarks = valid.length === 3 ? (avg >= 75 ? 'Passed' : 'Failed') : (avg >= 75 ? 'Passed' : 'Failed');
  return { finalRating: avg, remarks };
}

export function calculateGeneralAverage(grades: SubjectGrade[]): { generalAverage: number | null; honors: string | null } {
  const ratings = grades.map(g => g.finalRating).filter((r): r is number => r !== null && !isNaN(r));
  if (ratings.length === 0) return { generalAverage: null, honors: null };

  const avg = Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2));
  
  let honors: string | null = null;
  const allPassing = grades.every(g => (g.finalRating ?? 0) >= 80); // DepEd rule: no grade below 80 for honors
  if (allPassing) {
    if (avg >= 98) honors = 'With Highest Honors';
    else if (avg >= 95) honors = 'With High Honors';
    else if (avg >= 90) honors = 'With Honors';
  }
  return { generalAverage: avg, honors };
}

export const INITIAL_CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  // --- GRADE 7 (3 Terms) ---
  { id: 'subj-eng7-t1', subjectCode: 'ENG7-T1', subjectTitle: 'English 7 (Philippine Literature & Oral Fluency)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-math7-t1', subjectCode: 'MATH7-T1', subjectTitle: 'Mathematics 7 (Sets & Real Number Systems)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci7-t1', subjectCode: 'SCI7-T1', subjectTitle: 'Science 7 (Scientific Investigation & Matter)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-fil7-t1', subjectCode: 'FIL7-T1', subjectTitle: 'Filipino 7 (Kwentong Bayan at Pabula ng Mindanao)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-ap7-t1', subjectCode: 'AP7-T1', subjectTitle: 'Araling Panlipunan 7 (Heograpiya ng Asya)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 3, department: 'Social Sciences' },
  { id: 'subj-tle7-t1', subjectCode: 'TLE7-T1', subjectTitle: 'TLE 7 (Agri-Fishery Arts & ICT Exploratory)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 4, department: 'TVL & TLE' },
  { id: 'subj-mapeh7-t1', subjectCode: 'MAPEH7-T1', subjectTitle: 'MAPEH 7 (Music, Arts, PE & Health of Luzon)', gradeLevel: 7, term: 1, track: 'Junior High School', units: 4, department: 'MAPEH' },

  { id: 'subj-eng7-t2', subjectCode: 'ENG7-T2', subjectTitle: 'English 7 (Genre Analysis & Informational Texts)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-math7-t2', subjectCode: 'MATH7-T2', subjectTitle: 'Mathematics 7 (Algebraic Expressions & Equations)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci7-t2', subjectCode: 'SCI7-T2', subjectTitle: 'Science 7 (Living Things and Their Environment)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-fil7-t2', subjectCode: 'FIL7-T2', subjectTitle: 'Filipino 7 (Panitikan ng Kabisayaan at Alamat)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-ap7-t2', subjectCode: 'AP7-T2', subjectTitle: 'Araling Panlipunan 7 (Sinaunang Kabihasnang Asyano)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 3, department: 'Social Sciences' },
  { id: 'subj-tle7-t2', subjectCode: 'TLE7-T2', subjectTitle: 'TLE 7 (Home Economics & Industrial Arts Exploratory)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 4, department: 'TVL & TLE' },
  { id: 'subj-mapeh7-t2', subjectCode: 'MAPEH7-T2', subjectTitle: 'MAPEH 7 (Traditions of Visayas & Folk Dances)', gradeLevel: 7, term: 2, track: 'Junior High School', units: 4, department: 'MAPEH' },

  { id: 'subj-eng7-t3', subjectCode: 'ENG7-T3', subjectTitle: 'English 7 (Research Syntheses & Literary Drama)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-math7-t3', subjectCode: 'MATH7-T3', subjectTitle: 'Mathematics 7 (Geometry, Statistics & Probability)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci7-t3', subjectCode: 'SCI7-T3', subjectTitle: 'Science 7 (Force, Motion & Energy and Earth Systems)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-fil7-t3', subjectCode: 'FIL7-T3', subjectTitle: 'Filipino 7 (Ibong Adarna / Panitikang Luzon)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-ap7-t3', subjectCode: 'AP7-T3', subjectTitle: 'Araling Panlipunan 7 (Kolonyalismo at Nasyonalismo)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 3, department: 'Social Sciences' },
  { id: 'subj-tle7-t3', subjectCode: 'TLE7-T3', subjectTitle: 'TLE 7 (Mini-Enterprise Project & Hands-on Lab)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 4, department: 'TVL & TLE' },
  { id: 'subj-mapeh7-t3', subjectCode: 'MAPEH7-T3', subjectTitle: 'MAPEH 7 (Mindanao Cultural Arts & Personal Health)', gradeLevel: 7, term: 3, track: 'Junior High School', units: 4, department: 'MAPEH' },

  // --- GRADE 8 (3 Terms) ---
  { id: 'subj-eng8-t1', subjectCode: 'ENG8-T1', subjectTitle: 'English 8 (Afro-Asian Literature & Speech Arts)', gradeLevel: 8, term: 1, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-math8-t1', subjectCode: 'MATH8-T1', subjectTitle: 'Mathematics 8 (Geometry & Linear Algebra)', gradeLevel: 8, term: 1, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci8-t1', subjectCode: 'SCI8-T1', subjectTitle: 'Science 8 (Force, Motion & Energy)', gradeLevel: 8, term: 1, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-eng8-t2', subjectCode: 'ENG8-T2', subjectTitle: 'English 8 (Expository Writing & Visual Rhetoric)', gradeLevel: 8, term: 2, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-math8-t2', subjectCode: 'MATH8-T2', subjectTitle: 'Mathematics 8 (Coordinate Geometry & Proofs)', gradeLevel: 8, term: 2, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci8-t2', subjectCode: 'SCI8-T2', subjectTitle: 'Science 8 (Earthquakes, Typhoons & Space)', gradeLevel: 8, term: 2, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-eng8-t3', subjectCode: 'ENG8-T3', subjectTitle: 'English 8 (Persuasive Speaking & Critical Essays)', gradeLevel: 8, term: 3, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-math8-t3', subjectCode: 'MATH8-T3', subjectTitle: 'Mathematics 8 (Axiomatic Geometry & Triangle Congruence)', gradeLevel: 8, term: 3, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci8-t3', subjectCode: 'SCI8-T3', subjectTitle: 'Science 8 (Cell Biology, Genetics & Ecology)', gradeLevel: 8, term: 3, track: 'Junior High School', units: 4, department: 'Science' },

  // --- GRADE 9 (3 Terms) ---
  { id: 'subj-sci9-t1', subjectCode: 'SCI9-T1', subjectTitle: 'Science 9 (Living Things & Genetics)', gradeLevel: 9, term: 1, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-math9-t1', subjectCode: 'MATH9-T1', subjectTitle: 'Mathematics 9 (Quadratic Equations & Variations)', gradeLevel: 9, term: 1, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci9-t2', subjectCode: 'SCI9-T2', subjectTitle: 'Science 9 (Earth & Space Systems)', gradeLevel: 9, term: 2, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-math9-t2', subjectCode: 'MATH9-T2', subjectTitle: 'Mathematics 9 (Radicals & Exponents)', gradeLevel: 9, term: 2, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-sci9-t3', subjectCode: 'SCI9-T3', subjectTitle: 'Science 9 (Matter & Chemical Reactions)', gradeLevel: 9, term: 3, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-math9-t3', subjectCode: 'MATH9-T3', subjectTitle: 'Mathematics 9 (Trigonometry & Right Triangles)', gradeLevel: 9, term: 3, track: 'Junior High School', units: 4, department: 'Mathematics' },

  // --- GRADE 10 (incl. STE - 3 Terms) ---
  { id: 'subj-sci10-t1', subjectCode: 'SCI10-T1', subjectTitle: 'Advanced Chemistry & Physics', gradeLevel: 10, term: 1, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-math10-t1', subjectCode: 'MATH10-T1', subjectTitle: 'Advanced Mathematics 10 (Sequences & Functions)', gradeLevel: 10, term: 1, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-eng10-t1', subjectCode: 'ENG10-T1', subjectTitle: 'English 10 (World Literature)', gradeLevel: 10, term: 1, track: 'Junior High School', units: 4, department: 'Languages' },
  { id: 'subj-res10-t1', subjectCode: 'RES10-T1', subjectTitle: 'Scientific Research II (STE Investigatory Project)', gradeLevel: 10, term: 1, track: 'Junior High School', strand: 'Special Science Program (STE)', units: 4, department: 'Science' },
  { id: 'subj-sci10-t2', subjectCode: 'SCI10-T2', subjectTitle: 'Science 10 (Genetics & Matter)', gradeLevel: 10, term: 2, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-math10-t2', subjectCode: 'MATH10-T2', subjectTitle: 'Mathematics 10 (Polynomials & Circles)', gradeLevel: 10, term: 2, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-res10-t2', subjectCode: 'RES10-T2', subjectTitle: 'STE Data Analysis & Statistical Modeling', gradeLevel: 10, term: 2, track: 'Junior High School', strand: 'Special Science Program (STE)', units: 4, department: 'Science' },
  { id: 'subj-sci10-t3', subjectCode: 'SCI10-T3', subjectTitle: 'Science 10 (Electromagnetism & Nuclear Energy)', gradeLevel: 10, term: 3, track: 'Junior High School', units: 4, department: 'Science' },
  { id: 'subj-math10-t3', subjectCode: 'MATH10-T3', subjectTitle: 'Mathematics 10 (Probability & Combinatorics)', gradeLevel: 10, term: 3, track: 'Junior High School', units: 4, department: 'Mathematics' },
  { id: 'subj-res10-t3', subjectCode: 'RES10-T3', subjectTitle: 'STE Regional Science Congress Defense', gradeLevel: 10, term: 3, track: 'Junior High School', strand: 'Special Science Program (STE)', units: 4, department: 'Science' },

  // --- GRADE 11 (SHS 3 Terms) ---
  { id: 'stem-precalc-t1', subjectCode: 'STEM-PRECALC', subjectTitle: 'Pre-Calculus & Analytic Geometry', gradeLevel: 11, term: 1, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Mathematics' },
  { id: 'shs-comm-t1', subjectCode: 'SHS-COMM', subjectTitle: 'Oral Communication in Context', gradeLevel: 11, term: 1, track: 'Academic Track', units: 4, department: 'Languages' },
  { id: 'shs-gmath-t1', subjectCode: 'SHS-GMATH', subjectTitle: 'General Mathematics', gradeLevel: 11, term: 1, track: 'Academic Track', units: 4, department: 'Mathematics' },
  { id: 'hum-diass-t1', subjectCode: 'HUM-DIASS', subjectTitle: 'Disciplines & Ideas in Social Sciences', gradeLevel: 11, term: 1, track: 'Academic Track', strand: 'HUMSS', units: 4, department: 'Social Sciences' },
  { id: 'tvl-css11-t1', subjectCode: 'TVL-CSS11', subjectTitle: 'Computer Systems Servicing NC II (Hardware)', gradeLevel: 11, term: 1, track: 'TVL Track', strand: 'TVL - ICT (Computer Systems)', units: 6, department: 'TVL' },
  
  { id: 'stem-calc-t2', subjectCode: 'STEM-CALC', subjectTitle: 'Basic Calculus (Differential & Integral)', gradeLevel: 11, term: 2, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Mathematics' },
  { id: 'shs-read-t2', subjectCode: 'SHS-READ', subjectTitle: 'Reading and Writing Skills', gradeLevel: 11, term: 2, track: 'Academic Track', units: 4, department: 'Languages' },
  { id: 'shs-stat-t2', subjectCode: 'SHS-STAT', subjectTitle: 'Statistics and Probability', gradeLevel: 11, term: 2, track: 'Academic Track', units: 4, department: 'Mathematics' },
  { id: 'hum-cw-t2', subjectCode: 'HUM-CW', subjectTitle: 'Creative Writing / Malikhaing Pagsulat', gradeLevel: 11, term: 2, track: 'Academic Track', strand: 'HUMSS', units: 4, department: 'Languages' },
  { id: 'tvl-empower-t2', subjectCode: 'TVL-EMP', subjectTitle: 'Empowerment Technologies', gradeLevel: 11, term: 2, track: 'TVL Track', strand: 'TVL - ICT (Computer Systems)', units: 4, department: 'TVL' },

  { id: 'shs-phil-t3', subjectCode: 'SHS-PHIL', subjectTitle: 'Introduction to Philosophy of the Human Person', gradeLevel: 11, term: 3, track: 'Academic Track', units: 4, department: 'Social Sciences' },
  { id: 'shs-pr1-t3', subjectCode: 'SHS-PR1', subjectTitle: 'Practical Research 1 (Qualitative Research)', gradeLevel: 11, term: 3, track: 'Academic Track', units: 4, department: 'Research' },
  { id: 'stem-chem1-t3', subjectCode: 'STEM-CHEM1', subjectTitle: 'General Chemistry 1', gradeLevel: 11, term: 3, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Science' },

  // --- GRADE 12 (SHS 3 Terms) ---
  { id: 'stem-phys1-t1', subjectCode: 'STEM-PHYS1', subjectTitle: 'General Physics 1', gradeLevel: 12, term: 1, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Science' },
  { id: 'shs-pr2-t1', subjectCode: 'SHS-PR2', subjectTitle: 'Practical Research 2 (Quantitative Research)', gradeLevel: 12, term: 1, track: 'Academic Track', units: 4, department: 'Research' },
  { id: 'tvl-css-t1', subjectCode: 'TVL-CSS', subjectTitle: 'Computer Systems Servicing NC II', gradeLevel: 12, term: 1, track: 'TVL Track', strand: 'TVL - ICT (Computer Systems)', units: 6, department: 'TVL' },

  { id: 'stem-phys2-t2', subjectCode: 'STEM-PHYS2', subjectTitle: 'General Physics 2', gradeLevel: 12, term: 2, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Science' },
  { id: 'shs-mil-t2', subjectCode: 'SHS-MIL', subjectTitle: 'Media and Information Literacy', gradeLevel: 12, term: 2, track: 'Academic Track', units: 4, department: 'Languages' },
  { id: 'stem-chem2-t2', subjectCode: 'STEM-CHEM2', subjectTitle: 'General Chemistry 2', gradeLevel: 12, term: 2, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Science' },

  { id: 'stem-res2-t3', subjectCode: 'STEM-RES2', subjectTitle: 'Inquiries, Investigations & Immersion (SHS-III)', gradeLevel: 12, term: 3, track: 'Academic Track', strand: 'STEM', units: 4, department: 'Research' },
  { id: 'shs-cpar-t3', subjectCode: 'SHS-CPAR', subjectTitle: 'Contemporary Philippine Arts from the Regions', gradeLevel: 12, term: 3, track: 'Academic Track', units: 4, department: 'Arts' },
  { id: 'tvl-immersion-t3', subjectCode: 'TVL-IMM', subjectTitle: 'Work Immersion / Culminating Activity', gradeLevel: 12, term: 3, track: 'TVL Track', strand: 'TVL - ICT (Computer Systems)', units: 6, department: 'TVL' },
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-101',
    employeeNumber: 'T-2015-0841',
    name: 'Mrs. Josefina M. Alcala',
    title: 'Master Teacher II',
    department: 'Science & Mathematics',
    email: 'josefina.alcala@deped.gov.ph',
    phone: '0917-889-1240',
    advisorySection: {
      grade: 10,
      section: 'STE - Rutherford',
      strand: 'Special Science Program (STE)',
    },
    teachingLoads: [
      { id: 'load-t1-1', grade: 10, section: 'STE - Rutherford', subjectId: 'subj-sci10-t1', subjectCode: 'SCI10-T1', subjectTitle: 'Advanced Chemistry & Physics', term: 1, room: 'Sci Lab 1', schedule: 'MWF 8:00 - 9:00 AM' },
      { id: 'load-t1-2', grade: 9, section: 'Rizal', subjectId: 'subj-sci9-t1', subjectCode: 'SCI9-T1', subjectTitle: 'Science 9 (Living Things & Genetics)', term: 1, room: 'Rm 102', schedule: 'TTH 10:00 - 11:30 AM' },
      { id: 'load-t1-3', grade: 10, section: 'Grade 8 - Bonifacio', subjectId: 'subj-sci8-t1', subjectCode: 'SCI8-T1', subjectTitle: 'Science 8 (Force, Motion & Energy)', term: 1, room: 'Main Bldg Rm 104', schedule: 'MWF 1:00 - 2:00 PM' }
    ]
  },
  {
    id: 't-102',
    employeeNumber: 'T-2018-0912',
    name: 'Mr. Emmanuel P. Dela Rosa',
    title: 'Teacher III',
    department: 'Senior High School - STEM',
    email: 'emmanuel.delarosa@deped.gov.ph',
    phone: '0920-554-9981',
    advisorySection: {
      grade: 12,
      section: 'STEM - Einstein',
      strand: 'STEM',
    },
    teachingLoads: [
      { id: 'load-t2-1', grade: 12, section: 'STEM - Einstein', subjectId: 'stem-phys2-t2', subjectCode: 'STEM-PHYS2', subjectTitle: 'General Physics 2', term: 2, room: 'SHS Lab 302', schedule: 'MWF 9:00 - 10:30 AM' },
      { id: 'load-t2-2', grade: 11, section: 'STEM - Newton', subjectId: 'stem-precalc-t1', subjectCode: 'STEM-PRECALC', subjectTitle: 'Pre-Calculus & Analytic Geometry', term: 1, room: 'Rm 301', schedule: 'TTH 8:00 - 9:30 AM' },
      { id: 'load-t2-3', grade: 12, section: 'STEM - Einstein', subjectId: 'stem-res2-t3', subjectCode: 'STEM-RES2', subjectTitle: 'Inquiries, Investigations & Immersion (SHS-III)', term: 3, room: 'Research Hub', schedule: 'F 1:00 - 4:00 PM' }
    ]
  },
  {
    id: 't-103',
    employeeNumber: 'T-2016-0422',
    name: 'Ms. Carmela V. Hernandez',
    title: 'Teacher II',
    department: 'Languages & Humanities',
    email: 'carmela.hernandez@deped.gov.ph',
    phone: '0918-344-7721',
    advisorySection: {
      grade: 11,
      section: 'HUMSS - Mabini',
      strand: 'HUMSS',
    },
    teachingLoads: [
      { id: 'load-t3-1', grade: 11, section: 'HUMSS - Mabini', subjectId: 'hum-diass-t1', subjectCode: 'HUM-DIASS', subjectTitle: 'Disciplines & Ideas in Social Sciences', term: 1, room: 'SHS Rm 204', schedule: 'MWF 10:00 - 11:00 AM' },
      { id: 'load-t3-2', grade: 10, section: 'STE - Rutherford', subjectId: 'subj-eng10-t1', subjectCode: 'ENG10-T1', subjectTitle: 'English 10 (World Literature)', term: 1, room: 'Main Bldg Rm 201', schedule: 'TTH 1:00 - 2:30 PM' },
      { id: 'load-t3-3', grade: 12, section: 'STEM - Einstein', subjectId: 'shs-comm-t1', subjectCode: 'SHS-COMM', subjectTitle: 'Oral Communication in Context', term: 1, room: 'SHS Rm 302', schedule: 'MWF 2:00 - 3:00 PM' }
    ]
  },
  {
    id: 't-104',
    employeeNumber: 'T-2019-1153',
    name: 'Engr. Danilo S. Morfe',
    title: 'Master Teacher I',
    department: 'Technical-Vocational & Livelihood (TVL)',
    email: 'danilo.morfe@deped.gov.ph',
    phone: '0922-910-3345',
    advisorySection: {
      grade: 12,
      section: 'TVL - Turing',
      strand: 'TVL - ICT (Computer Systems)',
    },
    teachingLoads: [
      { id: 'load-t4-1', grade: 12, section: 'TVL - Turing', subjectId: 'tvl-css-t1', subjectCode: 'TVL-CSS', subjectTitle: 'Computer Systems Servicing NC II', term: 1, room: 'IT Lab 2', schedule: 'MWF 8:00 - 11:00 AM' },
      { id: 'load-t4-2', grade: 11, section: 'TVL - Turing', subjectId: 'tvl-empower-t2', subjectCode: 'TVL-EMP', subjectTitle: 'Empowerment Technologies', term: 2, room: 'IT Lab 1', schedule: 'TTH 9:00 - 11:00 AM' },
      { id: 'load-t4-3', grade: 12, section: 'STEM - Einstein', subjectId: 'tvl-immersion-t3', subjectCode: 'TVL-IMM', subjectTitle: 'Work Immersion / Culminating Activity', term: 3, room: 'Industry Placement', schedule: 'Daily 1:00 - 5:00 PM' }
    ]
  }
];


const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'stud-001',
    lrn: '109823450012',
    firstName: 'Maria Clara',
    middleName: 'Reyes',
    lastName: 'Santos',
    gender: 'Female',
    birthDate: '2010-04-15',
    age: 16,
    barangay: 'Barangay Poblacion 38',
    municipality: 'Infanta',
    province: 'Quezon',
    contactNumber: '0919-876-5432',
    guardianName: 'Florencia R. Santos',
    guardianRelationship: 'Mother',
    guardianContact: '0919-876-5430',
    gradeLevel: 10,
    section: 'STE - Rutherford',
    track: 'Junior High School',
    strand: 'Special Science Program (STE)',
    adviserId: 't-101',
    adviserName: 'Mrs. Josefina M. Alcala',
    schoolYear: '2025-2026',
    enrollmentStatus: 'Enrolled',
    generalAverage: 94.25,
    honors: 'With Honors',
    adviserRemarks: 'Exemplary performance in scientific research and mathematics. Active contributor to campus journalism (The Voice).',
    attendance: DEFAULT_ATTENDANCE,
    coreValues: DEFAULT_CORE_VALUES,
    grades: [
      { subjectId: 'subj-sci10', subjectCode: 'SCI10', subjectTitle: 'Advanced Chemistry & Physics', teacherName: 'Mrs. Josefina M. Alcala', q1: 95, q2: 96, q3: 94, q4: 95, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'subj-math10', subjectCode: 'MATH10', subjectTitle: 'Advanced Mathematics 10', teacherName: 'Mr. Emmanuel P. Dela Rosa', q1: 93, q2: 95, q3: 94, q4: 96, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'subj-eng10', subjectCode: 'ENG10', subjectTitle: 'English 10 (World Literature)', teacherName: 'Ms. Carmela V. Hernandez', q1: 92, q2: 94, q3: 95, q4: 95, finalRating: 94, remarks: 'Passed' },
      { subjectId: 'subj-fil10', subjectCode: 'FIL10', subjectTitle: 'Filipino 10 (El Filibusterismo)', teacherName: 'Gng. A. Coronel', q1: 93, q2: 93, q3: 92, q4: 94, finalRating: 93, remarks: 'Passed' },
      { subjectId: 'subj-ap10', subjectCode: 'AP10', subjectTitle: 'Araling Panlipunan (Kontemporaryong Isyu)', teacherName: 'G. R. Mortiz', q1: 94, q2: 95, q3: 95, q4: 96, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'subj-esp10', subjectCode: 'ESP10', subjectTitle: 'Edukasyon sa Pagpapakatao 10', teacherName: 'Gng. L. Cuerdo', q1: 96, q2: 96, q3: 95, q4: 97, finalRating: 96, remarks: 'Passed' },
      { subjectId: 'subj-mapeh10', subjectCode: 'MAPEH10', subjectTitle: 'MAPEH (Music, Arts, PE, Health)', teacherName: 'G. B. Pujeda', q1: 92, q2: 93, q3: 94, q4: 93, finalRating: 93, remarks: 'Passed' },
      { subjectId: 'subj-res10', subjectCode: 'RES10', subjectTitle: 'Scientific Research II (STE Investigatory)', teacherName: 'Mrs. Josefina M. Alcala', q1: 94, q2: 95, q3: 93, q4: 95, finalRating: 94, remarks: 'Passed' }
    ]
  },
  {
    id: 'stud-002',
    lrn: '109823450013',
    firstName: 'Juan Miguel',
    middleName: 'Bautista',
    lastName: 'Dela Cruz',
    gender: 'Male',
    birthDate: '2008-09-22',
    age: 18,
    barangay: 'Barangay Dinahican',
    municipality: 'Infanta',
    province: 'Quezon',
    contactNumber: '0928-112-3344',
    guardianName: 'Ernesto Dela Cruz',
    guardianRelationship: 'Father',
    guardianContact: '0928-112-3340',
    gradeLevel: 12,
    section: 'STEM - Einstein',
    track: 'Academic Track',
    strand: 'STEM',
    adviserId: 't-102',
    adviserName: 'Mr. Emmanuel P. Dela Rosa',
    schoolYear: '2025-2026',
    enrollmentStatus: 'Enrolled',
    generalAverage: 96.14,
    honors: 'With High Honors',
    adviserRemarks: 'Demonstrates stellar mathematical acumen. Lead researcher in the Quezon Regional Science Fair on coastal wave energy.',
    attendance: DEFAULT_ATTENDANCE,
    coreValues: DEFAULT_CORE_VALUES,
    grades: [
      { subjectId: 'stem-phys1', subjectCode: 'STEM-PHYS2', subjectTitle: 'General Physics 2', teacherName: 'Mr. Emmanuel P. Dela Rosa', q1: 97, q2: 98, q3: 96, q4: 97, finalRating: 97, remarks: 'Passed' },
      { subjectId: 'stem-chem2', subjectCode: 'STEM-CHEM2', subjectTitle: 'General Chemistry 2', teacherName: 'Mrs. Josefina M. Alcala', q1: 95, q2: 96, q3: 95, q4: 96, finalRating: 96, remarks: 'Passed' },
      { subjectId: 'stem-calc', subjectCode: 'STEM-CALC', subjectTitle: 'Basic Calculus', teacherName: 'Mr. Emmanuel P. Dela Rosa', q1: 96, q2: 97, q3: 98, q4: 98, finalRating: 97, remarks: 'Passed' },
      { subjectId: 'shs-comm', subjectCode: 'SHS-COMM', subjectTitle: 'Oral Communication in Context', teacherName: 'Ms. Carmela V. Hernandez', q1: 94, q2: 95, q3: 95, q4: 96, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'stem-res2', subjectCode: 'SHS-III', subjectTitle: 'Inquiries, Investigations & Immersion', teacherName: 'Mr. Emmanuel P. Dela Rosa', q1: 98, q2: 97, q3: 97, q4: 99, finalRating: 98, remarks: 'Passed' },
      { subjectId: 'shs-phil', subjectCode: 'SHS-PHIL', subjectTitle: 'Introduction to Philosophy of the Human Person', teacherName: 'Ms. Carmela V. Hernandez', q1: 94, q2: 95, q3: 94, q4: 95, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'tvl-immersion', subjectCode: 'SHS-IMM', subjectTitle: 'Work Immersion (LGU Infanta Engineering Office)', teacherName: 'Engr. Danilo S. Morfe', q1: 95, q2: 96, q3: 95, q4: 96, finalRating: 95, remarks: 'Passed' }
    ]
  },
  {
    id: 'stud-003',
    lrn: '109823450014',
    firstName: 'Princess Nicole',
    middleName: 'Villamayor',
    lastName: 'Cueto',
    gender: 'Female',
    birthDate: '2009-11-03',
    age: 17,
    barangay: 'Barangay Binulasan',
    municipality: 'Infanta',
    province: 'Quezon',
    contactNumber: '0917-223-9901',
    guardianName: 'Maritess Cueto',
    guardianRelationship: 'Mother',
    guardianContact: '0917-223-9900',
    gradeLevel: 11,
    section: 'HUMSS - Mabini',
    track: 'Academic Track',
    strand: 'HUMSS',
    adviserId: 't-103',
    adviserName: 'Ms. Carmela V. Hernandez',
    schoolYear: '2025-2026',
    enrollmentStatus: 'Enrolled',
    generalAverage: 92.50,
    honors: 'With Honors',
    adviserRemarks: 'Supreme Secondary Learner Government (SSLG) Secretary. Passionate community advocate and orator.',
    attendance: DEFAULT_ATTENDANCE,
    coreValues: DEFAULT_CORE_VALUES,
    grades: [
      { subjectId: 'hum-diass', subjectCode: 'HUM-DIASS', subjectTitle: 'Disciplines & Ideas in Social Sciences', teacherName: 'Ms. Carmela V. Hernandez', q1: 94, q2: 95, q3: 93, q4: 95, finalRating: 94, remarks: 'Passed' },
      { subjectId: 'hum-cw', subjectCode: 'HUM-CW', subjectTitle: 'Creative Writing / Malikhaing Pagsulat', teacherName: 'Ms. Carmela V. Hernandez', q1: 95, q2: 96, q3: 94, q4: 95, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'shs-genmath', subjectCode: 'SHS-GMATH', subjectTitle: 'General Mathematics', teacherName: 'Mr. Emmanuel P. Dela Rosa', q1: 88, q2: 90, q3: 89, q4: 91, finalRating: 90, remarks: 'Passed' },
      { subjectId: 'shs-els', subjectCode: 'SHS-ELS', subjectTitle: 'Earth and Life Science', teacherName: 'Mrs. Josefina M. Alcala', q1: 91, q2: 92, q3: 92, q4: 93, finalRating: 92, remarks: 'Passed' },
      { subjectId: 'shs-kom', subjectCode: 'SHS-KOM', subjectTitle: 'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino', teacherName: 'Gng. A. Coronel', q1: 94, q2: 94, q3: 93, q4: 95, finalRating: 94, remarks: 'Passed' },
      { subjectId: 'shs-pe1', subjectCode: 'SHS-PE1', subjectTitle: 'Physical Education and Health 1', teacherName: 'G. B. Pujeda', q1: 90, q2: 92, q3: 91, q4: 92, finalRating: 91, remarks: 'Passed' }
    ]
  },
  {
    id: 'stud-004',
    lrn: '109823450015',
    firstName: 'Joshua Kyle',
    middleName: 'Manalo',
    lastName: 'Penamante',
    gender: 'Male',
    birthDate: '2008-03-12',
    age: 18,
    barangay: 'Barangay Tongohin',
    municipality: 'Infanta',
    province: 'Quezon',
    contactNumber: '0939-556-7812',
    guardianName: 'Roberto Penamante',
    guardianRelationship: 'Father',
    guardianContact: '0939-556-7810',
    gradeLevel: 12,
    section: 'TVL - Turing',
    track: 'TVL Track',
    strand: 'TVL - ICT (Computer Systems)',
    adviserId: 't-104',
    adviserName: 'Engr. Danilo S. Morfe',
    schoolYear: '2025-2026',
    enrollmentStatus: 'Enrolled',
    generalAverage: 91.80,
    honors: 'With Honors',
    adviserRemarks: 'Demonstrates exceptional hardware assembly and local area networking skills. TESDA NC II certified.',
    attendance: DEFAULT_ATTENDANCE,
    coreValues: DEFAULT_CORE_VALUES,
    grades: [
      { subjectId: 'tvl-css', subjectCode: 'TVL-CSS12', subjectTitle: 'Computer Systems Servicing NC II', teacherName: 'Engr. Danilo S. Morfe', q1: 94, q2: 95, q3: 95, q4: 96, finalRating: 95, remarks: 'Passed' },
      { subjectId: 'tvl-empower', subjectCode: 'TVL-EMP', subjectTitle: 'Empowerment Technologies', teacherName: 'Engr. Danilo S. Morfe', q1: 92, q2: 93, q3: 93, q4: 94, finalRating: 93, remarks: 'Passed' },
      { subjectId: 'shs-mil', subjectCode: 'SHS-MIL', subjectTitle: 'Media and Information Literacy', teacherName: 'Ms. Carmela V. Hernandez', q1: 89, q2: 90, q3: 91, q4: 92, finalRating: 91, remarks: 'Passed' },
      { subjectId: 'tvl-immersion', subjectCode: 'TVL-IMM', subjectTitle: 'Work Immersion (IT Systems at Infanta Municipal Hall)', teacherName: 'Engr. Danilo S. Morfe', q1: 92, q2: 93, q3: 94, q4: 95, finalRating: 94, remarks: 'Passed' },
      { subjectId: 'shs-entrep', subjectCode: 'SHS-ENT', subjectTitle: 'Entrepreneurship for Tech-Voc', teacherName: 'G. L. Cuerdo', q1: 85, q2: 87, q3: 86, q4: 87, finalRating: 86, remarks: 'Passed' }
    ]
  },
  {
    id: 'stud-005',
    lrn: '109823450016',
    firstName: 'Christian Dave',
    middleName: 'Prudente',
    lastName: 'Flores',
    gender: 'Male',
    birthDate: '2011-06-18',
    age: 15,
    barangay: 'Barangay Silangan',
    municipality: 'Infanta',
    province: 'Quezon',
    contactNumber: '0917-665-4321',
    guardianName: 'Nomer Flores',
    guardianRelationship: 'Father',
    guardianContact: '0917-665-4320',
    gradeLevel: 8,
    section: 'Grade 8 - Bonifacio',
    track: 'Junior High School',
    strand: 'Regular JHS',
    adviserId: 't-101',
    adviserName: 'Mrs. Josefina M. Alcala',
    schoolYear: '2025-2026',
    enrollmentStatus: 'Enrolled',
    generalAverage: 89.25,
    honors: null,
    adviserRemarks: 'Shows steady progress in science laboratory activities. Recommended to join the mathematics tutorial session for quadratic topics.',
    attendance: DEFAULT_ATTENDANCE,
    coreValues: DEFAULT_CORE_VALUES,
    grades: [
      { subjectId: 'subj-math8', subjectCode: 'MATH8', subjectTitle: 'Mathematics 8 (Geometry & Algebra)', teacherName: 'Mr. Emmanuel P. Dela Rosa', q1: 86, q2: 88, q3: 87, q4: 89, finalRating: 88, remarks: 'Passed' },
      { subjectId: 'subj-sci8', subjectCode: 'SCI8', subjectTitle: 'Science 8 (Force, Motion & Energy)', teacherName: 'Mrs. Josefina M. Alcala', q1: 89, q2: 91, q3: 90, q4: 92, finalRating: 91, remarks: 'Passed' },
      { subjectId: 'subj-eng8', subjectCode: 'ENG8', subjectTitle: 'English 8 (Afro-Asian Literature)', teacherName: 'Ms. Carmela V. Hernandez', q1: 88, q2: 89, q3: 90, q4: 91, finalRating: 90, remarks: 'Passed' },
      { subjectId: 'subj-fil8', subjectCode: 'FIL8', subjectTitle: 'Filipino 8 (Florante at Laura)', teacherName: 'Gng. A. Coronel', q1: 89, q2: 89, q3: 90, q4: 90, finalRating: 90, remarks: 'Passed' },
      { subjectId: 'subj-ap8', subjectCode: 'AP8', subjectTitle: 'Araling Panlipunan 8 (Kasaysayan ng Daigdig)', teacherName: 'G. R. Mortiz', q1: 88, q2: 89, q3: 88, q4: 90, finalRating: 89, remarks: 'Passed' },
      { subjectId: 'subj-esp8', subjectCode: 'ESP8', subjectTitle: 'Edukasyon sa Pagpapakatao 8', teacherName: 'Gng. L. Cuerdo', q1: 91, q2: 92, q3: 91, q4: 92, finalRating: 92, remarks: 'Passed' },
      { subjectId: 'subj-tle8', subjectCode: 'TLE8', subjectTitle: 'TLE (Information & Communications Tech)', teacherName: 'Engr. Danilo S. Morfe', q1: 90, q2: 91, q3: 90, q4: 91, finalRating: 91, remarks: 'Passed' },
      { subjectId: 'subj-mapeh8', subjectCode: 'MAPEH8', subjectTitle: 'MAPEH 8', teacherName: 'G. B. Pujeda', q1: 86, q2: 87, q3: 88, q4: 88, finalRating: 87, remarks: 'Passed' }
    ]
  }
];

const INITIAL_APPLICATIONS: EnrollmentApplication[] = [
  {
    id: 'app-2026-001',
    submissionDate: '2026-10-28',
    applicationType: 'Grade 7 (Incoming JHS)',
    firstName: 'Samantha Jane',
    middleName: 'Villanueva',
    lastName: 'Mercado',
    gender: 'Female',
    birthDate: '2013-05-19',
    email: 'mercado.family@gmail.com',
    contactNumber: '0917-123-8899',
    addressBarangay: 'Barangay Banugao, Infanta, Quezon',
    previousSchool: 'Infanta Central Elementary School',
    targetGrade: 7,
    targetStrand: 'Special Science Program (STE)',
    guardianName: 'Ariel Mercado',
    guardianContact: '0917-123-8890',
    documentsSubmitted: ['PSA Birth Certificate', 'SF9 / Elementary Report Card (General Average: 93.4)', 'Good Moral Certificate'],
    status: 'Pending Review',
    notes: 'Applying for STE examination schedule. High science and math grades.'
  },
  {
    id: 'app-2026-002',
    submissionDate: '2026-11-01',
    applicationType: 'Grade 11 (Incoming SHS)',
    firstName: 'Gabriel Lance',
    middleName: 'Romero',
    lastName: 'Austria',
    gender: 'Male',
    birthDate: '2010-02-14',
    email: 'austria.gabriel@gmail.com',
    contactNumber: '0922-445-6677',
    addressBarangay: 'Barangay Antikin, Infanta, Quezon',
    previousSchool: 'Infanta National High School (Completer)',
    targetGrade: 11,
    targetStrand: 'STEM',
    guardianName: 'Marilou Austria',
    guardianContact: '0922-445-6670',
    documentsSubmitted: ['JHS Completion Certificate', 'Grade 10 SF9', 'NCAE Result Sheet'],
    status: 'Approved',
    assignedSection: 'STEM - Newton',
    notes: 'Met all STEM prerequisites with 91+ average in JHS Science and Math.'
  },
  {
    id: 'app-2026-003',
    submissionDate: '2026-11-03',
    applicationType: 'Grade 11 (Incoming SHS)',
    firstName: 'Kayla Mae',
    middleName: 'Soriano',
    lastName: 'De Guzman',
    gender: 'Female',
    birthDate: '2010-08-30',
    email: 'deguzman.kayla@yahoo.com',
    contactNumber: '0918-990-1122',
    addressBarangay: 'Barangay Catambungan, Infanta, Quezon',
    previousSchool: 'Real National High School',
    targetGrade: 11,
    targetStrand: 'TVL - Home Economics',
    guardianName: 'Rolando De Guzman',
    guardianContact: '0918-990-1120',
    documentsSubmitted: ['PSA Birth Certificate', 'Form 137 / SF10 request endorsed'],
    status: 'Requires Verification',
    notes: 'Please submit 2x2 formal ID photos and Certificate of Good Moral Character.'
  }
];

const INITIAL_UPDATES: SchoolUpdate[] = [
  {
    id: 'upd-01',
    title: 'Early Registration for S.Y. 2026-2027 Officially Opened',
    category: 'Admissions',
    date: 'November 2, 2026',
    author: 'Office of the School Registrar',
    summary: 'DepEd early registration for incoming Grade 7 (Junior High) and Grade 11 (Senior High) is now accepting online and in-campus submissions.',
    content: 'In line with DepEd Order No. 03, s. 2018, Infanta National High School invites all elementary completers and Grade 10 completers to register for the upcoming academic year. Applications can now be submitted through this online portal or in-person at the School Gymnasium from 8:00 AM to 4:00 PM on weekdays.',
    featured: true,
    tag: 'Admissions'
  },
  {
    id: 'upd-02',
    title: 'INHS Young Scientists Qualify for Regional Science Fair in Batangas',
    category: 'Academic',
    date: 'October 24, 2026',
    author: 'Science Department & STE Club',
    summary: 'Two research investigatory projects from Grade 10 STE and Grade 12 STEM won top honors in Division of Quezon Science Festival.',
    content: 'We congratulate our student researchers and teacher-coaches Mrs. Josefina Alcala and Mr. Emmanuel Dela Rosa. Their projects on "Mangrove Soil Microbial Diversity in Infanta Coastal Estuaries" and "Low-Cost Solar Water Desalination Prototypes" will represent Quezon Division in the Regional Science and Technology Fair (RSTF) 2026.',
    featured: true,
    tag: 'Academic Excellence'
  },
  {
    id: 'upd-03',
    title: 'Schedule of Second Quarter Periodic Examinations',
    category: 'Announcement',
    date: 'October 15, 2026',
    author: 'Office of the Principal',
    summary: 'Second Periodic Examinations for all Junior and Senior High School levels will be administered on November 12-13, 2026.',
    content: 'All learners are advised to settle their subject requirements, attend review sessions, and secure exam clearance slips from their respective class advisers. No exam fees are collected in compliance with the DepEd No Collection Policy.',
    featured: false,
    tag: 'Examinations'
  },
  {
    id: 'upd-04',
    title: 'Supreme Secondary Learner Government (SSLG) Launches "Luntian Infanta" Tree Planting',
    category: 'Activities',
    date: 'October 8, 2026',
    author: 'SSLG Infanta NHS Chapter',
    summary: 'Over 200 student leaders, Boy Scouts, and Girl Scouts participated in coastal mangrove reforestation in Barangay Dinahican.',
    content: 'In partnership with the Municipal Environment and Natural Resources Office (MENRO) of Infanta, the SSLG spearheaded the planting of 1,500 bakawan propagules to safeguard the Infanta coastline and reinforce our Makakalikasan core value.',
    featured: false,
    tag: 'Student Life'
  }
];

const INITIAL_ACTIVITIES: SchoolActivity[] = [
  {
    id: 'act-01',
    title: '2nd Quarter Periodic Examinations (All Levels)',
    date: 'Nov 12 - 13, 2026',
    time: '7:30 AM - 4:30 PM',
    venue: 'Designated Classrooms',
    category: 'Examination',
    description: 'Quarterly assessment covering Modules 1 to 4 of Quarter 2 across all learning areas.',
    status: 'Upcoming'
  },
  {
    id: 'act-02',
    title: 'National Reading Month & English-Filipino Literacy Fair',
    date: 'Nov 20 - 24, 2026',
    time: '8:00 AM - 5:00 PM',
    venue: 'School Gymnasium & INHS Library',
    category: 'Academic',
    description: 'Book character parade, Spoken Word poetry competition, Reader-theater, and Quiz Bee.',
    status: 'Upcoming'
  },
  {
    id: 'act-03',
    title: 'Infanta District Athletic Meet 2026 (Palarong Pampaaralan)',
    date: 'Dec 4 - 6, 2026',
    time: '6:30 AM - 6:00 PM',
    venue: 'Infanta Sports Complex & INHS Oval',
    category: 'Sports',
    description: 'Track and field, basketball, volleyball, badminton, table tennis, and sepaktakraw competitions.',
    status: 'Upcoming'
  },
  {
    id: 'act-04',
    title: 'Senior High School Career & Higher Education Fair',
    date: 'Dec 15, 2026',
    time: '9:00 AM - 3:00 PM',
    venue: 'INHS Multipurpose Covered Court',
    category: 'Celebration',
    description: 'Career guidance symposium with state universities (SLSU, PUP, UPLB), CHED, and TESDA accredited institutes.',
    status: 'Upcoming'
  }
];

const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-admin',
    username: 'Admin',
    password: 'Inhs67890',
    role: 'admin',
    fullName: 'System Administrator',
    designation: 'School Head / ICT Governance',
    email: 'admin@inhs.deped.gov.ph',
    phone: '(042) 535-2144',
    createdAt: '2026-06-01',
    isPrimaryAdmin: true,
  },
  {
    id: 'acc-t1',
    username: 'josefina.alcala',
    password: 'password123',
    role: 'teacher',
    fullName: 'Mrs. Josefina M. Alcala',
    designation: 'Master Teacher II - Science & Math',
    email: 'josefina.alcala@deped.gov.ph',
    phone: '0917-889-1240',
    teacherId: 't-101',
    createdAt: '2026-06-01',
  },
  {
    id: 'acc-t2',
    username: 'emmanuel.delarosa',
    password: 'password123',
    role: 'teacher',
    fullName: 'Mr. Emmanuel P. Dela Rosa',
    designation: 'Teacher III - Senior High STEM',
    email: 'emmanuel.delarosa@deped.gov.ph',
    phone: '0920-554-9981',
    teacherId: 't-102',
    createdAt: '2026-06-01',
  },
  {
    id: 'acc-t3',
    username: 'carmela.hernandez',
    password: 'password123',
    role: 'teacher',
    fullName: 'Ms. Carmela V. Hernandez',
    designation: 'Teacher II - Languages & Humanities',
    email: 'carmela.hernandez@deped.gov.ph',
    phone: '0918-344-7721',
    teacherId: 't-103',
    createdAt: '2026-06-01',
  },
  {
    id: 'acc-t4',
    username: 'danilo.morfe',
    password: 'password123',
    role: 'teacher',
    fullName: 'Engr. Danilo S. Morfe',
    designation: 'Master Teacher I - TVL & TLE',
    email: 'danilo.morfe@deped.gov.ph',
    phone: '0922-910-3345',
    teacherId: 't-104',
    createdAt: '2026-06-01',
  },
];

const INITIAL_SECTIONS: SchoolClassSection[] = [
  {
    id: 'sec-g10-ste',
    gradeLevel: 10,
    sectionName: 'STE - Rutherford',
    track: 'Junior High School',
    strand: 'Special Science Program (STE)',
    roomNumber: 'Science Bldg, Rm 201',
    adviserId: 't-101',
    adviserName: 'Mrs. Josefina M. Alcala',
    schoolYear: '2026–2027',
    studentIds: ['stud-001'],
    maxCapacity: 45,
  },
  {
    id: 'sec-g12-stem',
    gradeLevel: 12,
    sectionName: 'STEM - Einstein',
    track: 'Academic Track',
    strand: 'STEM',
    roomNumber: 'SHS Bldg, Rm 302',
    adviserId: 't-102',
    adviserName: 'Mr. Emmanuel P. Dela Rosa',
    schoolYear: '2026–2027',
    studentIds: ['stud-002'],
    maxCapacity: 45,
  },
  {
    id: 'sec-g11-humss',
    gradeLevel: 11,
    sectionName: 'HUMSS - Mabini',
    track: 'Academic Track',
    strand: 'HUMSS',
    roomNumber: 'SHS Bldg, Rm 204',
    adviserId: 't-103',
    adviserName: 'Ms. Carmela V. Hernandez',
    schoolYear: '2026–2027',
    studentIds: ['stud-003'],
    maxCapacity: 45,
  },
  {
    id: 'sec-g12-tvl-turing',
    gradeLevel: 12,
    sectionName: 'TVL - Turing',
    track: 'TVL Track',
    strand: 'TVL - ICT (Computer Systems)',
    roomNumber: 'IT Computer Lab 2',
    adviserId: 't-104',
    adviserName: 'Engr. Danilo S. Morfe',
    schoolYear: '2026–2027',
    studentIds: ['stud-004'],
    maxCapacity: 40,
  },
  {
    id: 'sec-g8-bonifacio',
    gradeLevel: 8,
    sectionName: 'Grade 8 - Bonifacio',
    track: 'Junior High School',
    strand: 'Regular JHS',
    roomNumber: 'Main Bldg, Rm 104',
    adviserId: 't-101',
    adviserName: 'Mrs. Josefina M. Alcala',
    schoolYear: '2026–2027',
    studentIds: ['stud-005'],
    maxCapacity: 50,
  },
  {
    id: 'sec-g7-diamond',
    gradeLevel: 7,
    sectionName: 'Grade 7 - Diamond',
    track: 'Junior High School',
    strand: 'Regular JHS',
    roomNumber: 'Main Bldg, Rm 101',
    adviserId: 't-103',
    adviserName: 'Ms. Carmela V. Hernandez',
    schoolYear: '2026–2027',
    studentIds: [],
    maxCapacity: 50,
  },
  {
    id: 'sec-g11-eim-tesla',
    gradeLevel: 11,
    sectionName: 'TVL - Tesla (EIM)',
    track: 'TVL Track',
    strand: 'TVL - Electrical Installation and Maintenance (EIM)',
    roomNumber: 'Tech-Voc Workshop 1',
    adviserId: 't-104',
    adviserName: 'Engr. Danilo S. Morfe',
    schoolYear: '2026–2027',
    studentIds: [],
    maxCapacity: 40,
  },
  {
    id: 'sec-g11-epas-volt',
    gradeLevel: 11,
    sectionName: 'TVL - Volt (EPAS)',
    track: 'TVL Track',
    strand: 'TVL - Electronic Products Assembly and Servicing (EPAS)',
    roomNumber: 'Electronics Lab Rm 102',
    adviserId: 't-104',
    adviserName: 'Engr. Danilo S. Morfe',
    schoolYear: '2026–2027',
    studentIds: [],
    maxCapacity: 40,
  },
];

class SchoolDatabaseService {
  private data: DatabaseSchema;
  private listeners: (() => void)[] = [];

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseSchema {
    try {
      const stored = localStorage.getItem(DB_KEY) || localStorage.getItem('inhs_school_database_v1');
      if (stored) {
        const parsed: DatabaseSchema = JSON.parse(stored);
        
        // Ensure accounts exist and Admin has Username: Admin and Password: Inhs67890
        if (!parsed.accounts || !Array.isArray(parsed.accounts) || parsed.accounts.length === 0) {
          parsed.accounts = INITIAL_ACCOUNTS;
        } else {
          const adminIdx = parsed.accounts.findIndex(a => a.username.toLowerCase() === 'admin');
          if (adminIdx === -1) {
            parsed.accounts.unshift(INITIAL_ACCOUNTS[0]);
          } else {
            parsed.accounts[adminIdx].password = 'Inhs67890';
            parsed.accounts[adminIdx].role = 'admin';
            parsed.accounts[adminIdx].isPrimaryAdmin = true;
          }
        }

        // Ensure sections exist
        if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
          parsed.sections = INITIAL_SECTIONS;
        }

        // Ensure teachers exist and sync with any teacher accounts
        if (!parsed.teachers || !Array.isArray(parsed.teachers) || parsed.teachers.length === 0) {
          parsed.teachers = INITIAL_TEACHERS;
        } else {
          // Cross-verify all teacher accounts exist in teachers list
          parsed.accounts?.forEach(acc => {
            if (acc.role === 'teacher') {
              const exists = parsed.teachers.some(
                t => (acc.teacherId && t.id === acc.teacherId) || t.name.trim().toLowerCase() === acc.fullName.trim().toLowerCase()
              );
              if (!exists) {
                const tId = acc.teacherId || `t-${Math.random().toString(36).substr(2, 6)}`;
                acc.teacherId = tId;
                parsed.teachers.push({
                  id: tId,
                  employeeNumber: `T-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                  name: acc.fullName,
                  title: acc.designation || 'Teacher I',
                  department: 'Junior High School Faculty',
                  email: acc.email || `${acc.username.toLowerCase()}@deped.gov.ph`,
                  phone: acc.phone || '0917-000-0000',
                  teachingLoads: [],
                });
              }
            }
          });
        }

        // Ensure curriculum subjects exist
        if (!parsed.curriculumSubjects || !Array.isArray(parsed.curriculumSubjects) || parsed.curriculumSubjects.length === 0) {
          parsed.curriculumSubjects = INITIAL_CURRICULUM_SUBJECTS;
        }

        // Normalize student grades to 3 terms
        parsed.students?.forEach(st => {
          st.grades?.forEach(g => {
            if (g.term1 === undefined || g.term1 === null) g.term1 = g.q1 ?? null;
            if (g.term2 === undefined || g.term2 === null) g.term2 = g.q2 ?? null;
            if (g.term3 === undefined || g.term3 === null) g.term3 = g.q3 ?? null;
            const finalCalc = calculateSubjectFinal(g);
            g.finalRating = finalCalc.finalRating;
            g.remarks = finalCalc.remarks;
          });
          const avgCalc = calculateGeneralAverage(st.grades || []);
          st.generalAverage = avgCalc.generalAverage;
          st.honors = avgCalc.honors;
        });

        // Ensure teacher teaching loads have id and term
        parsed.teachers?.forEach(t => {
          if (!t.teachingLoads) t.teachingLoads = [];
          t.teachingLoads = t.teachingLoads.map((load, idx) => ({
            ...load,
            id: load.id || `load-${t.id}-${idx + 1}`,
            term: load.term || 1,
          }));
        });

        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored INHS database, falling back to defaults', e);
    }

    const initial: DatabaseSchema = {
      students: INITIAL_STUDENTS,
      teachers: INITIAL_TEACHERS,
      curriculumSubjects: INITIAL_CURRICULUM_SUBJECTS,
      enrollmentApplications: INITIAL_APPLICATIONS,
      updates: INITIAL_UPDATES,
      activities: INITIAL_ACTIVITIES,
      accounts: INITIAL_ACCOUNTS,
      sections: INITIAL_SECTIONS,
    };
    this.persist(initial);
    return initial;
  }

  private persist(data: DatabaseSchema) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      this.notify();
    } catch (e) {
      console.error('Failed to persist INHS database to localStorage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try { l(); } catch (err) { console.error('Error in database subscriber', err); }
    });
  }

  // --- Students ---
  public getStudents(): StudentProfile[] {
    return [...this.data.students];
  }

  public getStudentById(id: string): StudentProfile | undefined {
    return this.data.students.find(s => s.id === id);
  }

  public getStudentByLrn(lrn: string): StudentProfile | undefined {
    const clean = lrn.trim().replace(/\D/g, '');
    return this.data.students.find(s => s.lrn.replace(/\D/g, '') === clean);
  }

  public saveStudent(student: StudentProfile): void {
    // Recompute subject final ratings and general average
    const updatedGrades = student.grades.map(grade => {
      const computed = calculateSubjectFinal(grade);
      return {
        ...grade,
        finalRating: computed.finalRating,
        remarks: computed.remarks,
      };
    });

    const { generalAverage, honors } = calculateGeneralAverage(updatedGrades);

    const updatedStudent: StudentProfile = {
      ...student,
      grades: updatedGrades,
      generalAverage,
      honors,
    };

    const index = this.data.students.findIndex(s => s.id === student.id);
    if (index >= 0) {
      this.data.students[index] = updatedStudent;
    } else {
      this.data.students.push(updatedStudent);
    }
    this.persist(this.data);
  }

  public updateStudentGrades(studentId: string, updatedGrades: SubjectGrade[], adviserRemarks?: string): boolean {
    const student = this.getStudentById(studentId);
    if (!student) return false;

    // Recalculate
    const gradesWithFinals = updatedGrades.map(g => {
      const finalCalc = calculateSubjectFinal(g);
      return {
        ...g,
        finalRating: finalCalc.finalRating,
        remarks: finalCalc.remarks,
      };
    });

    const { generalAverage, honors } = calculateGeneralAverage(gradesWithFinals);

    student.grades = gradesWithFinals;
    student.generalAverage = generalAverage;
    student.honors = honors;
    if (adviserRemarks !== undefined) {
      student.adviserRemarks = adviserRemarks;
    }

    this.persist(this.data);
    return true;
  }

  public deleteStudent(id: string): boolean {
    const prevLen = this.data.students.length;
    this.data.students = this.data.students.filter(s => s.id !== id);
    if (this.data.students.length !== prevLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // --- Teachers ---
  public getTeachers(): Teacher[] {
    return [...this.data.teachers];
  }

  public getTeacherById(id: string): Teacher | undefined {
    return this.data.teachers.find(t => t.id === id);
  }

  public addTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
    const newTeacher: Teacher = {
      ...teacher,
      id: `t-${Date.now().toString().slice(-6)}`,
    };
    this.data.teachers.push(newTeacher);
    this.persist(this.data);
    return newTeacher;
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): boolean {
    const teacher = this.data.teachers.find(t => t.id === id);
    if (!teacher) return false;
    Object.assign(teacher, updates);
    this.persist(this.data);
    return true;
  }

  public deleteTeacher(id: string): boolean {
    const prevLen = this.data.teachers.length;
    this.data.teachers = this.data.teachers.filter(t => t.id !== id);
    if (this.data.teachers.length !== prevLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // --- Enrollment Applications ---
  public getEnrollmentApplications(): EnrollmentApplication[] {
    return [...this.data.enrollmentApplications];
  }

  public submitEnrollmentApplication(app: Omit<EnrollmentApplication, 'id' | 'submissionDate' | 'status'>): EnrollmentApplication {
    const newApp: EnrollmentApplication = {
      ...app,
      id: `app-${Date.now().toString().slice(-6)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
    };
    this.data.enrollmentApplications.unshift(newApp);
    this.persist(this.data);
    return newApp;
  }

  public updateApplicationStatus(id: string, status: EnrollmentApplication['status'], notes?: string, assignedSection?: string): boolean {
    const app = this.data.enrollmentApplications.find(a => a.id === id);
    if (!app) return false;

    app.status = status;
    if (notes !== undefined) app.notes = notes;
    if (assignedSection !== undefined) app.assignedSection = assignedSection;

    // If approved and not already converted to student, auto-enroll into student database
    if (status === 'Approved' && !this.data.students.some(s => s.firstName.toLowerCase() === app.firstName.toLowerCase() && s.lastName.toLowerCase() === app.lastName.toLowerCase())) {
      const newLrn = app.lrn || `10982345${Math.floor(1000 + Math.random() * 9000)}`;
      const targetSec = this.data.sections.find(s => s.sectionName === assignedSection);
      
      const newStudent: StudentProfile = {
        id: `stud-${Date.now().toString().slice(-5)}`,
        lrn: newLrn,
        firstName: app.firstName,
        middleName: app.middleName || '',
        lastName: app.lastName,
        extensionName: app.extensionName,
        gender: app.gender,
        birthDate: app.birthDate,
        age: Math.max(12, new Date().getFullYear() - new Date(app.birthDate).getFullYear()),
        barangay: app.addressBarangay,
        municipality: 'Infanta',
        province: 'Quezon',
        contactNumber: app.contactNumber,
        guardianName: app.guardianName,
        guardianRelationship: 'Guardian',
        guardianContact: app.guardianContact,
        gradeLevel: app.targetGrade,
        section: assignedSection || (app.targetGrade >= 11 ? `${app.targetStrand.split(' ')[0]} - Section A` : 'Section 1'),
        track: app.targetGrade >= 11 ? (app.targetStrand.includes('TVL') ? 'TVL Track' : 'Academic Track') : 'Junior High School',
        strand: app.targetStrand,
        adviserId: targetSec?.adviserId || 't-101',
        adviserName: targetSec?.adviserName || 'Mrs. Josefina M. Alcala',
        schoolYear: '2026-2027',
        enrollmentStatus: 'Enrolled',
        grades: [],
        generalAverage: null,
        honors: null,
        attendance: DEFAULT_ATTENDANCE,
        coreValues: DEFAULT_CORE_VALUES,
        adviserRemarks: `Newly approved & enrolled into S.Y. 2026–2027 (${assignedSection || 'General'}).`,
      };
      this.data.students.push(newStudent);

      // Add to section's studentIds
      if (targetSec && !targetSec.studentIds.includes(newStudent.id)) {
        targetSec.studentIds.push(newStudent.id);
      }
    }

    this.persist(this.data);
    return true;
  }

  public approveEnrollmentApplication(
    appId: string, 
    assignedSection: string, 
    notes?: string, 
    reviewerName: string = 'System Administrator'
  ): { success: boolean; student?: StudentProfile; error?: string } {
    const app = this.data.enrollmentApplications.find(a => a.id === appId);
    if (!app) return { success: false, error: 'Application not found.' };

    app.status = 'Approved';
    app.assignedSection = assignedSection;
    app.notes = notes || 'All documentary credentials verified by Office of the Registrar.';
    app.reviewedBy = reviewerName;
    app.reviewedDate = new Date().toISOString().split('T')[0];

    // Find section
    const sec = this.data.sections.find(s => s.sectionName === assignedSection);

    // Create or locate student
    let student = this.data.students.find(
      s => s.firstName.toLowerCase() === app.firstName.toLowerCase() && s.lastName.toLowerCase() === app.lastName.toLowerCase()
    );

    if (!student) {
      const newLrn = app.lrn || `10982345${Math.floor(1000 + Math.random() * 9000)}`;
      student = {
        id: `stud-${Date.now().toString().slice(-5)}`,
        lrn: newLrn,
        firstName: app.firstName,
        middleName: app.middleName || '',
        lastName: app.lastName,
        extensionName: app.extensionName,
        gender: app.gender,
        birthDate: app.birthDate,
        age: Math.max(12, new Date().getFullYear() - new Date(app.birthDate).getFullYear()),
        barangay: app.addressBarangay,
        municipality: 'Infanta',
        province: 'Quezon',
        contactNumber: app.contactNumber,
        guardianName: app.guardianName,
        guardianRelationship: 'Parent/Guardian',
        guardianContact: app.guardianContact,
        gradeLevel: app.targetGrade,
        section: assignedSection,
        track: app.targetGrade >= 11 ? (app.targetStrand.includes('TVL') ? 'TVL Track' : 'Academic Track') : 'Junior High School',
        strand: app.targetStrand,
        adviserId: sec?.adviserId || 't-101',
        adviserName: sec?.adviserName || 'Mrs. Josefina M. Alcala',
        schoolYear: '2026-2027',
        enrollmentStatus: 'Enrolled',
        grades: [],
        generalAverage: null,
        honors: null,
        attendance: DEFAULT_ATTENDANCE,
        coreValues: DEFAULT_CORE_VALUES,
        adviserRemarks: `Enrollment officially approved into ${assignedSection}. S.Y. 2026–2027.`,
      };
      this.data.students.push(student);
    } else {
      student.section = assignedSection;
      student.enrollmentStatus = 'Enrolled';
      if (sec) {
        student.adviserId = sec.adviserId;
        student.adviserName = sec.adviserName;
      }
    }

    if (sec && !sec.studentIds.includes(student.id)) {
      sec.studentIds.push(student.id);
    }

    this.persist(this.data);
    return { success: true, student };
  }

  public denyEnrollmentApplication(
    appId: string, 
    denialReason: string, 
    reviewerName: string = 'System Administrator'
  ): { success: boolean; error?: string } {
    const app = this.data.enrollmentApplications.find(a => a.id === appId);
    if (!app) return { success: false, error: 'Application not found.' };

    app.status = 'Denied';
    app.denialReason = denialReason;
    app.notes = `Application Denied: ${denialReason}`;
    app.reviewedBy = reviewerName;
    app.reviewedDate = new Date().toISOString().split('T')[0];

    this.persist(this.data);
    return { success: true };
  }

  // --- Curriculum Subjects (Encoded per Year Level & Term/Semester) ---
  public getCurriculumSubjects(grade?: GradeLevel, term?: TermSemester): CurriculumSubject[] {
    let list = [...this.data.curriculumSubjects];
    if (grade !== undefined) {
      list = list.filter(s => s.gradeLevel === grade);
    }
    if (term !== undefined) {
      list = list.filter(s => s.term === term);
    }
    return list;
  }

  public addCurriculumSubject(subject: Omit<CurriculumSubject, 'id'>): CurriculumSubject {
    const newSubj: CurriculumSubject = {
      ...subject,
      id: `subj-${Date.now().toString().slice(-6)}`,
    };
    this.data.curriculumSubjects.push(newSubj);
    this.persist(this.data);
    return newSubj;
  }

  public updateCurriculumSubject(id: string, updates: Partial<CurriculumSubject>): boolean {
    const subj = this.data.curriculumSubjects.find(s => s.id === id);
    if (!subj) return false;
    Object.assign(subj, updates);
    this.persist(this.data);
    return true;
  }

  public deleteCurriculumSubject(id: string): boolean {
    const prevLen = this.data.curriculumSubjects.length;
    this.data.curriculumSubjects = this.data.curriculumSubjects.filter(s => s.id !== id);
    if (this.data.curriculumSubjects.length !== prevLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public resetCurriculumToDefault(): void {
    this.data.curriculumSubjects = [...INITIAL_CURRICULUM_SUBJECTS];
    this.persist(this.data);
  }

  // --- Teacher Teaching Load Management ---
  public addTeacherTeachingLoad(teacherId: string, load: Omit<TeachingLoad, 'id'>): TeachingLoad | null {
    const teacher = this.data.teachers.find(t => t.id === teacherId);
    if (!teacher) return null;

    if (!teacher.teachingLoads) {
      teacher.teachingLoads = [];
    }

    const newLoad: TeachingLoad = {
      ...load,
      id: `load-${Date.now().toString().slice(-6)}`,
    };

    teacher.teachingLoads.push(newLoad);
    this.persist(this.data);
    return newLoad;
  }

  public removeTeacherTeachingLoad(teacherId: string, loadId: string): boolean {
    const teacher = this.data.teachers.find(t => t.id === teacherId);
    if (!teacher || !teacher.teachingLoads) return false;

    const prevLen = teacher.teachingLoads.length;
    teacher.teachingLoads = teacher.teachingLoads.filter(l => l.id !== loadId);
    if (teacher.teachingLoads.length !== prevLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public updateTeacherTeachingLoad(teacherId: string, loadId: string, updates: Partial<TeachingLoad>): boolean {
    const teacher = this.data.teachers.find(t => t.id === teacherId);
    if (!teacher || !teacher.teachingLoads) return false;

    const load = teacher.teachingLoads.find(l => l.id === loadId);
    if (!load) return false;

    Object.assign(load, updates);
    this.persist(this.data);
    return true;
  }

  // --- Updates & Activities ---
  public getSchoolUpdates(): SchoolUpdate[] {
    return [...this.data.updates];
  }

  public addSchoolUpdate(update: Omit<SchoolUpdate, 'id'>): SchoolUpdate {
    const newUpdate: SchoolUpdate = {
      ...update,
      id: `upd-${Date.now().toString().slice(-6)}`,
    };
    this.data.updates.unshift(newUpdate);
    this.persist(this.data);
    return newUpdate;
  }

  public deleteSchoolUpdate(id: string): boolean {
    const len = this.data.updates.length;
    this.data.updates = this.data.updates.filter(u => u.id !== id);
    if (this.data.updates.length !== len) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public getSchoolActivities(): SchoolActivity[] {
    return [...this.data.activities];
  }

  public addSchoolActivity(activity: Omit<SchoolActivity, 'id'>): SchoolActivity {
    const newAct: SchoolActivity = {
      ...activity,
      id: `act-${Date.now().toString().slice(-6)}`,
    };
    this.data.activities.push(newAct);
    this.persist(this.data);
    return newAct;
  }

  // --- User Accounts & Authentication ---
  public getAccounts(): UserAccount[] {
    return [...this.data.accounts];
  }

  public authenticate(username: string, password: string): UserAccount | null {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();
    const account = this.data.accounts.find(
      a => a.username.trim().toLowerCase() === cleanUser && a.password.trim() === cleanPass
    );
    return account ? { ...account } : null;
  }

  public createAccount(account: Omit<UserAccount, 'id' | 'createdAt'>): { success: boolean; account?: UserAccount; error?: string } {
    const cleanUser = account.username.trim();
    if (!cleanUser) {
      return { success: false, error: 'Username cannot be empty.' };
    }
    if (!account.password || account.password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }
    const exists = this.data.accounts.some(a => a.username.toLowerCase() === cleanUser.toLowerCase());
    if (exists) {
      return { success: false, error: `Account with username "${cleanUser}" already exists.` };
    }

    const newAccount: UserAccount = {
      ...account,
      id: `acc-${Date.now().toString().slice(-6)}`,
      username: cleanUser,
      createdAt: new Date().toISOString().split('T')[0],
      isPrimaryAdmin: false,
    };

    // If role is teacher, automatically register & sync teacher profile so they appear in advisers/faculty list
    if (newAccount.role === 'teacher') {
      const teacherId = newAccount.teacherId || `t-${Date.now().toString().slice(-6)}`;
      newAccount.teacherId = teacherId;

      const existingTeacherIndex = this.data.teachers.findIndex(
        t => t.id === teacherId || t.name.trim().toLowerCase() === newAccount.fullName.trim().toLowerCase()
      );

      if (existingTeacherIndex === -1) {
        const des = (newAccount.designation || '').toLowerCase();
        let dept = 'Junior High School Faculty';
        if (des.includes('science') || des.includes('math')) dept = 'Science & Mathematics';
        else if (des.includes('stem')) dept = 'Senior High School - STEM';
        else if (des.includes('abm')) dept = 'Senior High School - ABM';
        else if (des.includes('humss')) dept = 'Senior High School - HUMSS';
        else if (des.includes('english') || des.includes('filipino') || des.includes('language') || des.includes('humanities')) dept = 'Languages & Humanities';
        else if (des.includes('tvl') || des.includes('tle') || des.includes('ict') || des.includes('tech')) dept = 'Technical-Vocational & Livelihood';
        else if (des.includes('ap') || des.includes('social') || des.includes('history')) dept = 'Araling Panlipunan & Social Sciences';
        else if (des.includes('mapeh') || des.includes('values') || des.includes('esp')) dept = 'MAPEH & Values Education';

        const newTeacher: Teacher = {
          id: teacherId,
          employeeNumber: `T-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          name: newAccount.fullName,
          title: newAccount.designation || 'Teacher I',
          department: dept,
          email: newAccount.email || `${cleanUser.toLowerCase()}@deped.gov.ph`,
          phone: newAccount.phone || '0917-000-0000',
          teachingLoads: [],
        };

        this.data.teachers.push(newTeacher);
      } else {
        newAccount.teacherId = this.data.teachers[existingTeacherIndex].id;
      }
    }

    this.data.accounts.unshift(newAccount);
    this.persist(this.data);
    return { success: true, account: newAccount };
  }

  public updateAccount(id: string, updates: Partial<UserAccount>): boolean {
    const acc = this.data.accounts.find(a => a.id === id);
    if (!acc) return false;
    Object.assign(acc, updates);

    // If teacher account, keep the associated teacher profile in sync
    if (acc.role === 'teacher' && acc.teacherId) {
      const teacher = this.data.teachers.find(t => t.id === acc.teacherId);
      if (teacher) {
        if (updates.fullName) teacher.name = updates.fullName;
        if (updates.designation) teacher.title = updates.designation;
        if (updates.email) teacher.email = updates.email;
        if (updates.phone) teacher.phone = updates.phone;
      }
    }

    this.persist(this.data);
    return true;
  }

  public deleteAccount(id: string): { success: boolean; error?: string } {
    const acc = this.data.accounts.find(a => a.id === id);
    if (!acc) return { success: false, error: 'Account not found.' };
    if (acc.isPrimaryAdmin || acc.username.toLowerCase() === 'admin') {
      return { success: false, error: 'The primary Admin account cannot be deleted.' };
    }

    // If teacher account, remove associated teacher profile as well
    if (acc.role === 'teacher' && acc.teacherId) {
      this.data.teachers = this.data.teachers.filter(t => t.id !== acc.teacherId);
    }

    this.data.accounts = this.data.accounts.filter(a => a.id !== id);
    this.persist(this.data);
    return { success: true };
  }

  public verifyAdminPassword(password: string): boolean {
    const adminAcc = this.data.accounts.find(a => a.username.toLowerCase() === 'admin');
    const expectedPassword = adminAcc?.password || 'Inhs67890';
    return password.trim() === expectedPassword.trim();
  }

  // --- Classes & Sections ---
  public getSections(): SchoolClassSection[] {
    return [...this.data.sections];
  }

  public getSectionById(id: string): SchoolClassSection | undefined {
    return this.data.sections.find(s => s.id === id);
  }

  public addSection(section: Omit<SchoolClassSection, 'id' | 'studentIds'>): SchoolClassSection {
    const newSection: SchoolClassSection = {
      ...section,
      id: `sec-${Date.now().toString().slice(-6)}`,
      studentIds: [],
    };
    this.data.sections.push(newSection);
    this.persist(this.data);
    return newSection;
  }

  public updateSection(id: string, updates: Partial<SchoolClassSection>): boolean {
    const sec = this.data.sections.find(s => s.id === id);
    if (!sec) return false;
    Object.assign(sec, updates);
    this.persist(this.data);
    return true;
  }

  public deleteSection(id: string): boolean {
    const prev = this.data.sections.length;
    this.data.sections = this.data.sections.filter(s => s.id !== id);
    if (this.data.sections.length !== prev) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public addStudentToSection(sectionId: string, studentId: string): boolean {
    const sec = this.data.sections.find(s => s.id === sectionId);
    const stud = this.data.students.find(s => s.id === studentId);
    if (!sec || !stud) return false;

    // Remove from other sections first if already assigned
    this.data.sections.forEach(s => {
      s.studentIds = s.studentIds.filter(id => id !== studentId);
    });

    if (!sec.studentIds.includes(studentId)) {
      sec.studentIds.push(studentId);
    }

    // Sync student's section, gradeLevel, track, strand, adviser
    stud.section = sec.sectionName;
    stud.gradeLevel = sec.gradeLevel;
    stud.track = sec.track;
    stud.strand = sec.strand;
    stud.adviserId = sec.adviserId;
    stud.adviserName = sec.adviserName;

    this.persist(this.data);
    return true;
  }

  public removeStudentFromSection(sectionId: string, studentId: string): boolean {
    const sec = this.data.sections.find(s => s.id === sectionId);
    if (!sec) return false;
    sec.studentIds = sec.studentIds.filter(id => id !== studentId);
    const stud = this.data.students.find(s => s.id === studentId);
    if (stud && stud.section === sec.sectionName) {
      stud.section = 'Unassigned';
    }
    this.persist(this.data);
    return true;
  }

  public createAndAssignStudent(
    sectionId: string, 
    data: {
      firstName: string;
      lastName: string;
      middleName?: string;
      gender: 'Male' | 'Female';
      lrn?: string;
      guardianName?: string;
      contactNumber?: string;
    }
  ): StudentProfile | null {
    const sec = this.data.sections.find(s => s.id === sectionId);
    if (!sec) return null;

    const newLrn = data.lrn?.trim() || `10982345${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: StudentProfile = {
      id: `stud-${Date.now().toString().slice(-5)}`,
      lrn: newLrn,
      firstName: data.firstName.trim(),
      middleName: data.middleName?.trim() || '',
      lastName: data.lastName.trim(),
      gender: data.gender,
      birthDate: '2010-01-01',
      age: 12 + (sec.gradeLevel - 7),
      barangay: 'Barangay Poblacion 38',
      municipality: 'Infanta',
      province: 'Quezon',
      contactNumber: data.contactNumber || '0917-000-0000',
      guardianName: data.guardianName || 'Guardian',
      guardianRelationship: 'Parent/Guardian',
      guardianContact: data.contactNumber || '0917-000-0000',
      gradeLevel: sec.gradeLevel,
      section: sec.sectionName,
      track: sec.track,
      strand: sec.strand,
      adviserId: sec.adviserId,
      adviserName: sec.adviserName,
      schoolYear: sec.schoolYear,
      enrollmentStatus: 'Enrolled',
      grades: [],
      generalAverage: null,
      honors: null,
      attendance: DEFAULT_ATTENDANCE,
      coreValues: DEFAULT_CORE_VALUES,
      adviserRemarks: `Enrolled in ${sec.sectionName}.`,
    };

    this.data.students.push(newStudent);
    if (!sec.studentIds.includes(newStudent.id)) {
      sec.studentIds.push(newStudent.id);
    }
    this.persist(this.data);
    return newStudent;
  }

  // --- Maintenance & Backup ---
  public resetToDefault(): void {
    this.data = {
      students: INITIAL_STUDENTS,
      teachers: INITIAL_TEACHERS,
      enrollmentApplications: INITIAL_APPLICATIONS,
      updates: INITIAL_UPDATES,
      activities: INITIAL_ACTIVITIES,
      accounts: INITIAL_ACCOUNTS,
      sections: INITIAL_SECTIONS,
      curriculumSubjects: INITIAL_CURRICULUM_SUBJECTS,
    };
    this.persist(this.data);
  }

  public exportDatabaseJson(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importDatabaseJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.students && Array.isArray(parsed.students)) {
        this.data = parsed;
        this.persist(this.data);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse imported database JSON', e);
    }
    return false;
  }
}

export const schoolDb = new SchoolDatabaseService();
