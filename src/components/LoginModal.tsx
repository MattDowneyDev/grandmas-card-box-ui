import React, { useState } from "react";
import { track } from "@vercel/analytics/react";
import { ThemeMode } from "../types";
import { ChefHat, X, MailWarning, AlertCircle, Check } from "lucide-react";
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

  const resetNotices = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

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
    resetNotices();

    try {
      if (isForgotPassword) {
        await onRequestPasswordReset(emailInput.trim());
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
      track(isSignup ? "signup" : "login");
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
    resetNotices();

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="auth-modal"
        onClick={(event) => event.stopPropagation()}
        className={isDark ? "is-dark" : ""}
      >
        <div className="auth-modal-head">
          <div className="flex items-center gap-3">
            <span className="auth-modal-icon">
              <ChefHat className="h-5 w-5" />
            </span>
            <h2>
              {isLoggedIn
                ? "Your account"
                : isForgotPassword
                  ? "Reset your password"
                  : isSignup
                    ? "Create your account"
                    : "Welcome back"}
            </h2>
          </div>
          <button className="auth-modal-close" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoggedIn ? (
          <div>
            <div className="account-avatar-row">
              <div className="account-avatar">
                {userHandle.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="name">{userHandle}</div>
                <span
                  className={`account-status-pill ${
                    isEmailVerified ? "verified" : "unverified"
                  }`}
                >
                  {isEmailVerified ? (
                    <>
                      <Check className="w-3 h-3" /> Verified
                    </>
                  ) : (
                    <>
                      <MailWarning className="w-3 h-3" /> Unverified
                    </>
                  )}
                </span>
              </div>
            </div>

            {!isEmailVerified && (
              <div className="account-alert">
                <MailWarning />
                <div className="flex-1">
                  <p>
                    Verify your email to favorite recipes, upload your own, and
                    use My Box. Check your inbox for a confirmation link, or
                    resend it below.
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
                    <p className="text-sm opacity-80 mt-2">{verificationMessage}</p>
                  )}
                </div>
              </div>
            )}

            {isEditingAccount ? (
              <form onSubmit={handleAccountUpdate} className="account-edit-form">
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
              <div>
                <div className="account-section-label">Account settings</div>
                <button
                  type="button"
                  className="modern-button secondary account-edit-trigger"
                  onClick={() => {
                    setAccountDisplayName(userHandle);
                    setIsEditingAccount(true);
                    resetNotices();
                  }}
                >
                  Edit display name or password
                </button>
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

            <div className="account-danger-zone">
              <div className="account-section-label">Danger zone</div>
              <div className="account-danger-actions">
                <button
                  type="button"
                  onClick={onLogout}
                  className="modern-button secondary"
                >
                  Log out
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="modern-button danger-outline disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete account"}
                </button>
              </div>
            </div>

            <div className="auth-actions">
              <button type="button" onClick={onClose} className="modern-button">
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {!isForgotPassword && (
              <div className="auth-tabs">
                <button
                  type="button"
                  className={!isSignup ? "active" : ""}
                  onClick={() => {
                    setIsSignup(false);
                    resetNotices();
                  }}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className={isSignup ? "active" : ""}
                  onClick={() => {
                    setIsSignup(true);
                    resetNotices();
                  }}
                >
                  Sign up
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <p className="text-sm opacity-80 leading-relaxed mb-5">
                {isForgotPassword
                  ? "Enter your email and we will send a password reset link if an account exists."
                  : isSignup
                    ? "Create an account to add favorites to your card box. Don't worry, we won't spam you. We'll email you a link to verify your address — you'll need to confirm it before you can favorite, upload, or use My Box."
                    : "Log in to add favorites to your card box."}
              </p>

              {!isForgotPassword && isSignup && (
                <div className="auth-field">
                  <label>Display name</label>
                  <input
                    type="text"
                    required
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="e.g. Chef_001"
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="chef@example.com"
                />
              </div>

              {!isForgotPassword && (
                <div className="auth-field">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
              )}

              <div className="auth-helper-row">
                {!isSignup && !isForgotPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      resetNotices();
                    }}
                    className="auth-link"
                  >
                    Forgot password?
                  </button>
                )}
                {isForgotPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      resetNotices();
                    }}
                    className="auth-link"
                  >
                    Back to log in
                  </button>
                )}
              </div>

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

              <div className="auth-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="modern-button secondary"
                >
                  Cancel
                </button>
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
          </>
        )}
      </div>
    </div>
  );
};
