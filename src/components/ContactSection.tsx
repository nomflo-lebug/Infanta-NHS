import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Building,
  HelpCircle
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Enrollment Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSent(true);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200 scroll-mt-48 sm:scroll-mt-52 lg:scroll-mt-56">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
            Contact Infanta National High School
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Have questions regarding admissions, Form 137 requests, graduation credentials, or teacher consultations? Our administrative office is ready to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Institutional Contact Info & Map Guide */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-5">
              <h3 className="text-base font-bold font-crest text-slate-900 border-b border-slate-200 pb-2">
                Official Directory & Office Hours
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">School Address:</strong>
                    <span>Purok 1, Barangay Poblacion 38, Infanta, Quezon 4336, Philippines</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Telephone / Mobile:</strong>
                    <span className="font-mono-num">(042) 535-2144 / +63 917 889 1240</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Official DepEd Email:</strong>
                    <span className="font-mono text-blue-900">301332@deped.gov.ph</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Registrar & Cashier Hours:</strong>
                    <span>Monday to Friday: 8:00 AM – 5:00 PM (No Noon Break Policy)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Supervising Division:</strong>
                    <span>SDO Quezon · DepEd Region IV-A CALABARZON</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Visual Location Map Mockup */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Campus Location Landmark</span>
                <span className="text-[11px] text-slate-500">Poblacion 38, Infanta</span>
              </div>

              {/* Map Illustration Box */}
              <div className="h-44 rounded-lg bg-blue-950 text-white p-4 relative flex flex-col justify-between overflow-hidden">
                <div className="text-[11px] text-amber-300 font-semibold tracking-wider uppercase">
                  Infanta, Quezon Pacific Coastway
                </div>

                <div className="space-y-1 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
                    <span className="text-xs font-bold text-white">Infanta National High School</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Accessible via F. Gurango Sr. Avenue, 5 mins from Infanta Town Plaza & Parish of the Divine Infant Jesus.
                  </div>
                </div>

                {/* Subtle map grid vector lines */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              <div className="text-[11px] text-slate-500">
                Visitors are requested to log with the School Security at Gate 1 and present a valid government or student ID.
              </div>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {isSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-crest text-slate-900">
                  Salamat! Your Message Has Been Sent
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Infanta National High School. Our registrar or guidance desk will review your message and reply via email or phone within 1 to 2 school days.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                    setName('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold font-crest text-slate-900">
                    Online Public Assistance Desk (PAD)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit public inquiries, record requests, or schedule guidance consultations.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flordeliza Santos"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Mobile / Phone Number</label>
                    <input
                      type="tel"
                      placeholder="0917-000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Inquiry Category *</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:border-blue-900 focus:outline-hidden"
                    >
                      <option value="Enrollment Inquiry">Enrollment & Admissions</option>
                      <option value="Form 137 / SF10 Request">Form 137 / SF10 Permanent Record Request</option>
                      <option value="Good Moral Certificate">Certificate of Good Moral Character</option>
                      <option value="Senior High Voucher Program">SHS Voucher Program & ESC Assistance</option>
                      <option value="Parent-Teacher Consultation">Parent-Teacher Conference Scheduling</option>
                      <option value="Other Concerns">General Community Concerns</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Message / Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details of your inquiry, including student's LRN and grade level if applicable..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-blue-900 focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500">
                  Data Privacy Note: Personal information collected is strictly governed by Republic Act 10173 (Data Privacy Act of 2012) and DepEd Citizen's Charter.
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Transmit Inquiry to Registrar</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
