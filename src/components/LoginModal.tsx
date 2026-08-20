import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { X, Key, UserCheck, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  userHandle: string;
  isLoggedIn: boolean;
  onClose: () => void;
  onLogin: (handle: string) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  theme,
  userHandle,
  isLoggedIn,
  onClose,
  onLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const [handleInput, setHandleInput] = useState(userHandle === 'GUEST_CHEF' ? '' : userHandle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleInput.trim()) {
      onLogin(handleInput.trim().toUpperCase());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-md border p-6 md:p-8 font-mono ${
          isDark
            ? 'bg-[#050b14] border-[#1e3a8a] text-white'
            : 'bg-[#fcf9f8] border-[#001255] text-[#1b1c1c] brutalist-shadow'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-6 border-current">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold uppercase font-heading tracking-tight">
              DIRECT DATA ACCESS KEY
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 border ${
              isDark ? 'border-[#1e3a8a] text-white' : 'border-[#001255] text-[#001255]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border border-green-600/40 bg-green-500/10">
              <UserCheck className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <div className="text-xs uppercase font-bold text-green-600 dark:text-green-400">
                  AUTHENTICATED AS
                </div>
                <div className="text-sm font-bold font-mono">{userHandle}</div>
              </div>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              Your recipes and saved cards are directly synchronized with your local workspace index.
            </p>

            <div className="flex gap-3 pt-4 border-t border-current/20">
              <button
                type="button"
                onClick={onLogout}
                className="w-1/2 py-2 text-xs font-bold uppercase border border-red-600 text-red-600 hover:bg-red-500/10"
              >
                DISCONNECT
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`w-1/2 py-2 text-xs font-bold uppercase ${
                  isDark ? 'bg-[#1e3a8a] text-white' : 'bg-[#001255] text-white'
                }`}
              >
                DONE
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs opacity-80 leading-relaxed">
              Enter your cook handle or key ID to personalize your card box index. No passwords, no marketing trackers.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 opacity-90">
                COOK HANDLE / IDENTIFIER
              </label>
              <input
                type="text"
                required
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="e.g. CHEF_001, GORDON_R, DATA_EATER"
                className={`w-full p-2.5 font-mono text-xs border uppercase tracking-wider ${
                  isDark
                    ? 'bg-[#030712] border-[#1e3a8a] text-white focus:border-[#3b82f6]'
                    : 'bg-white border-[#001255] text-[#001255] focus:border-[#001255]'
                }`}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs uppercase border border-current/40 hover:bg-black/5"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-xs font-bold uppercase ${
                  isDark ? 'bg-[#1e3a8a] text-white' : 'bg-[#001255] text-white'
                }`}
              >
                SET HANDLE
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
