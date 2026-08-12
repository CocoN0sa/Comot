import React from "react";

export default function Fab({ onClick }) {
  return (
    <button aria-label="Primary action" onClick={onClick} className="fab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.08)" />
        <path
          d="M12 7v10M7 12h10"
          stroke="white"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
