import React, { useState } from "react";
import { LogIn, Menu, Moon, Sun, X } from "lucide-react";
import { NavigationTab, ThemeMode } from "../types";

interface Props {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  myBoxCount: number;
  theme: ThemeMode;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  userHandle: string;
  onOpenLogin: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  myBoxCount,
  theme,
  toggleTheme,
  isLoggedIn,
  userHandle,
  onOpenLogin,
}) => {
  const dark = theme === "dark";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = [
    { id: "search" as const, label: "Explore" },
    { id: "my-box" as const, label: "My card box" },
    { id: "upload" as const, label: "Add a recipe" },
  ];
  return (
    <header className={`site-header ${dark ? "is-dark" : ""}`}>
      <button
        className="site-header-brand"
        onClick={() => setActiveTab("search")}
      >
        Grandma's Card Box
      </button>
      <nav className="site-header-nav">
        {items.map(({ id, label }) => (
          <button
            key={id}
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >
            <span>{id === "upload" ? "Upload" : label}</span>
            {id === "my-box" && <small>{myBoxCount}</small>}
          </button>
        ))}
      </nav>
      <div className="site-header-actions">
        <button onClick={toggleTheme} title="Toggle theme">
          {dark ? <Sun /> : <Moon />}
          <span className="theme-label">{dark ? "Dark" : "Light"}</span>
        </button>
        <button className="site-header-account" onClick={onOpenLogin}>
          <LogIn />
          <span>{isLoggedIn ? userHandle : "Sign in"}</span>
        </button>
        <button
          className="site-header-menu-toggle"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="site-header-mobile-menu">
          {items.map(({ id, label }) => (
            <button
              key={id}
              className={activeTab === id ? "active" : ""}
              onClick={() => {
                setActiveTab(id);
                setIsMobileMenuOpen(false);
              }}
            >
              <span>{id === "upload" ? "Upload" : label}</span>
              {id === "my-box" && <small>{myBoxCount}</small>}
            </button>
          ))}
          <button onClick={toggleTheme}>
            <span>{dark ? "Light mode" : "Dark mode"}</span>
            {dark ? <Sun /> : <Moon />}
          </button>
          <button onClick={onOpenLogin}>
            <span>{isLoggedIn ? userHandle : "Sign in"}</span>
            <LogIn />
          </button>
        </div>
      )}
    </header>
  );
};
