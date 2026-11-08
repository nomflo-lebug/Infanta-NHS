import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { schoolDb } from './schoolDatabase';
import { SchoolClassSection, StudentProfile } from '../types/school';

// Target Google Drive Folder specified by user
export const TARGET_DRIVE_FOLDER_ID = '1CfXDtp4dlKby5QSBzVQEpC9V-ItfrkIP';
export const TARGET_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${TARGET_DRIVE_FOLDER_ID}`;

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace Drive scope (per-file least privilege access)
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (NEVER persisted to localStorage or sessionStorage per guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface DriveUploadResult {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  size?: string;
  createdTime?: string;
}

/**
 * Initialize Google Auth listener
 */
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

/**
 * Interactive Sign in with Google to request Drive permissions
 */
export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google OAuth authorization did not return an access token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current cached access token in memory
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Get current Firebase Auth user
 */
export const getCurrentGoogleUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Disconnect Google Drive session
 */
export const signOutGoogle = async (): Promise<void> => {
  await firebaseSignOut(auth);
  cachedAccessToken = null;
};

/**
 * Upload a file (JSON, TXT, CSV) to Google Drive using multipart upload
 */
export const uploadFileToGoogleDrive = async (
  fileName: string,
  mimeType: string,
  content: string | Blob,
  folderId: string = TARGET_DRIVE_FOLDER_ID
): Promise<DriveUploadResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required. Please connect your Google account first.');
  }

  const metadata = {
    name: fileName,
    parents: [folderId],
    description: 'Infanta National High School (School ID: 301332) official student records backup.',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const contentText = typeof content === 'string' ? content : await content.text();

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    contentText +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Drive upload error:', errText);
    throw new Error(`Google Drive API error (${response.status}): ${errText}`);
  }

  const result: DriveUploadResult = await response.json();
  return result;
};

/**
 * Full School Database Backup to Google Drive
 */
export const backupFullDatabaseToDrive = async (
  folderId: string = TARGET_DRIVE_FOLDER_ID
): Promise<{ jsonResult: DriveUploadResult; reportResult: DriveUploadResult }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required.');
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
  const timestamp = `${dateStr}_${timeStr}`;

  // 1. Raw JSON Database
  const jsonContent = schoolDb.exportDatabaseJson();
  const jsonFileName = `INHS_Database_Backup_${timestamp}.json`;

  const jsonResult = await uploadFileToGoogleDrive(
    jsonFileName,
    'application/json',
    jsonContent,
    folderId
  );

  // 2. Formatted Human-Readable DepEd Learner Summary Report
  const students = schoolDb.getStudents();
  const sections = schoolDb.getSections();
  const teachers = schoolDb.getTeachers();

  const reportText = `================================================================================
INFANTA NATIONAL HIGH SCHOOL (School ID: 301332)
Division of Quezon - Region IV-A CALABARZON
STUDENT RECORDS & ACADEMIC DATA BACKUP SUMMARY REPORT
Generated on: ${now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
Google Drive Backup Folder: ${TARGET_DRIVE_FOLDER_URL}
================================================================================

SUMMARY STATISTICS:
Total Enrolled Learners: ${students.length}
Total Active Class Sections: ${sections.length}
Total Registered Faculty & Advisers: ${teachers.length}
School Year: 2026-2027

--------------------------------------------------------------------------------
ENROLLED LEARNERS ROSTER:
--------------------------------------------------------------------------------
${students
  .map(
    (s, idx) =>
      `${(idx + 1).toString().padStart(3, ' ')}. [LRN: ${s.lrn}] ${s.lastName.toUpperCase()}, ${s.firstName} ${s.middleName || ''}
     Grade: ${s.gradeLevel} | Section: ${s.section} | Strand: ${s.strand}
     Adviser: ${s.adviserName}
     GPA: ${s.generalAverage ? s.generalAverage.toFixed(2) : 'N/A'} | Honors: ${s.honors || 'None'}
     Guardian: ${s.guardianName} (${s.guardianContact})
     Address: ${s.barangay || 'Infanta'}, ${s.municipality || 'Quezon'}
`
  )
  .join('\n')}

--------------------------------------------------------------------------------
CLASS SECTIONS INVENTORY:
--------------------------------------------------------------------------------
${sections
  .map(
    (sec, idx) =>
      `${idx + 1}. Grade ${sec.gradeLevel} - ${sec.sectionName}
   Track: ${sec.track} | Strand: ${sec.strand}
   Room: ${sec.roomNumber} | Assigned Adviser: ${sec.adviserName}
   Enrolled Learners: ${students.filter((st) => st.section === sec.sectionName).length} / ${sec.maxCapacity}
`
  )
  .join('\n')}

--------------------------------------------------------------------------------
FACULTY ROSTER:
--------------------------------------------------------------------------------
${teachers
  .map(
    (t, idx) =>
      `${idx + 1}. ${t.name} (${t.title}) - ${t.department} | Email: ${t.email}`
  )
  .join('\n')}

================================================================================
Official Infanta NHS DepEd Backup Archive
================================================================================
`;

  const reportFileName = `INHS_Learner_Roster_DepEd_Report_${timestamp}.txt`;
  const reportResult = await uploadFileToGoogleDrive(
    reportFileName,
    'text/plain',
    reportText,
    folderId
  );

  return { jsonResult, reportResult };
};

/**
 * Upload an official Section School Form 1 (DepEd SF1) to Drive
 */
export const backupSectionSF1ToDrive = async (
  section: SchoolClassSection,
  students: StudentProfile[],
  folderId: string = TARGET_DRIVE_FOLDER_ID
): Promise<DriveUploadResult> => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);

  const sf1Text = `================================================================================
DEPARTMENT OF EDUCATION - REGION IV-A CALABARZON
DIVISION OF QUEZON - DISTRICT OF INFANTA
INFANTA NATIONAL HIGH SCHOOL (School ID: 301332)
SCHOOL FORM 1 (SF1) SCHOOL REGISTER
School Year: 2026-2027

GRADE LEVEL: Grade ${section.gradeLevel}
SECTION: ${section.sectionName}
TRACK / STRAND: ${section.track} - ${section.strand}
ROOM DESIGNATION: ${section.roomNumber}
CLASS ADVISER: ${section.adviserName}
DATE GENERATED: ${now.toLocaleDateString()}
================================================================================

REGISTER OF OFFICIAL LEARNERS:
--------------------------------------------------------------------------------
${students
  .map(
    (s, idx) =>
      `[${(idx + 1).toString().padStart(2, '0')}] LRN: ${s.lrn}
Name: ${s.lastName.toUpperCase()}, ${s.firstName} ${s.middleName || ''} ${s.extensionName || ''}
Sex: ${s.gender} | Birthdate: ${s.birthDate} | Age: ${s.age}
Barangay: ${s.barangay || 'Infanta, Quezon'} | Contact: ${s.contactNumber}
Guardian: ${s.guardianName} (${s.guardianRelationship}) | Contact: ${s.guardianContact}
General Average: ${s.generalAverage ? s.generalAverage.toFixed(2) : 'In Progress'} | Honors: ${s.honors || 'None'}
Adviser Remarks: ${s.adviserRemarks || 'Officially Enrolled'}
--------------------------------------------------------------------------------`
  )
  .join('\n')}

TOTAL ENROLLED: ${students.length} Learners (Male: ${students.filter((s) => s.gender === 'Male').length}, Female: ${students.filter((s) => s.gender === 'Female').length})

Prepared & Certified Correct by:
${section.adviserName}
Class Adviser, Infanta National High School
`;

  const fileName = `SF1_School_Register_Grade_${section.gradeLevel}_${section.sectionName.replace(/\s+/g, '_')}_${dateStr}.txt`;

  return await uploadFileToGoogleDrive(fileName, 'text/plain', sf1Text, folderId);
};
