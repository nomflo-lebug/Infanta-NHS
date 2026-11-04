import React, { useState } from 'react';
import { 
  FileCheck2, 
  Send, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  HelpCircle,
  Download,
  Check,
  ShieldCheck
} from 'lucide-react';
import { schoolDb } from '../services/schoolDatabase';
import { GradeLevel, StrandType, EnrollmentApplication } from '../types/school';

interface AdmissionsSectionProps {
  onOpenPortal: (role?: 'student_parent' | 'teacher' | 'admin') => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({ onOpenPortal }) => {
  const [activeTab, setActiveTab] = useState<'enroll' | 'status' | 'requirements'>('enroll');

  // Enrollment Form State
  const [appType, setAppType] = useState<EnrollmentApplication['applicationType']>('Grade 7 (Incoming JHS)');
  const [lrn, setLrn] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [extensionName, setExtensionName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [birthDate, setBirthDate] = useState('2013-05-12');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [addressBarangay, setAddressBarangay] = useState('Barangay Poblacion 38');
  const [previousSchool, setPreviousSchool] = useState('');
  const [targetGrade, setTargetGrade] = useState<GradeLevel>(7);
  const [targetStrand, setTargetStrand] = useState<StrandType>('Regular JHS');
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [docPsa, setDocPsa] = useState(true);
  const [docSf9, setDocSf9] = useState(true);
  const [docGoodMoral, setDocGoodMoral] = useState(true);
  const [docPhotos, setDocPhotos] = useState(true);

  // Form Submission Result
  const [submittedApp, setSubmittedApp] = useState<EnrollmentApplication | null>(null);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedApp, setSearchedApp] = useState<EnrollmentApplication | null | 'not_found'>(null);

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !contactNumber || !guardianName) {
      alert('Please fill out all required student and guardian information.');
      return;
    }

    const docs: string[] = [];
    if (docPsa) docs.push('PSA Birth Certificate');
    if (docSf9) docs.push('Form 138 / SF9 Report Card');
    if (docGoodMoral) docs.push('Certificate of Good Moral Character');
    if (docPhotos) docs.push('2x2 Formal ID Photos');

    const created = schoolDb.submitEnrollmentApplication({
      applicationType: appType,
      lrn: lrn.trim() ? lrn.trim() : undefined,
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      extensionName: extensionName.trim() || undefined,
      gender,
      birthDate,
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      addressBarangay: `${addressBarangay}, Infanta, Quezon`,
      previousSchool: previousSchool.trim() || 'Not specified',
      targetGrade,
      targetStrand,
      guardianName: guardianName.trim(),
      guardianContact: guardianContact.trim(),
      documentsSubmitted: docs,
      notes: 'Submitted via INHS Online Enrollment Portal'
    });

    setSubmittedApp(created);
  };

  const handleStatusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const allApps = schoolDb.getEnrollmentApplications();
    const found = allApps.find(a => 
      a.id.toLowerCase() === query || 
      (a.lrn && a.lrn.toLowerCase() === query) ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(query)
    );

    setSearchedApp(found || 'not_found');
  };

  return (
    <section id="admissions" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
            Admissions & Enrollment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Join the Infanta NHS Scholastic Community
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            We welcome elementary graduates, junior high completers, and transferees to enroll for School Year 2026–2027. Fast-track your registration online or check the status of your submitted application.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 mb-8 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('enroll')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'enroll'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Online Enrollment Form (DepEd BEEG)
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'status'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Check Application Status
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'requirements'
                ? 'text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Admission Requirements & Schedules
          </button>
        </div>

        {/* Tab 1: Online Enrollment Form */}
        {activeTab === 'enroll' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            {submittedApp ? (
              <div className="max-w-2xl mx-auto text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Application Submitted</span>
                  <h3 className="text-2xl font-bold font-crest text-slate-900">
                    Mabuhay! Your Enrollment Has Been Received
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your application for <strong>{submittedApp.firstName} {submittedApp.lastName}</strong> has been logged into the INHS database. Please take note of your Application Reference Number.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-left space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Application ID:</span>
                    <strong className="font-mono text-blue-900">{submittedApp.id}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Target Level:</span>
                    <strong className="text-slate-800">Grade {submittedApp.targetGrade} · {submittedApp.targetStrand}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-amber-700">{submittedApp.status}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Date:</span>
                    <span className="text-slate-700 font-mono-num">{submittedApp.submissionDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      // Clear form
                      setFirstName('');
                      setLastName('');
                      setEmail('');
                      setContactNumber('');
                      setGuardianName('');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Enroll Another Student
                  </button>

                  <button
                    onClick={() => {
                      setSearchQuery(submittedApp.id);
                      setSearchedApp(submittedApp);
                      setActiveTab('status');
                    }}
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Track This Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollmentSubmit} className="space-y-8">
                {/* Notice */}
                <div className="p-4 bg-blue-50/80 rounded-lg border border-blue-200/60 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-950 leading-relaxed">
                    <strong>DepEd Basic Education Enrollment Form (BEEF) Compliance:</strong> In accordance with DepEd Order No. 03, s. 2018. All public high school basic education is 100% free with <strong>NO ENTRANCE FEES OR MANDATORY COLLECTIONS</strong>.
                  </div>
                </div>

                {/* Classification */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                    1. Enrollment Classification & Target Program
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Application Type *</label>
                      <select
                        value={appType}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setAppType(val);
                          if (val.includes('Grade 7')) {
                            setTargetGrade(7);
                            setTargetStrand('Regular JHS');
                          } else if (val.includes('Grade 11')) {
                            setTargetGrade(11);
                            setTargetStrand('STEM');
                          }
                        }}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-900 focus:outline-hidden"
                      >
                        <option value="Grade 7 (Incoming JHS)">Grade 7 (Incoming Junior High)</option>
                        <option value="Grade 11 (Incoming SHS)">Grade 11 (Incoming Senior High)</option>
                        <option value="Transferee">Transferee from other school</option>
                        <option value="Balik-Aral">Balik-Aral / Returning Learner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Target Grade Level *</label>
                      <select
                        value={targetGrade}
                        onChange={(e) => setTargetGrade(Number(e.target.value) as GradeLevel)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-900 focus:outline-hidden"
                      >
                        <option value={7}>Grade 7</option>
                        <option value={8}>Grade 8</option>
                        <option value={9}>Grade 9</option>
                        <option value={10}>Grade 10</option>
                        <option value={11}>Grade 11</option>
                        <option value={12}>Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Curricular Program / Strand *</label>
                      <select
                        value={targetStrand}
                        onChange={(e) => setTargetStrand(e.target.value as StrandType)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-900 focus:outline-hidden"
                      >
                        {targetGrade <= 10 ? (
                          <>
                            <option value="Regular JHS">Regular Junior High School Curriculum</option>
                            <option value="Special Science Program (STE)">Special Program in Science, Tech & Eng. (STE)</option>
                          </>
                        ) : (
                          <>
                            <option value="STEM">Academic: STEM (Science, Tech, Eng, Math)</option>
                            <option value="ABM">Academic: ABM (Accountancy, Business, Mgmt)</option>
                            <option value="HUMSS">Academic: HUMSS (Humanities & Social Sciences)</option>
                            <option value="TVL - ICT (Computer Systems)">TVL: ICT (Computer Systems Servicing NC II)</option>
                            <option value="TVL - Home Economics">TVL: Home Economics (Bread & Pastry, Cookery)</option>
                            <option value="TVL - Electrical Installation and Maintenance (EIM)">TVL: Electrical Installation & Maintenance (EIM NC II)</option>
                            <option value="TVL - Electronic Products Assembly and Servicing (EPAS)">TVL: Electronic Products Assembly & Servicing (EPAS NC II)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Student Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                    2. Learner Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maria Clara"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Reyes"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Santos"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Name Extension (if any)</label>
                      <input
                        type="text"
                        placeholder="e.g. Jr., III"
                        value={extensionName}
                        onChange={(e) => setExtensionName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">12-Digit LRN (if already assigned)</label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="e.g. 109823450012"
                        value={lrn}
                        onChange={(e) => setLrn(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono-num focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Gender / Sex *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-900 focus:outline-hidden"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Residence & Contact */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                    3. Residence & Contact Details
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Barangay (Infanta, Quezon) *</label>
                      <select
                        value={addressBarangay}
                        onChange={(e) => setAddressBarangay(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-900 focus:outline-hidden"
                      >
                        <option value="Barangay Poblacion 38">Barangay Poblacion 38 (Poblacion)</option>
                        <option value="Barangay Poblacion 39">Barangay Poblacion 39</option>
                        <option value="Barangay Dinahican">Barangay Dinahican</option>
                        <option value="Barangay Binulasan">Barangay Binulasan</option>
                        <option value="Barangay Tongohin">Barangay Tongohin</option>
                        <option value="Barangay Silangan">Barangay Silangan</option>
                        <option value="Barangay Banugao">Barangay Banugao</option>
                        <option value="Barangay Antikin">Barangay Antikin</option>
                        <option value="Barangay Comon">Barangay Comon</option>
                        <option value="Barangay Catambungan">Barangay Catambungan</option>
                        <option value="Barangay Pilaway">Barangay Pilaway</option>
                        <option value="Real or General Nakar Resident">Neighboring Town (Real / Gen. Nakar / Polillo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Learner / Parent Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0917-000-0000"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Parent / Guardian Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Florencia Santos"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Guardian Emergency Contact *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0919-000-0000"
                        value={guardianContact}
                        onChange={(e) => setGuardianContact(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Previous School Attended</label>
                      <input
                        type="text"
                        placeholder="e.g. Infanta Central Elementary"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Readiness Checklist */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                    4. Credential Verification Checklist
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docPsa}
                        onChange={(e) => setDocPsa(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-0"
                      />
                      <span>PSA Birth Certificate (Original & Photocopy)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSf9}
                        onChange={(e) => setDocSf9(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-0"
                      />
                      <span>Form 138 / SF9 Report Card (Eligible for Admission)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docGoodMoral}
                        onChange={(e) => setDocGoodMoral(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-0"
                      />
                      <span>Certificate of Good Moral Character</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docPhotos}
                        onChange={(e) => setDocPhotos(e.target.checked)}
                        className="rounded text-blue-900 focus:ring-0"
                      />
                      <span>2 pieces 2x2 colored photos with white background & name tag</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    * Required fields for DepEd enrollment encoding.
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Official Enrollment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Check Application Status */}
        {activeTab === 'status' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="max-w-xl mx-auto text-center space-y-2">
              <h3 className="text-xl font-bold font-crest text-slate-900">
                Enrollment Application Status Tracker
              </h3>
              <p className="text-xs text-slate-600">
                Enter your Application Reference ID (e.g. <span className="font-mono text-blue-900">app-2026-001</span>), LRN, or Student Name to check validation progress.
              </p>
            </div>

            <form onSubmit={handleStatusSearch} className="max-w-lg mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Enter Application ID, LRN, or Full Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Quick Demo Pre-fill Pills */}
            <div className="max-w-lg mx-auto flex flex-wrap items-center gap-2 text-xs text-slate-500 justify-center">
              <span>Try example applications:</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('app-2026-001'); setSearchAppDirect('app-2026-001'); }} 
                className="text-blue-900 underline hover:text-blue-700 cursor-pointer"
              >
                app-2026-001 (Samantha Mercado)
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => { setSearchQuery('app-2026-002'); setSearchAppDirect('app-2026-002'); }} 
                className="text-blue-900 underline hover:text-blue-700 cursor-pointer"
              >
                app-2026-002 (Gabriel Austria)
              </button>
            </div>

            {searchedApp === 'not_found' && (
              <div className="max-w-md mx-auto p-4 bg-amber-50 border border-amber-200 rounded-lg text-center space-y-1">
                <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
                <div className="text-xs font-semibold text-amber-900">No application record found</div>
                <div className="text-xs text-amber-700">Please verify the application reference code or contact the INHS registrar.</div>
              </div>
            )}

            {searchedApp && searchedApp !== 'not_found' && (
              <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500">{searchedApp.id}</span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {searchedApp.firstName} {searchedApp.lastName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                      searchedApp.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : searchedApp.status === 'Requires Verification'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {searchedApp.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">Submitted: {searchedApp.submissionDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500">Program:</span>
                    <div className="font-semibold text-slate-900">Grade {searchedApp.targetGrade} · {searchedApp.targetStrand}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Section:</span>
                    <div className="font-semibold text-slate-900">{searchedApp.assignedSection || 'Pending sectioning'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Guardian:</span>
                    <div className="font-semibold text-slate-900">{searchedApp.guardianName} ({searchedApp.guardianContact})</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Address:</span>
                    <div className="font-semibold text-slate-900">{searchedApp.addressBarangay}</div>
                  </div>
                </div>

                {searchedApp.notes && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-blue-900">Registrar Remarks:</span>{' '}
                    <span className="text-slate-600">{searchedApp.notes}</span>
                  </div>
                )}

                {searchedApp.status === 'Approved' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div className="text-xs text-emerald-800">
                      <strong>Ready for Enrollment Slip:</strong> You may now access your Student Profile in the Portal!
                    </div>
                    <button
                      onClick={() => onOpenPortal('student_parent')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Open Portal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Requirements & Calendar */}
        {activeTab === 'requirements' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold font-crest text-slate-900 border-b border-slate-200 pb-2">
                Junior High School (Grade 7 & Transferees)
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Original Form 138 / SF9 Report Card</strong> with passing general average from elementary school.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>PSA Birth Certificate</strong> (1 clear original copy + 2 photocopies).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Certificate of Good Moral Character</strong> issued by elementary school principal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>2 pieces recent 2x2 ID photos</strong> with formal white background and name tag.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>For STE Applicants:</strong> Final Grade of at least 85% in Science, Mathematics, and English, plus passing score in STE Qualifying Exam.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold font-crest text-slate-900 border-b border-slate-200 pb-2">
                Senior High School (Grade 11 & Voucher Recipients)
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Grade 10 Junior High School Completion Certificate</strong> & SF9 Progress Report.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Official NCAE Result Sheet</strong> (National Career Assessment Examination).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>PSA Birth Certificate</strong> and 2x2 photos (white background).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>For STEM Strand:</strong> General average of at least 85% with no grade below 83% in JHS Science and Math.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>For TVL Track:</strong> Medical clearance slip ensuring physical fitness for workshop activities (EIM / EPAS / Cookery).</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </section>
  );

  function setSearchAppDirect(id: string) {
    const all = schoolDb.getEnrollmentApplications();
    const app = all.find(a => a.id === id);
    if (app) setSearchedApp(app);
  }
};
