import React from "react";
import { ThemeMode } from "../types";

interface PrivacyViewProps {
  theme: ThemeMode;
  onBackToHome: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  theme,
  onBackToHome,
}) => {
  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen p-4 md:p-10 ${isDark ? "bg-[#030712] text-white" : "bg-[#dcd9d9] text-[#1b1c1c]"}`}
    >
      <div
        className={`mx-auto max-w-2xl border p-6 md:p-10 ${isDark ? "bg-[#050b14] border-[#1e3a8a]" : "bg-[#fcf9f8] border-[#001255] brutalist-shadow"}`}
      >
        <button
          onClick={onBackToHome}
          className="mb-6 text-xs font-bold uppercase tracking-wider underline opacity-80 hover:opacity-100"
        >
          Back to home
        </button>

        <h1 className="text-2xl font-bold font-heading tracking-tight mb-1">
          Privacy Policy
        </h1>
        <p className="text-sm opacity-60 mb-8">Last updated August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold uppercase tracking-wide text-[#ba1a1a] mb-1.5">
              What we collect
            </h2>
            <p>
              Browsing and searching recipes doesn&apos;t send us any
              personal information. Creating an account requires an email
              address and password, used only to sign you in and let you
              recover your account. If you use the feedback widget, we
              receive whatever you write and, only if you choose to share it,
              your account email so we can reply.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wide text-[#ba1a1a] mb-1.5">
              Cookies and analytics
            </h2>
            <p className="mb-2">
              We use Google Analytics to understand which pages and features
              get used, so we can improve them. Google Analytics is off by
              default: it only sets cookies and starts measuring after you
              accept analytics cookies in the banner shown on your first
              visit. If you decline, no Google Analytics cookies are set and
              no analytics data is sent for you.
            </p>
            <p>
              We also use Vercel Analytics and Vercel Speed Insights to track
              overall traffic and page performance. These run without
              cookies or any personal identifiers and don&apos;t require
              consent.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wide text-[#ba1a1a] mb-1.5">
              Your choices
            </h2>
            <p>
              You can change your analytics cookie choice at any time using
              the &quot;Cookie preferences&quot; link in the footer of any
              page. You can also delete your account at any time from your
              account settings.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wide text-[#ba1a1a] mb-1.5">
              Third parties
            </h2>
            <p>
              We share data with Google (Google Analytics) and Vercel
              (hosting, analytics, and speed insights) only as described
              above. We don&apos;t sell your data or use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wide text-[#ba1a1a] mb-1.5">
              Contact
            </h2>
            <p>
              Questions about this policy? Reach out through the feedback
              button in the corner of any page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyView;
