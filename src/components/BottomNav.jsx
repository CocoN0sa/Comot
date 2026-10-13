import React from "react";

export default function BottomNav({ active, onChange, visibleItems }) {
  const items = [
    {
      key: "explore",
      label: "Explore",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="8.25"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="m14.8 9.2-2 5.6-3.6 1.7 1.7-3.8 3.9-3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: "experience",
      label: "Experience",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 3.5 2.3 5.2 5.2 2.3-5.2 2.3-2.3 5.2-2.3-5.2-5.2-2.3 5.2-2.3L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M19 16.5v4M17 18.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 20c.7-3.5 3.2-5.4 7-5.4s6.3 1.9 7 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];
  const navItems = visibleItems
    ? items.filter((item) => visibleItems.includes(item.key))
    : items;

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <div className="bottom-nav-inner">
        {navItems.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange?.(it.key)}
              className={`bottom-nav-button${isActive ? " is-active" : ""}`}
              aria-label={it.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="bottom-nav-icon">{it.icon}</span>
              <span className="nav-label">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
