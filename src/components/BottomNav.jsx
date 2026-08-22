import React from "react";

export default function BottomNav({ active, onChange }) {
  const items = [
    {
      key: "home",
      label: "HOME",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      key: "explore",
      label: "EXPLORE",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.9"
          />
          <path d="M10 14l4-2 2-4-4 2-2 4z" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: "experience",
      label: "EXPERIENCE",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2l1.9 4.2L18 8l-4 1.7L12 14l-2-4.3L6 8l4.1-1.8L12 2z"
            fill="currentColor"
          />
          <circle cx="18" cy="5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: "profile",
      label: "PROFILE",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3" fill="currentColor" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9999 }}
    >
      <div
        className="w-full"
        style={{
          background: "var(--primary)",
          borderTop: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <div className="max-w-xl mx-auto flex">
          {items.map((it) => {
            const isActive = active === it.key;
            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                className={`flex-1 py-3 flex flex-col items-center justify-center gap-1 text-sm font-semibold transition-all duration-200 bottom-nav-button`}
                aria-label={it.label}
                style={
                  isActive
                    ? {
                        color: "white",
                        background:
                          "linear-gradient(90deg, var(--primary), var(--accent))",
                        boxShadow: "0 8px 24px rgba(193,115,92,0.18)",
                        transform: "translateY(-4px) scale(1.02)",
                      }
                    : {
                        color: "rgba(255,255,255,0.9)",
                        background: "transparent",
                      }
                }
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {it.icon}
                </div>
                <div className="nav-label">{it.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
