import React from "react";
import { NavigationTab, ThemeMode } from "../types";
import {
  Search,
  PlusSquare,
  Box,
  LogIn,
  Moon,
  Sun,
  BookOpen,
} from "lucide-react";

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  myBoxCount: number;
  theme: ThemeMode;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  userHandle: string;
  onOpenLogin: () => void;
  onOpenFAQ: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  myBoxCount,
  theme,
  toggleTheme,
  isLoggedIn,
  userHandle,
  onOpenLogin,
  onOpenFAQ,
}) => {
  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile Top Header */}
      <header
        id="mobile-nav-header"
        className={`md:hidden flex justify-between items-center w-full px-4 py-3 sticky top-0 z-50 border-b ${
          isDark
            ? "bg-[#030712] border-[#1e3a8a] text-[#dde1ff]"
            : "bg-[#fcf9f8] border-[#001255] text-[#001255]"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("search")}
            className="text-left font-bold text-xs uppercase tracking-widest flex items-center gap-1.5"
          >
            <span className="font-heading text-sm font-black">CARD BOX</span>
          </button>
        </div>

        <nav className="flex items-center gap-2">
          <button
            id="mobile-tab-search"
            onClick={() => setActiveTab("search")}
            className={`px-2 py-1 text-xs font-mono tracking-wider transition-none ${
              activeTab === "search"
                ? isDark
                  ? "text-[#60a5fa] font-bold border-b-2 border-[#60a5fa]"
                  : "text-[#001255] font-bold border-b-2 border-[#001255]"
                : isDark
                  ? "text-[#9ca3af]"
                  : "text-[#5f5e5a]"
            }`}
          >
            SEARCH
          </button>

          <button
            id="mobile-tab-upload"
            onClick={() => setActiveTab("upload")}
            className={`px-2 py-1 text-xs font-mono tracking-wider transition-none ${
              activeTab === "upload"
                ? isDark
                  ? "text-[#60a5fa] font-bold border-b-2 border-[#60a5fa]"
                  : "text-[#001255] font-bold border-b-2 border-[#001255]"
                : isDark
                  ? "text-[#9ca3af]"
                  : "text-[#5f5e5a]"
            }`}
          >
            UPLOAD
          </button>

          <button
            id="mobile-tab-my-box"
            onClick={() => setActiveTab("my-box")}
            className={`px-2 py-1 text-xs font-mono tracking-wider transition-none flex items-center gap-1 ${
              activeTab === "my-box"
                ? isDark
                  ? "text-[#60a5fa] font-bold border-b-2 border-[#60a5fa]"
                  : "text-[#001255] font-bold border-b-2 border-[#001255]"
                : isDark
                  ? "text-[#9ca3af]"
                  : "text-[#5f5e5a]"
            }`}
          >
            MY CARD BOX
            <span className="text-[10px] opacity-80">({myBoxCount})</span>
          </button>

          <button
            id="mobile-theme-toggle"
            onClick={toggleTheme}
            className={`p-1 text-xs border ${
              isDark
                ? "border-[#1e3a8a] text-[#60a5fa]"
                : "border-[#001255] text-[#001255]"
            }`}
            title="Toggle Midnight/Archival Theme"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </nav>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 w-64 border-r z-40 ${
          isDark
            ? "bg-[#030712] border-[#1e3a8a] text-[#b9c3ff]"
            : "bg-[#f0eded] border-[#001255] text-[#1b1c1c]"
        }`}
      >
        {/* Brand Header */}
        <div
          id="sidebar-brand-header"
          className={`p-6 border-b ${
            isDark ? "border-[#1e3a8a]" : "border-[#001255]"
          }`}
        >
          <div
            onClick={() => setActiveTab("search")}
            className={`cursor-pointer text-2xl font-black font-heading tracking-tight uppercase ${
              isDark ? "text-[#3b82f6]" : "text-[#001255]"
            }`}
          >
            INDEX CARD RECIPES
          </div>
          <div
            className={`text-xs font-mono tracking-wider uppercase mt-1 ${
              isDark ? "text-[#60a5fa]" : "text-[#5f5e5a]"
            }`}
          >
            DIRECT DATA ACCESS
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col pt-4 font-mono text-sm tracking-wide">
          <button
            id="nav-link-search"
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition-none uppercase ${
              activeTab === "search"
                ? isDark
                  ? "bg-[#111827] text-[#60a5fa] font-bold border-l-4 border-[#3b82f6]"
                  : "bg-[#e5e2dc] text-[#001255] font-bold border-l-4 border-[#001255]"
                : isDark
                  ? "text-[#9ca3af] hover:bg-[#1e3a8a] hover:text-white"
                  : "text-[#5f5e5a] hover:bg-[#001255] hover:text-[#fcf9f8]"
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="tracking-widest">SEARCH</span>
          </button>

          <button
            id="nav-link-upload"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-3 px-6 py-3.5 text-left transition-none uppercase ${
              activeTab === "upload"
                ? isDark
                  ? "bg-[#111827] text-[#60a5fa] font-bold border-l-4 border-[#3b82f6]"
                  : "bg-[#e5e2dc] text-[#001255] font-bold border-l-4 border-[#001255]"
                : isDark
                  ? "text-[#9ca3af] hover:bg-[#1e3a8a] hover:text-white"
                  : "text-[#5f5e5a] hover:bg-[#001255] hover:text-[#fcf9f8]"
            }`}
          >
            <PlusSquare className="w-4 h-4 shrink-0" />
            <span className="tracking-widest">UPLOAD</span>
          </button>

          <button
            id="nav-link-my-box"
            onClick={() => setActiveTab("my-box")}
            className={`flex items-center justify-between px-6 py-3.5 text-left transition-none uppercase ${
              activeTab === "my-box"
                ? isDark
                  ? "bg-[#111827] text-[#60a5fa] font-bold border-l-4 border-[#3b82f6]"
                  : "bg-[#e5e2dc] text-[#001255] font-bold border-l-4 border-[#001255]"
                : isDark
                  ? "text-[#9ca3af] hover:bg-[#1e3a8a] hover:text-white"
                  : "text-[#5f5e5a] hover:bg-[#001255] hover:text-[#fcf9f8]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 shrink-0" />
              <span className="tracking-widest">MY CARD BOX</span>
            </div>
            <span
              className={`text-xs px-1.5 py-0.5 border ${
                isDark
                  ? "border-[#1e3a8a] text-[#93c5fd]"
                  : "border-[#001255] text-[#001255]"
              }`}
            >
              {myBoxCount}
            </span>
          </button>

          {/* Footer Area with Theme Toggle & Login */}
          <div
            className={`mt-auto mb-4 border-t pt-4 px-6 flex flex-col gap-3 ${
              isDark ? "border-[#1e3a8a]" : "border-[#001255]"
            }`}
          >
            {/* Theme switcher */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={isDark ? "text-[#9ca3af]" : "text-[#5f5e5a]"}>
                {isDark ? "MIDNIGHT DATA" : "INDEX CARD"}
              </span>
              <button
                id="sidebar-theme-toggle"
                onClick={toggleTheme}
                className={`p-1.5 border transition-none flex items-center gap-1 text-[11px] ${
                  isDark
                    ? "border-[#3b82f6] text-[#60a5fa] hover:bg-[#1e3a8a] hover:text-white"
                    : "border-[#001255] text-[#001255] hover:bg-[#001255] hover:text-white"
                }`}
                title="Toggle Mode"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span>LIGHT</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>DARK</span>
                  </>
                )}
              </button>
            </div>

            {/* Login / Auth */}
            <button
              id="sidebar-login-button"
              onClick={onOpenLogin}
              className={`flex items-center gap-3 py-2 text-left uppercase transition-none text-xs font-bold ${
                isDark
                  ? "text-[#9ca3af] hover:text-[#60a5fa]"
                  : "text-[#5f5e5a] hover:text-[#001255]"
              }`}
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span className="tracking-widest">
                {isLoggedIn ? `USER: ${userHandle}` : "LOGIN"}
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
