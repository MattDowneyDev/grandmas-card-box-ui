import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, MailCheck } from "lucide-react";
import { verifyEmail } from "../api/auth";
import { ThemeMode } from "../types";

interface VerifyEmailViewProps {
  theme: ThemeMode;
  token: string;
  onBackToLogin: () => void;
}

export const VerifyEmailView: React.FC<VerifyEmailViewProps> = ({
  theme,
  token,
  onBackToLogin,
}) => {
  const isDark = theme === "dark";
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("This verification link is missing its token.");
      return;
    }
    if (hasRequested.current) return;
    hasRequested.current = true;

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((error) => {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Email verification failed",
        );
      });
  }, [token]);

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
            <MailCheck className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold font-heading tracking-tight">
            Verify email
          </h1>
        </div>

        {status === "pending" && (
          <p className="text-sm opacity-80">Confirming your email address...</p>
        )}

        {status === "success" && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed">
              Your email address has been verified. Thanks for confirming!
            </p>
            <button onClick={onBackToLogin} className="modern-button w-full">
              Return to login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5">
            <div className="modern-notice modern-notice-error" role="alert">
              <AlertCircle /> {errorMessage}
            </div>
            <button onClick={onBackToLogin} className="modern-button w-full">
              Return to login
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
