import React, { useState } from "react";
import { ThemeMode } from "../types";
import { ChefHat, X, UserCheck, MailWarning, AlertCircle, Check } from "lucide-react";
import { AuthSession } from "../api/auth";

interface LoginModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  userHandle: string;
  isLoggedIn: boolean;
  isEmailVerified: boolean;
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
  onResendVerification: () => Promise<void>;
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
  isEmailVerified,
  onClose,
  onLogin,
  onLoginWithPassword,
  onSignup,
  onRequestPasswordReset,
  onResendVerification,
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
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    setVerificationMessage(null);
    try {
      await onResendVerification();
      setVerificationMessage("Verification email sent. Check your inbox.");
    } catch (error) {
      setVerificationMessage(
        error instanceof Error ? error.message : "Failed to resend verification email",
      );
    } finally {
      setIsResendingVerification(false);
    }
  };

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
      // Stay open after signup so the account panel's verification banner is
      // the first thing the new user sees — don't let it slip by unnoticed.
      if (!isSignup) onClose();
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
        className={`relative w-full max-w-md border p-6 md:p-8 ${
          isDark
            ? "bg-[#050b14] border-[#1e3a8a] text-white"
            : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c] brutalist-shadow"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-current/15">
          <div className="flex items-center gap-3">
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
            className={`p-1.5 border rounded-full transition-opacity hover:opacity-70 ${
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
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-green-600/30 bg-green-500/10">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 opacity-80">
                  Logged in as
                </div>
                <div className="text-sm font-semibold">{userHandle}</div>
              </div>
            </div>

            <p className="text-sm opacity-80 leading-relaxed">
              Your uploaded and favorited recipes are saved automatically.
            </p>

            {!isEmailVerified && (
              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10">
                <MailWarning className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 opacity-80">
                    Email not verified
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Verify your email to favorite recipes, upload your own, and use My Box.
                    Check your inbox for a confirmation link, or resend it below.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="modern-button secondary disabled:opacity-50"
                  >
                    {isResendingVerification ? "Sending..." : "Resend verification email"}
                  </button>
                  {verificationMessage && (
                    <p className="text-sm opacity-80">{verificationMessage}</p>
                  )}
                </div>
              </div>
            )}

            {isEditingAccount ? (
              <form
                onSubmit={handleAccountUpdate}
                className="account-edit-form"
              >
                <label>
                  Display name
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
                    Current password
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
                    New password
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
              <div className="modern-notice modern-notice-error" role="alert">
                <AlertCircle /> {errorMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-current/15">
              <button
                type="button"
                onClick={onLogout}
                className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold border border-red-600 text-red-600 hover:bg-red-500/10"
              >
                Log out
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold border border-red-900 text-red-900 hover:bg-red-900/10 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="modern-button flex-1 min-w-[120px]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm opacity-80 leading-relaxed">
              {isForgotPassword
                ? "Enter your email and we will send a password reset link if an account exists."
                : isSignup
                  ? "Create an account to add favorites to your card box. Don't worry, we won't spam you. We'll email you a link to verify your address — you'll need to confirm it before you can favorite, upload, or use My Box."
                  : "Log in to add favorites to your card box."}
            </p>

            {!isForgotPassword && isSignup && (
              <div>
                <label className="block text-sm font-semibold mb-1.5 opacity-90">
                  Display name
                </label>
                <input
                  type="text"
                  required
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="e.g. Chef_001"
                  className="w-full mb-3 p-3 text-sm border bg-white border-[#001255] text-[#001255] focus:border-[#001255]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1.5 opacity-90">
                Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="chef@example.com"
                className="w-full p-3 text-sm border bg-white border-[#001255] text-[#001255] focus:border-[#001255]"
              />
            </div>

            {!isForgotPassword && (
              <div>
                <label className="block text-sm font-semibold mb-1.5 opacity-90">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-3 text-sm border bg-white border-[#001255] text-[#001255] focus:border-[#001255]"
                />
              </div>
            )}

            {errorMessage && (
              <div className="modern-notice modern-notice-error" role="alert">
                <AlertCircle /> {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="modern-notice">
                <Check /> {successMessage}
              </div>
            )}

            <div className="pt-2 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="modern-button secondary"
              >
                Cancel
              </button>
              {!isForgotPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="modern-button secondary"
                >
                  {isSignup ? "I have an account" : "Create account"}
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
                  className="modern-button secondary"
                >
                  Forgot password?
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
                  className="modern-button secondary"
                >
                  Back to login
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="modern-button"
              >
                {isSubmitting
                  ? "Sending..."
                  : isForgotPassword
                    ? "Send reset link"
                    : isSignup
                      ? "Sign up"
                      : "Log in"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
