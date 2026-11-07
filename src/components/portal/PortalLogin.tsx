import React, { useState } from 'react';
import { ShieldCheck, BookOpen, Lock, User, Eye, EyeOff, AlertCircle, KeyRound } from 'lucide-react';
import { schoolDb } from '../../services/schoolDatabase';
import { UserAccount, Role } from '../../types/school';

interface PortalLoginProps {
  targetRole: 'admin' | 'teacher';
  onSuccess: (user: UserAccount) => void;
  onSwitchRole?: (role: Role) => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  targetRole,
  onSuccess,
  onSwitchRole,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const user = schoolDb.authenticate(username, password);

      if (!user) {
        setErrorMessage('Invalid username or password. Please verify your DepEd credentials.');
        setLoading(false);
        return;
      }

      // Check role authorization
      if (targetRole === 'admin' && user.role !== 'admin') {
        setErrorMessage('Access denied. Administrator privileges are required for this console.');
        setLoading(false);
        return;
      }

      // Teacher or Admin can access teacher portal
      setLoading(false);
      onSuccess(user);
    }, 250);
  };

  const isAdmin = targetRole === 'admin';

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-6">
      
      {/* Icon & Title */}
      <div className="text-center space-y-2">
        <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-md ${
          isAdmin 
            ? 'bg-gradient-to-br from-blue-900 to-indigo-950 text-amber-300' 
            : 'bg-gradient-to-br from-emerald-800 to-teal-950 text-emerald-200'
        }`}>
          {isAdmin ? <ShieldCheck className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
        </div>
        <div>
          <span className={`text-[11px] font-bold tracking-wider uppercase ${
            isAdmin ? 'text-blue-900' : 'text-emerald-700'
          }`}>
            {isAdmin ? 'DepEd INHS Administrative Security' : 'Faculty Grade Encoding Console'}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold font-crest text-slate-900">
            {isAdmin ? 'Administrator Sign In' : 'Teacher Portal Sign In'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin 
              ? 'Authorized access for school governance, account administration, and section management.' 
              : 'Sign in with your DepEd faculty account to record quarterly grades and SF9 remarks.'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isAdmin ? "Enter administrator username" : "Enter faculty username"}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-hidden font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-hidden font-medium font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isAdmin
              ? 'bg-blue-900 hover:bg-blue-800 active:bg-blue-950'
              : 'bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : `Sign In to ${isAdmin ? 'Admin Console' : 'Faculty Console'}`}</span>
        </button>
      </form>

      {/* DepEd Security & Privacy Notice */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <div className="font-semibold text-slate-800">DepEd INHS Information System</div>
          <p className="text-slate-500 mt-0.5">
            Access to this portal is restricted to authorized personnel. In compliance with the Data Privacy Act of 2012 (RA 10173), all system sessions and grade encoding activities are protected.
          </p>
        </div>
      </div>

      {/* Switch Link */}
      <div className="pt-2 text-center text-xs text-slate-500">
        {isAdmin ? (
          <span>
            Are you a teacher recording quarterly grades?{' '}
            <button
              type="button"
              onClick={() => onSwitchRole?.('teacher')}
              className="text-blue-900 font-bold hover:underline cursor-pointer"
            >
              Go to Faculty Login
            </button>
          </span>
        ) : (
          <span>
            Need administrative access?{' '}
            <button
              type="button"
              onClick={() => onSwitchRole?.('admin')}
              className="text-blue-900 font-bold hover:underline cursor-pointer"
            >
              Sign in as Admin
            </button>
          </span>
        )}
      </div>

    </div>
  );
};
