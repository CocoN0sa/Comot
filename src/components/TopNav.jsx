import React, { useEffect, useState } from "react";
import Logo from "../assets/images/comot logo.png";

const destinations = [
  { key: "explore", label: "Explore" },
  { key: "experience", label: "Experience" },
  { key: "profile", label: "Profile" },
];

export default function TopNav({ active, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const navigate = (page) => {
    setIsOpen(false);
    onNavigate?.(page);
  };

  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <img className="explore-brand-logo" src={Logo} alt="COMOT logo" />
      <button
        type="button"
        className="top-nav-toggle"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {isOpen ? (
            <path d="m6 6 12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {isOpen && (
        <div className="top-nav-menu" id="primary-navigation-menu">
          {destinations.map((destination) => (
            <button
              key={destination.key}
              type="button"
              className={active === destination.key ? "is-active" : undefined}
              aria-current={active === destination.key ? "page" : undefined}
              onClick={() => navigate(destination.key)}
            >
              {destination.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
