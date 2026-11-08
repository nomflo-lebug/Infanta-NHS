import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  FolderCheck, 
  Upload, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Lock, 
  LogOut,
  Sparkles,
  Database,
  Users
} from 'lucide-react';
import { 
  TARGET_DRIVE_FOLDER_ID, 
  TARGET_DRIVE_FOLDER_URL, 
  initGoogleAuth, 
  signInWithGoogle, 
  signOutGoogle, 
  backupFullDatabaseToDrive, 
  DriveUploadResult 
} from '../../services/googleDriveService';
import { User } from 'firebase/auth';

export const GoogleDriveBackupManager: React.FC = () => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);
  const [backupErrorMessage, setBackupErrorMessage] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<DriveUploadResult[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const unsub = initGoogleAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
    return () => unsub();
  }, []);

  const handleConnectGoogle = async () => {
    setBackupErrorMessage(null);
    setIsAuthenticating(true);
    try {
      const res = await signInWithGoogle();
      setGoogleUser(res.user);
      setBackupSuccessMessage(`Connected to Google Drive as ${res.user.displayName || res.user.email}`);
      setTimeout(() => setBackupSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setBackupErrorMessage(err.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    if (confirm('Disconnect Google Drive backup session?')) {
      await signOutGoogle();
      setGoogleUser(null);
      setBackupSuccessMessage('Disconnected from Google Drive.');
      setTimeout(() => setBackupSuccessMessage(null), 3000);
    }
  };

  const handleInitiateBackup = () => {
    if (!googleUser) {
      setBackupErrorMessage('Please connect your Google account first to authorize file uploads.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmBackup = async () => {
    setShowConfirmModal(false);
    setIsBackingUp(true);
    setBackupErrorMessage(null);
    setBackupSuccessMessage(null);

    try {
      const { jsonResult, reportResult } = await backupFullDatabaseToDrive(TARGET_DRIVE_FOLDER_ID);
      setRecentUploads(prev => [jsonResult, reportResult, ...prev]);
      setBackupSuccessMessage('Success! Complete student records and database have been backed up and organized in your Google Drive folder.');
    } catch (err: any) {
      console.error(err);
      setBackupErrorMessage(err.message || 'Failed to complete Google Drive backup.');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">Google Drive Cloud Backup & Sync</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Linked & Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Synchronize, archive, and organize student records, SF1 rosters, and database snapshots directly to your Google Drive folder.
            </p>
          </div>
        </div>

        {/* External Link to Folder */}
        <a
          href={TARGET_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Open Drive Folder</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </a>
      </div>

      {/* Feedback Alerts */}
      {backupSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{backupSuccessMessage}</span>
        </div>
      )}

      {backupErrorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{backupErrorMessage}</span>
        </div>
      )}

      {/* Target Folder Information Card */}
      <div className="p-4 bg-gradient-to-r from-blue-900/5 via-indigo-900/5 to-slate-50 rounded-xl border border-blue-200/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FolderCheck className="w-4 h-4 text-blue-900" />
            <span className="font-bold">Target Cloud Folder:</span>
            <span className="font-mono text-blue-950 font-semibold">{TARGET_DRIVE_FOLDER_ID}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Permission Scope: <strong>drive.file</strong> (Least Privilege)
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          All student profiles, quarterly report cards, and DepEd Form 1 (SF1) class rosters exported from this portal will be placed inside this folder, timestamped and organized.
        </p>

        {/* Google Authentication Control */}
        <div className="pt-2 border-t border-blue-100 flex flex-wrap items-center justify-between gap-3">
          {googleUser ? (
            <div className="flex items-center gap-3">
              {googleUser.photoURL ? (
                <img 
                  src={googleUser.photoURL} 
                  alt={googleUser.displayName || 'Google User'} 
                  className="w-8 h-8 rounded-full border border-slate-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-900 text-amber-300 font-bold flex items-center justify-center text-xs">
                  {googleUser.displayName?.slice(0, 1) || 'G'}
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{googleUser.displayName || 'Google Account Connected'}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 rounded">Active</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{googleUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Connect your Google account with permission to write files to your folder.</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {googleUser ? (
              <button
                onClick={handleDisconnectGoogle}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isAuthenticating}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}

            <button
              onClick={handleInitiateBackup}
              disabled={isBackingUp}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>Uploading to Drive...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Backup All Data to Drive Folder</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Uploaded Files History */}
      {recentUploads.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Recent Google Drive Uploads in this Session:</span>
            <span className="text-[11px] text-slate-500 font-normal">{recentUploads.length} files stored</span>
          </div>

          <div className="space-y-2">
            {recentUploads.map((file) => (
              <div 
                key={file.id} 
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-blue-900 shrink-0" />
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {file.id}</div>
                  </div>
                </div>

                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-blue-900 rounded font-semibold text-[11px] flex items-center gap-1 shrink-0"
                  >
                    <span>View in Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal (MANDATORY per Workspace Destructive/Mutating Guidelines) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-blue-900" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Confirm Cloud Backup to Google Drive</h4>
                <span className="text-xs text-slate-500">Infanta National High School Database Archive</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to backup all student records, DepEd SF1 registers, class sections, and enrollment applications to the linked Google Drive folder?
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 font-mono text-[11px]">
              <div><strong>Target Folder:</strong> {TARGET_DRIVE_FOLDER_ID}</div>
              <div><strong>Files Generated:</strong> Database JSON Archive & Learner Roster Summary Report</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBackup}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm"
              >
                Yes, Backup to Drive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
