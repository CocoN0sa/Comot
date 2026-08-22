import React, { useState } from "react";
import Logo from "../assets/images/comot logo.png";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-slate-900">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex h-10 items-center overflow-hidden">
          <img
            src={Logo}
            alt="COMOT logo"
            className="h-7 w-auto max-w-[110px] object-contain"
          />
        </div>

        <button
          className="rounded-full text-sm font-semibold text-white transition-colors duration-200"
          style={{
            backgroundColor: isHovered ? "#c1735c" : "var(--primary)",
            color: "#ffffff",
            paddingLeft: "18px",
            paddingRight: "18px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Sign Up
        </button>
      </header>

      <main className="px-4 py-6">
        <section className="h-64 rounded-3xl bg-slate-100" />
      </main>
    </div>
  );
}
