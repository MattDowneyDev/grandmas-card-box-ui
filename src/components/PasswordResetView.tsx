import React, { useState } from "react";
import { Key } from "lucide-react";
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
        className={`w-full max-w-md border p-6 md:p-8 font-mono ${isDark ? "bg-[#050b14] border-[#1e3a8a]" : "bg-[#fcf9f8] border-[#001255] brutalist-shadow"}`}
      >
        <div className="flex items-center gap-2 border-b pb-3 mb-6 border-current">
          <Key className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold uppercase font-heading">
            RESET PASSWORD
          </h1>
        </div>

        {isComplete ? (
          <div className="space-y-5">
            <p className="text-sm">
              Your password has been updated. You can now log in with the new
              password.
            </p>
            <button
              onClick={onBackToLogin}
              className={`w-full py-2 text-xs font-bold uppercase ${isDark ? "bg-[#1e3a8a] text-white" : "bg-[#001255] text-white"}`}
            >
              RETURN TO LOGIN
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs opacity-80">
              Choose a new password for your account.
            </p>
            <label className="block text-xs font-bold uppercase">
              NEW PASSWORD
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`w-full mt-1 p-2.5 text-xs border ${isDark ? "bg-[#030712] border-[#1e3a8a]" : "bg-white border-[#001255]"}`}
              />
            </label>
            <label className="block text-xs font-bold uppercase">
              CONFIRM PASSWORD
              <input
                type="password"
                required
                minLength={8}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className={`w-full mt-1 p-2.5 text-xs border ${isDark ? "bg-[#030712] border-[#1e3a8a]" : "bg-white border-[#001255]"}`}
              />
            </label>
            {errorMessage && (
              <div className="border border-red-600 p-2 text-xs text-red-500">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 text-xs font-bold uppercase disabled:opacity-50 ${isDark ? "bg-[#1e3a8a] text-white" : "bg-[#001255] text-white"}`}
            >
              {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};
