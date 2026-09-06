import React, { useState } from "react";
import Logo from "../assets/images/comot logo.png";
import ImageOne from "../assets/images/comotimg1.jpg";
import ImageTwo from "../assets/images/comotimg2.webp";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-slate-900">
      <header
        className="flex items-center px-4 py-3 bg-[#f7f2e8]"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <div className="flex h-10 items-center overflow-hidden">
          <img
            src={Logo}
            alt="COMOT logo"
            className="h-7 w-auto max-w-[110px] object-contain"
          />
        </div>

        <div className="ml-auto">
          <button
            className="rounded-full text-sm font-semibold text-white transition-colors duration-200"
            style={{
              backgroundColor: isHovered ? "#c1735c" : "var(--primary)",
              color: "#ffffff",
              border: "none",
              outline: "none",
              paddingLeft: "15px",
              paddingRight: "15px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "0.8rem",
              position: "relative",
              left: "-12px",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="px-3 py-4" style={{ paddingTop: "64px" }}>
        <section
          className="relative mx-auto w-[95%] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#263b5b] via-[#2a446e] to-[#d39b82] px-6 py-9 text-white shadow-[0_24px_60px_rgba(38,59,91,0.22)] min-h-[380px] flex items-center"
          style={{ marginTop: "0px" }}
        >
          <div className="mx-auto max-w-[300px] text-center">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2.5">
                <div
                  style={{
                    position: "relative",
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "-6px",
                    transform: "translateX(-3px)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "9999px",
                      background: "rgba(246, 215, 197, 0.35)",
                      animation: "pulse 1.2s ease-out infinite",
                      opacity: 0.9,
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      width: 8,
                      height: 8,
                      borderRadius: "9999px",
                      background: "#f6d7c5",
                      boxShadow: "0 0 0 3px rgba(255,255,255,0.35)",
                      animation: "blink 0.9s ease-in-out infinite",
                    }}
                  />
                </div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8e8df]"
                  style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}
                >
                  NOW LIVE IN ABUJA
                </p>
              </div>
            </div>

            <h1
              className="mt-4 text-[2.1rem] font-bold leading-[0.96] tracking-[-0.06em] text-[#fffaf7]"
              style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}
            >
              Find Places,
              <span className="block text-[#fffaf7]">Find People.</span>
            </h1>

            <p
              className="mt-4 text-sm leading-6 text-[#f8e8df]"
              style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}
            >
              Discover the best spot in your city and find people to go with.
            </p>

            <div
              className="mt-8 flex items-center justify-center"
              style={{ gap: "3%", transform: "translateY(10px)" }}
            >
              <button
                type="button"
                className="flex items-center justify-center rounded-full py-3.5 text-[0.92rem] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fffaf7",
                  minWidth: "138px",
                  paddingLeft: "20%",
                  paddingRight: "20%",
                  paddingTop: "0.875rem",
                  paddingBottom: "0.875rem",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                  e.currentTarget.style.color = "#fffaf7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.color = "#fffaf7";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Get Started
              </button>

              <button
                type="button"
                className="flex items-center justify-center rounded-full border py-3.5 text-[0.92rem] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "#fffaf7",
                  minWidth: "100px",
                  paddingLeft: "20%",
                  paddingRight: "20%",
                  paddingTop: "0.875rem",
                  paddingBottom: "0.875rem",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                  e.currentTarget.style.color = "#fffaf7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.color = "#fffaf7";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Log in
              </button>
            </div>
          </div>
        </section>

        <section className="relative mx-auto mt-[5%] w-[95%] overflow-hidden rounded-[30px] bg-white shadow-[0_24px_60px_rgba(38,59,91,0.12)]">
          <div className="relative h-[220px] w-full overflow-hidden rounded-t-[30px]">
            <img
              src={ImageOne}
              alt="Featured experience"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263b5b]/80 via-[#263b5b]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8e8df]">
                Handpicked venues
              </p>
              <h2 className="mt-2 text-[1.7rem] font-bold leading-[1.1] tracking-[-0.05em]">
                Find your next vibe.
              </h2>
            </div>
          </div>

          <div
            className="bg-[#f7f2e8] px-[5%] pb-5 pt-4 text-left"
            style={{ backgroundColor: "#f7f2e8" }}
          >
            <p className="text-[1.15rem] font-semibold leading-[1.3] tracking-[-0.04em] text-[#263b5b]">
              Meet strangers.
              <span className="mt-1 block text-[#263b5b]">
                One table. Zero awkwardness.
              </span>
            </p>
          </div>
        </section>

        <section className="relative mx-auto mt-[5%] w-[95%] overflow-hidden rounded-[30px] bg-[var(--accent)] shadow-[0_24px_60px_rgba(38,59,91,0.12)]">
          <div className="relative h-[220px] w-full overflow-hidden rounded-t-[30px]">
            <img
              src={ImageTwo}
              alt="People sharing an experience"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263b5b]/80 via-[#263b5b]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8e8df]">
                Make it social
              </p>
              <h2 className="mt-2 text-[1.7rem] font-bold leading-[1.1] tracking-[-0.05em]">
                Bring your people.
              </h2>
            </div>
          </div>

          <div
            className="px-[5%] pb-10 pt-4 text-left"
            style={{ paddingBottom: "40px" }}
          >
            <p
              className="text-[1.5rem] font-extrabold leading-[1.25] tracking-[-0.04em] text-white"
              style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}
            >
              The going out plan that never happens.
            </p>
            <div
              className="relative mt-5 overflow-hidden rounded-[28px_12px_28px_12px] border-0 bg-gradient-to-br from-[#fffaf7] to-[#f7f2e8] px-6 py-5 text-left text-[#263b5b] shadow-[0_10px_28px_rgba(38,59,91,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                fontSize: "1.35rem",
                fontWeight: 600,
                padding: "0 12px",
                backgroundColor: "#f7f2e8",
                marginTop: "20px",
              }}
            >
              <p
                className="text-[1.35rem] font-semibold leading-[1.25] tracking-[-0.04em]"
                style={{ fontSize: "1.35rem", fontWeight: 600 }}
              >
                Don&apos;t know where to go?
              </p>
              <p
                className="mt-2 text-[1.15rem] font-normal leading-[1.4] tracking-normal"
                style={{ fontSize: "1.15rem", fontWeight: 400 }}
              >
                Venue disovery in Nigerian cities is broken. People still rely
                on whatsapp forwards, outdated instagram pages, word of mouth
                and guesswork to find places to eat, hang out, work date, party
                and explore.
              </p>
            </div>
            <div
              className="relative mt-5 overflow-hidden rounded-[28px_12px_28px_12px] border-0 bg-gradient-to-br from-[#fffaf7] to-[#f7f2e8] px-6 py-5 text-left text-[#263b5b] shadow-[0_10px_28px_rgba(38,59,91,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#f7f2e8",
                padding: "0 12px",
                marginTop: "20px",
              }}
            >
              <p
                className="text-[1.35rem] font-semibold leading-[1.25] tracking-[-0.04em]"
                style={{ fontSize: "1.35rem", fontWeight: 600 }}
              >
                Nobody to go with?
              </p>
              <p
                className="mt-0 text-[1.15rem] font-normal leading-[1.4] tracking-normal"
                style={{ fontSize: "1.15rem", fontWeight: 400 }}
              >
                Coordinating an outing is harder than it should be. Several
                people, one group chat, no decision
              </p>
            </div>
            <div
              className="relative mt-5 overflow-hidden rounded-[28px_12px_28px_12px] border-0 bg-gradient-to-br from-[#fffaf7] to-[#f7f2e8] px-6 py-5 text-left text-[#263b5b] shadow-[0_10px_28px_rgba(38,59,91,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#f7f2e8",
                padding: "0 12px 24px",
                marginTop: "20px",
              }}
            >
              <p
                className="text-[1.35rem] font-semibold leading-[1.25] tracking-[-0.04em]"
                style={{ fontSize: "1.35rem", fontWeight: 600 }}
              >
                Staying home again?
              </p>
              <p
                className="mt-0 text-[1.15rem] font-normal leading-[1.4] tracking-normal"
                style={{ fontSize: "1.15rem", fontWeight: 400 }}
              >
                The intention was there. The plan wasn&apos;t. Another weekend
                gone to with no motion.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
