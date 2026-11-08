import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  Send, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  GraduationCap,
  Calendar,
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { schoolDb } from '../../services/schoolDatabase';
import { GradeLevel, StrandType, EnrollmentApplication } from '../../types/school';

interface EnrollmentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'enroll' | 'status' | 'guidelines';
}

export const EnrollmentPortalModal: React.FC<EnrollmentPortalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'enroll',
}) => {
  const [activeTab, setActiveTab] = useState<'enroll' | 'status' | 'guidelines'>(initialTab);

  // Form states
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
  const [guardianRelationship, setGuardianRelationship] = useState('Mother');
  const [guardianContact, setGuardianContact] = useState('');
  const [docPsa, setDocPsa] = useState(true);
  const [docSf9, setDocSf9] = useState(true);
  const [docGoodMoral, setDocGoodMoral] = useState(true);
  const [docPhotos, setDocPhotos] = useState(true);

  // Submission state
  const [submittedApp, setSubmittedApp] = useState<EnrollmentApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedApp, setSearchedApp] = useState<EnrollmentApplication | null | 'not_found'>(null);

  if (!isOpen) return null;

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !contactNumber.trim() || !guardianName.trim()) {
      alert('Please fill out all required student and guardian information.');
      return;
    }

    setIsSubmitting(true);

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
      notes: 'Submitted via INHS Dedicated Online Enrollment Portal'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedApp(created);
    }, 400);
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

  const handleResetForm = () => {
    setSubmittedApp(null);
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setExtensionName('');
    setLrn('');
    setEmail('');
    setContactNumber('');
    setPreviousSchool('');
    setGuardianName('');
    setGuardianContact('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-5xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Portal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-5 py-4 border-b border-blue-900/50 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20">
              <img
                src="/assets/images/logo_cropped.png"
                alt="INHS Crest"
                className="w-10 h-10 object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300">
                  Department of Education • Region IV-A CALABARZON
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-mono">
                  S.Y. 2026–2027
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-crest tracking-tight text-white flex items-center gap-2">
                <span>INHS Online Enrollment Portal</span>
                <span className="hidden sm:inline-block text-xs font-normal text-blue-200">
                  (School ID: 301332)
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nav Tabs inside header */}
            <div className="hidden md:flex items-center bg-blue-950/80 p-1 rounded-xl border border-blue-800/60 text-xs">
              <button
                onClick={() => { setActiveTab('enroll'); setSubmittedApp(null); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'enroll'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Enrollment Form</span>
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'status'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-amber-300" />
                <span>Track Status</span>
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'guidelines'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>Guidelines</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Online Enrollment Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-b border-slate-200 bg-slate-100 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('enroll'); setSubmittedApp(null); }}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 cursor-pointer ${
              activeTab === 'enroll'
                ? 'border-blue-900 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Enrollment Form
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 cursor-pointer ${
              activeTab === 'status'
                ? 'border-blue-900 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'border-blue-900 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600'
            }`}
          >
            Guidelines
          </button>
        </div>

        {/* Portal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
          
          {/* ========================================================= */}
          {/* TAB 1: ONLINE ENROLLMENT FORM */}
          {/* ========================================================= */}
          {activeTab === 'enroll' && (
            submittedApp ? (
              /* Success Confirmation Slip */
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-6 animate-scale-up">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    DepEd Basic Education Enrollment Form
                  </span>
                  <h3 className="text-2xl font-extrabold font-crest text-slate-900">
                    Mabuhay! Your Enrollment Has Been Received
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your application for School Year 2026–2027 is now queued in the Registrar's validation system. Please save your reference code below.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 uppercase">Application Reference Code:</span>
                    <strong className="text-blue-900 text-base">{submittedApp.id}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Learner Name:</span>
                    <strong className="text-slate-800">
                      {submittedApp.lastName}, {submittedApp.firstName} {submittedApp.middleName || ''}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Classification:</span>
                    <strong className="text-slate-800">{submittedApp.applicationType}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Target Grade & Program:</span>
                    <strong className="text-slate-800">Grade {submittedApp.targetGrade} · {submittedApp.targetStrand}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-sans text-[11px]">
                      {submittedApp.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Next Steps for Enrollment Confirmation:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    <li>Present original hardcopies of PSA Birth Certificate and SF9 report card during in-person validation.</li>
                    <li>For STE applicants: Check examination schedule on the Campus Bulletin.</li>
                    <li>Track updates anytime using the "Track Status" tab in this portal.</li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2 no-print">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Confirmation Slip</span>
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm transition-colors"
                  >
                    Submit Another Enrollment
                  </button>
                </div>
              </div>
            ) : (
              /* The Comprehensive DepEd Form */
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* BEEF Compliance Banner */}
                <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-amber-300 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                        DepEd Order No. 03, s. 2018 Basic Education Enrollment Policy
                      </span>
                      <p className="text-slate-200 text-[11px] mt-0.5">
                        Free High School Basic Education: <strong>NO ENTRANCE FEES OR MANDATORY CONTRIBUTIONS</strong>. All eligible learners are accommodated.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded font-mono font-bold shrink-0">
                    S.Y. 2026–2027
                  </span>
                </div>

                <form onSubmit={handleEnrollmentSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                  
                  {/* Step 1: Classification */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">1</span>
                      <h4 className="text-base font-bold text-slate-900">Enrollment Classification & Target Program</h4>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Learner Classification *</label>
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
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          <option value="Grade 7 (Incoming JHS)">Grade 7 (Incoming JHS)</option>
                          <option value="Grade 11 (Incoming SHS)">Grade 11 (Incoming SHS)</option>
                          <option value="Transferee">Transferee from another school</option>
                          <option value="Balik-Aral">Balik-Aral (Returning Learner)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Grade Level *</label>
                        <select
                          value={targetGrade}
                          onChange={(e) => setTargetGrade(Number(e.target.value) as GradeLevel)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Program / Academic Strand *</label>
                        <select
                          value={targetStrand}
                          onChange={(e) => setTargetStrand(e.target.value as StrandType)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                        >
                          {targetGrade <= 10 ? (
                            <>
                              <option value="Regular JHS">Regular JHS Curriculum</option>
                              <option value="Special Science Program (STE)">Special Science Program (STE)</option>
                            </>
                          ) : (
                            <>
                              <option value="STEM">Academic: STEM (Science & Math)</option>
                              <option value="ABM">Academic: ABM (Accountancy & Business)</option>
                              <option value="HUMSS">Academic: HUMSS (Humanities & Social)</option>
                              <option value="TVL - ICT (Computer Systems)">TVL: ICT (Computer Systems Servicing)</option>
                              <option value="TVL - Home Economics">TVL: Home Economics (Bread & Pastry)</option>
                              <option value="TVL - Electrical Installation and Maintenance (EIM)">TVL: EIM (Electrical Installation)</option>
                              <option value="TVL - Electronic Products Assembly and Servicing (EPAS)">TVL: EPAS (Electronics)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Learner Demographics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">2</span>
                      <h4 className="text-base font-bold text-slate-900">Learner Personal Information</h4>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Dela Cruz"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Juan"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Middle Name</label>
                        <input
                          type="text"
                          value={middleName}
                          onChange={(e) => setMiddleName(e.target.value)}
                          placeholder="e.g. Santos"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Extension (Jr., III)</label>
                        <input
                          type="text"
                          value={extensionName}
                          onChange={(e) => setExtensionName(e.target.value)}
                          placeholder="Optional"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          12-digit LRN (Learner Ref. No.)
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          value={lrn}
                          onChange={(e) => setLrn(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 109823450012"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono focus:border-blue-900 focus:outline-hidden"
                        />
                        <span className="text-[10px] text-slate-400">Leave blank if no LRN yet</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Birth Date (PSA) *</label>
                        <input
                          type="date"
                          required
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Learner Contact Number *</label>
                        <input
                          type="tel"
                          required
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="e.g. 0917-123-4567"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Learner Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. juan.delacruz@gmail.com"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Barangay *</label>
                        <select
                          value={addressBarangay}
                          onChange={(e) => setAddressBarangay(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Barangay Poblacion 38">Barangay Poblacion 38</option>
                          <option value="Barangay Poblacion 39">Barangay Poblacion 39</option>
                          <option value="Barangay Poblacion 1">Barangay Poblacion 1</option>
                          <option value="Barangay Banugao">Barangay Banugao</option>
                          <option value="Barangay Antikin">Barangay Antikin</option>
                          <option value="Barangay Catambungan">Barangay Catambungan</option>
                          <option value="Barangay Comon">Barangay Comon</option>
                          <option value="Barangay Dinahican">Barangay Dinahican</option>
                          <option value="Barangay Libjo">Barangay Libjo</option>
                          <option value="Barangay Miswa">Barangay Miswa</option>
                          <option value="Barangay Pilaway">Barangay Pilaway</option>
                          <option value="Barangay Tongohin">Barangay Tongohin</option>
                          <option value="Other Quezon Municipality">Other Quezon Municipality</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: School History & Family */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">3</span>
                      <h4 className="text-base font-bold text-slate-900">Previous School & Parent / Guardian Details</h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Previous School Attended *
                        </label>
                        <input
                          type="text"
                          required
                          value={previousSchool}
                          onChange={(e) => setPreviousSchool(e.target.value)}
                          placeholder="e.g. Infanta Central Elementary School"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Parent / Legal Guardian Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="e.g. Maria Santos Dela Cruz"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Relationship to Learner *
                        </label>
                        <select
                          value={guardianRelationship}
                          onChange={(e) => setGuardianRelationship(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Legal Guardian">Legal Guardian</option>
                          <option value="Aunt / Uncle">Aunt / Uncle</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Guardian Emergency Contact Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={guardianContact}
                          onChange={(e) => setGuardianContact(e.target.value)}
                          placeholder="e.g. 0918-987-6543"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Documentary Checklist */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">4</span>
                      <h4 className="text-base font-bold text-slate-900">Required Documentary Checklist (Hardcopies to Present)</h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={docPsa}
                          onChange={(e) => setDocPsa(e.target.checked)}
                          className="w-4 h-4 text-blue-900 rounded"
                        />
                        <span className="font-medium text-slate-800">PSA / NSO Birth Certificate (Original + Photocopy)</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={docSf9}
                          onChange={(e) => setDocSf9(e.target.checked)}
                          className="w-4 h-4 text-blue-900 rounded"
                        />
                        <span className="font-medium text-slate-800">DepEd Form 138 / SF9 (Official Report Card)</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={docGoodMoral}
                          onChange={(e) => setDocGoodMoral(e.target.checked)}
                          className="w-4 h-4 text-blue-900 rounded"
                        />
                        <span className="font-medium text-slate-800">Certificate of Good Moral Character</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={docPhotos}
                          onChange={(e) => setDocPhotos(e.target.checked)}
                          className="w-4 h-4 text-blue-900 rounded"
                        />
                        <span className="font-medium text-slate-800">4 Copies of 2x2 Formal ID Photos (White Background)</span>
                      </label>
                    </div>
                  </div>

                  {/* Submission Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      * By submitting, you certify that all information declared is true and correct under oath.
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>{isSubmitting ? 'Submitting Application...' : 'Submit Official Enrollment Application'}</span>
                    </button>
                  </div>

                </form>
              </div>
            )
          )}

          {/* ========================================================= */}
          {/* TAB 2: APPLICATION STATUS TRACKER */}
          {/* ========================================================= */}
          {activeTab === 'status' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold font-crest text-slate-900">
                    Track Enrollment Application Status
                  </h4>
                  <p className="text-xs text-slate-500">
                    Enter your Application Reference Code (e.g. <strong className="font-mono">app-2026-001</strong>), LRN, or Learner Full Name.
                  </p>
                </div>

                <form onSubmit={handleStatusSearch} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Reference Code or Student Name..."
                    className="flex-1 p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm transition-colors"
                  >
                    Track Status
                  </button>
                </form>
              </div>

              {searchedApp === 'not_found' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>No matching enrollment application was found for "{searchQuery}". Please verify your reference code or contact the Registrar.</span>
                </div>
              )}

              {searchedApp && searchedApp !== 'not_found' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4 animate-scale-up">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Reference Code</span>
                      <div className="text-base font-bold font-mono text-blue-900">{searchedApp.id}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      searchedApp.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : searchedApp.status === 'Requires Verification'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {searchedApp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Learner Name:</span>
                      <div className="font-bold text-slate-900">
                        {searchedApp.lastName}, {searchedApp.firstName} {searchedApp.middleName || ''}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Target Level:</span>
                      <div className="font-bold text-slate-900">
                        Grade {searchedApp.targetGrade} · {searchedApp.targetStrand}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Submission Date:</span>
                      <div className="font-bold text-slate-700 font-mono">{searchedApp.submissionDate}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Assigned Section:</span>
                      <div className="font-bold text-blue-900">{searchedApp.assignedSection || 'Pending Final Evaluation'}</div>
                    </div>
                  </div>

                  {searchedApp.notes && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                      <strong>Registrar Notes:</strong> {searchedApp.notes}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: GUIDELINES & STE SCREENING */}
          {/* ========================================================= */}
          {activeTab === 'guidelines' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Admission Guidelines & Qualifying Screening
                    </h4>
                    <span className="text-xs text-slate-500">Infanta National High School • S.Y. 2026–2027</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Incoming Grade 7 (Junior High)</h5>
                    <p>Elementary school completers from public and private elementary schools are eligible. Must submit Form 138 (Elementary Report Card) with a passing general average.</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Special Science Program (STE)</h5>
                    <p>Applicants for the Special Science Program must have a general average of at least 85% in Science, Mathematics, and English, with no grade lower than 83% in any subject. Must pass the written qualifying exam and oral interview.</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-sm mb-1">Incoming Grade 11 (Senior High)</h5>
                    <p>Open to Grade 10 completers and PEPT / ALS qualifiers. Students can choose from Academic (STEM, ABM, HUMSS) and TVL (ICT, Home Economics, Electrical EIM, EPAS). Qualified public JHS completers receive 100% free tuition and voucher assistance.</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-950">
                    <strong className="block text-xs uppercase tracking-wider mb-1">Office of the School Registrar</strong>
                    <p className="text-[11px]">
                      For physical inquiries, visit the Registrar's Window at the Administration Building, Infanta NHS Campus, Monday to Friday, 8:00 AM – 4:00 PM.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('enroll')}
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
                  >
                    <span>Proceed to Online Enrollment Form</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
