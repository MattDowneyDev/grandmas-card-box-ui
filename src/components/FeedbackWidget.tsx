import React, { useState } from "react";
import { track } from "@vercel/analytics/react";
import { AlertCircle, Check, MessageSquare, X } from "lucide-react";
import { ThemeMode } from "../types";
import { sendFeedback } from "../api/feedback";

interface Props {
  theme: ThemeMode;
  authToken: string | null;
}

type FeedbackType = "comment" | "bug" | "feature";

const TYPE_OPTIONS: { value: FeedbackType; label: string }[] = [
  { value: "comment", label: "Comment or thank you" },
  { value: "bug", label: "Report a bug" },
  { value: "feature", label: "Request a feature" },
];

const MAX_MESSAGE_LENGTH = 2000;

type Status = "idle" | "submitting" | "success" | "error";

export const FeedbackWidget: React.FC<Props> = ({ theme, authToken }) => {
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("comment");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const openWidget = () => {
    setType("comment");
    setMessage("");
    setEmail("");
    setCompany("");
    setStatus("idle");
    setErrorMessage("");
    setIsOpen(true);
    track("feedback_widget_open");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      await sendFeedback(
        { type, message: message.trim(), email: email.trim() || undefined, company },
        authToken || undefined,
      );
      setStatus("success");
      track("feedback_sent", { type });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openWidget}
        aria-label="Send feedback"
        className="modern-button feedback-fab"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {isOpen && (
        <div
          id="feedback-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            id="feedback-modal"
            onClick={(event) => event.stopPropagation()}
            className={isDark ? "is-dark" : ""}
          >
            <div className="feedback-modal-head">
              <div className="flex items-center gap-3">
                <span className="feedback-modal-icon">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <h2>Feedback</h2>
              </div>
              <button
                className="feedback-modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === "success" ? (
              <div>
                <div className="modern-notice">
                  <Check /> Your message has been sent. Thanks!
                </div>
                <div className="auth-actions">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="modern-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-sm opacity-80 leading-relaxed mb-5">
                  Found a bug, want a feature, or just want to say hi? Let us
                  know.
                </p>

                <div className="auth-field">
                  <label>Type</label>
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value as FeedbackType)}
                  >
                    {TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="auth-field">
                  <label>Message</label>
                  <textarea
                    required
                    rows={4}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <div className="auth-field">
                  <label>
                    Email{" "}
                    <span className="opacity-60 font-normal">
                      (optional, if you&apos;d like a reply)
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                {/* Honeypot: hidden from real users, so anything that fills it
                    in is almost certainly a bot. The backend accepts the
                    submission but silently drops it. */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />

                {status === "error" && (
                  <div className="modern-notice modern-notice-error" role="alert">
                    <AlertCircle /> {errorMessage}
                  </div>
                )}

                <div className="auth-actions">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="modern-button secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="modern-button"
                  >
                    {status === "submitting" ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
