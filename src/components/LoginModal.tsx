import React, { useState } from "react";
import { ThemeMode } from "../types";
import { ChefHat, X, UserCheck } from "lucide-react";
import { AuthSession } from "../api/auth";

interface LoginModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  userHandle: string;
  isLoggedIn: boolean;
  onClose: () => void;
  onLogin: (session: AuthSession) => void;
  onLoginWithPassword: (
    email: string,
    password: string,
  ) => Promise<AuthSession>;
  onSignup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<AuthSession>;
  onRequestPasswordReset: (email: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onUpdateAccount: (updates: {
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  theme,
  userHandle,
  isLoggedIn,
  onClose,
  onLogin,
  onLoginWithPassword,
  onSignup,
  onRequestPasswordReset,
  onDeleteAccount,
  onUpdateAccount,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountDisplayName, setAccountDisplayName] = useState(userHandle);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isForgotPassword) {
        await onRequestPasswordReset(emailInput.trim());
        setErrorMessage(null);
        setSuccessMessage(
          "If an account exists for that email, a reset link has been sent.",
        );
        return;
      }

      const session = isSignup
        ? await onSignup(
            emailInput.trim(),
            passwordInput,
            displayNameInput.trim(),
          )
        : await onLoginWithPassword(emailInput.trim(), passwordInput);
      onLogin(session);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Delete your account and all uploaded recipes permanently?",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await onDeleteAccount();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Account deletion failed",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAccountUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const displayNameChanged = accountDisplayName.trim() !== userHandle;
      const passwordChanged = Boolean(newPasswordInput);
      if (!displayNameChanged && !passwordChanged) {
        throw new Error("Make a change before saving your account.");
      }
      if (passwordChanged && newPasswordInput.length < 8) {
        throw new Error("New password must be at least 8 characters.");
      }
      await onUpdateAccount({
        ...(displayNameChanged
          ? { displayName: accountDisplayName.trim() }
          : {}),
        ...(passwordChanged
          ? {
              currentPassword: currentPasswordInput,
              newPassword: newPasswordInput,
            }
          : {}),
      });
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setIsEditingAccount(false);
      setSuccessMessage("Your account has been updated.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Account update failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="auth-modal"
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full max-w-md border p-6 md:p-8 font-mono ${
          isDark
            ? "bg-[#050b14] border-[#1e3a8a] text-white"
            : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c] brutalist-shadow"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-6 border-current">
          <div className="flex items-center gap-2">
            <span className="auth-modal-icon">
              <ChefHat className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold font-heading tracking-tight">
              {isLoggedIn
                ? "Your account"
                : isForgotPassword
                  ? "Reset your password"
                  : isSignup
                    ? "Create your account"
                    : "Welcome back"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 border ${
              isDark
                ? "border-[#1e3a8a] text-white"
                : "border-[#001255] text-[#001255]"
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
                  LOGGED IN AS
                </div>
                <div className="text-sm font-bold font-mono">{userHandle}</div>
              </div>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              Your uploaded and favorited recipes are saved automatically.
            </p>

            {isEditingAccount ? (
              <form
                onSubmit={handleAccountUpdate}
                className="account-edit-form"
              >
                <label>
                  DISPLAY NAME
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    value={accountDisplayName}
                    onChange={(event) =>
                      setAccountDisplayName(event.target.value)
                    }
                  />
                </label>
                <div className="account-password-fields">
                  <label>
                    CURRENT PASSWORD
                    <input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(event) =>
                        setCurrentPasswordInput(event.target.value)
                      }
                      placeholder="Only needed to change password"
                    />
                  </label>
                  <label>
                    NEW PASSWORD
                    <input
                      type="password"
                      minLength={8}
                      value={newPasswordInput}
                      onChange={(event) =>
                        setNewPasswordInput(event.target.value)
                      }
                      placeholder="Leave blank to keep it"
                    />
                  </label>
                </div>
                <div className="account-edit-actions">
                  <button
                    type="submit"
                    className="modern-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    className="modern-button secondary"
                    onClick={() => {
                      setIsEditingAccount(false);
                      setAccountDisplayName(userHandle);
                      setCurrentPasswordInput("");
                      setNewPasswordInput("");
                      setErrorMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="modern-button secondary account-edit-trigger"
                onClick={() => {
                  setAccountDisplayName(userHandle);
                  setIsEditingAccount(true);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
              >
                Edit account
              </button>
            )}

            {errorMessage && (
              <div className="border border-red-600 p-2 text-xs text-red-500">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-current/20">
              <button
                type="button"
                onClick={onLogout}
                className="flex-1 min-w-[120px] py-2 text-xs font-bold uppercase border border-red-600 text-red-600 hover:bg-red-500/10"
              >
                LOG OUT
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 min-w-[120px] py-2 text-xs font-bold uppercase border border-red-900 text-red-900 hover:bg-red-900/10 disabled:opacity-50"
              >
                {isDeleting ? "DELETING..." : "DELETE ACCOUNT"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 min-w-[120px] py-2 text-xs font-bold uppercase ${
                  isDark ? "bg-[#1e3a8a] text-white" : "bg-[#001255] text-white"
                }`}
              >
                DONE
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs opacity-80 leading-relaxed">
              {isForgotPassword
                ? "Enter your email and we will send a password reset link if an account exists."
                : isSignup
                  ? "Create an account to add favorites to your card box. Don't worry, we won't spam you. We just need your email to send you a password reset link if you forget it."
                  : "Log in to add favorites to your card box."}
            </p>

            {!isForgotPassword && isSignup && (
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-90">
                  DISPLAY NAME
                </label>
                <input
                  type="text"
                  required
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="e.g. Chef_001"
                  className={`w-full mb-3 p-2.5 font-mono text-xs border tracking-wider ${
                    isDark
                      ? "bg-[#030712] border-[#1e3a8a] text-white focus:border-[#3b82f6]"
                      : "bg-white border-[#001255] text-[#001255] focus:border-[#001255]"
                  }`}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 opacity-90">
                EMAIL
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="chef@example.com"
                className={`w-full p-2.5 font-mono text-xs border tracking-wider ${
                  isDark
                    ? "bg-[#030712] border-[#1e3a8a] text-white focus:border-[#3b82f6]"
                    : "bg-white border-[#001255] text-[#001255] focus:border-[#001255]"
                }`}
              />
            </div>

            {!isForgotPassword && (
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-90">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full p-2.5 font-mono text-xs border ${
                    isDark
                      ? "bg-[#030712] border-[#1e3a8a] text-white focus:border-[#3b82f6]"
                      : "bg-white border-[#001255] text-[#001255] focus:border-[#001255]"
                  }`}
                />
              </div>
            )}

            {errorMessage && (
              <div className="border border-red-600 p-2 text-xs text-red-500">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="border border-green-600 p-2 text-xs text-green-600">
                {successMessage}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs uppercase border border-current/40 hover:bg-black/5"
              >
                CANCEL
              </button>
              {!isForgotPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="px-3 py-2 text-xs uppercase border border-current/40 hover:bg-black/5"
                >
                  {isSignup ? "HAVE AN ACCOUNT" : "CREATE ACCOUNT"}
                </button>
              )}
              {!isSignup && !isForgotPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="px-3 py-2 text-xs uppercase border border-current/40 hover:bg-black/5"
                >
                  FORGOT PASSWORD
                </button>
              )}
              {isForgotPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="px-3 py-2 text-xs uppercase border border-current/40 hover:bg-black/5"
                >
                  BACK TO LOGIN
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-bold uppercase ${
                  isDark ? "bg-[#1e3a8a] text-white" : "bg-[#001255] text-white"
                }`}
              >
                {isSubmitting
                  ? "SENDING..."
                  : isForgotPassword
                    ? "SEND LINK"
                    : isSignup
                      ? "SIGN UP"
                      : "LOG IN"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
