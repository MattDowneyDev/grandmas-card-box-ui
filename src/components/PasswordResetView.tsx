import React, { useState } from "react";
import { AlertCircle, Key } from "lucide-react";
import { resetPassword } from "../api/auth";
import { ThemeMode } from "../types";

interface PasswordResetViewProps {
  theme: ThemeMode;
  token: string;
  onBackToLogin: () => void;
}

export const PasswordResetView: React.FC<PasswordResetViewProps> = ({
  theme,
  token,
  onBackToLogin,
}) => {
  const isDark = theme === "dark";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      setIsComplete(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Password reset failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 ${isDark ? "bg-[#030712] text-white" : "bg-[#dcd9d9] text-[#1b1c1c]"}`}
    >
      <div
        id="auth-modal"
        className={`w-full max-w-md border p-6 md:p-8 ${isDark ? "bg-[#050b14] border-[#1e3a8a]" : "bg-[#fcf9f8] border-[#001255] brutalist-shadow"}`}
      >
        <div className="flex items-center gap-3 border-b pb-4 mb-6 border-current/15">
          <span className="auth-modal-icon">
            <Key className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold font-heading tracking-tight">
            Reset password
          </h1>
        </div>

        {isComplete ? (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed">
              Your password has been updated. You can now log in with the new
              password.
            </p>
            <button onClick={onBackToLogin} className="modern-button w-full">
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm opacity-80 leading-relaxed">
              Choose a new password for your account.
            </p>
            <label className="block text-sm font-semibold opacity-90">
              New password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full mt-1.5 p-3 text-sm border bg-white border-[#001255]"
              />
            </label>
            <label className="block text-sm font-semibold opacity-90">
              Confirm password
              <input
                type="password"
                required
                minLength={8}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="w-full mt-1.5 p-3 text-sm border bg-white border-[#001255]"
              />
            </label>
            {errorMessage && (
              <div className="modern-notice modern-notice-error" role="alert">
                <AlertCircle /> {errorMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="modern-button w-full disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};
