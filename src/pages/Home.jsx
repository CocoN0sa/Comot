import React, { useState } from "react";
import Logo from "../assets/images/comot logo.png";
import ImageOne from "../assets/images/comotimg1.jpg";
import ImageTwo from "../assets/images/comotimg2.webp";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f2e8] text-slate-900">
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
                className="bg-transparent flex items-center justify-center rounded-full py-3.5 text-[0.92rem] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "none",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#ffffff",
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
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background = "transparent";
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
                className="bg-transparent flex items-center justify-center rounded-full border py-3.5 text-[0.92rem] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "none",
                  backgroundColor: "transparent",
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "#ffffff",
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
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.background = "transparent";
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

        <section className="relative mx-auto mt-[5%] w-[95%] overflow-hidden rounded-[30px_30px_0_0] bg-white shadow-[0_24px_60px_rgba(38,59,91,0.12)]">
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
            className="flow-root bg-[#c1735c] px-[5%] pb-5 pt-4 text-left"
            style={{
              background: "#263b5b",
              boxShadow:
                "inset 0 10px 16px -20px rgba(38,59,91,0.2), inset 0 -10px 16px -20px rgba(38,59,91,0.2)",
              padding: "30px 5%",
              marginTop: "-4px",
              marginBottom: "-4px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              className="text-[0.95rem] font-semibold leading-[1.2] tracking-[-0.04em] text-white"
              style={{ margin: 0, lineHeight: 1.2, color: "#ffffff" }}
            >
              Meet strangers.
              <span className="mt-1 block text-white">
                One table. Zero awkwardness.
              </span>
            </p>
          </div>
        </section>

        <section
          className="relative mx-auto mt-0 w-[95%] overflow-hidden rounded-[0_0_30px_30px] bg-[#c1735c] shadow-[0_24px_60px_rgba(38,59,91,0.12)]"
          style={{ backgroundColor: "#c1735c" }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 220,
              backgroundColor: "#263b5b",
            }}
          />
          <div
            className="relative h-[220px] w-full overflow-hidden rounded-t-[44px]"
            style={{
              borderTopLeftRadius: "44px",
              borderTopRightRadius: "44px",
              backgroundColor: "#263b5b",
            }}
          >
            <img
              src={ImageTwo}
              alt="People sharing an experience"
              className="h-full w-full rounded-t-[44px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263b5b]/80 via-[#263b5b]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f8e8df]">
                Make it social
              </p>
              <h2 className="mt-2 text-[1.4rem] font-bold leading-[1.1] tracking-[-0.05em]">
                Bring your people.
              </h2>
            </div>
          </div>

          <div
            className="bg-[#c1735c] px-[5%] pb-10 pt-4 text-left"
            style={{ backgroundColor: "#c1735c", paddingBottom: "40px" }}
          >
            <p
              className="text-[1.2rem] font-extrabold leading-[1.25] tracking-[-0.04em] text-white"
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#ffffff",
                marginTop: "40px",
              }}
            >
              The going out plan that never happens.
            </p>
            <button
              type="button"
              aria-pressed={selectedCard === 0}
              onClick={() => setSelectedCard(0)}
              className={`relative mr-[8%] mt-5 block w-[92%] overflow-hidden rounded-[20px_20px_20px_6px] border bg-[#fffaf7] px-6 py-5 text-left text-[#263b5b] shadow-[0_8px_20px_rgba(38,59,91,0.12)] transition-all duration-300 hover:-translate-y-0.5 ${selectedCard === 0 ? "translate-x-[3%] scale-[1.02] border-[#c1735c] ring-2 ring-[#c1735c]/30" : "border-[#eadfce] opacity-80"}`}
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                padding: "0 12px",
                backgroundColor: "#f7f2e8",
                marginTop: "40px",
              }}
            >
              <p
                className="text-[1rem] font-semibold leading-[1.25] tracking-[-0.04em]"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                Don&apos;t know where to go?
              </p>
              <p
                className="mt-2 text-[0.85rem] font-normal leading-[1.4] tracking-normal"
                style={{ fontSize: "0.85rem", fontWeight: 400 }}
              >
                Finding places in Nigerian cities still means relying on
                forwards, guesswork, and outdated pages.
              </p>
            </button>
            <button
              type="button"
              aria-pressed={selectedCard === 1}
              onClick={() => setSelectedCard(1)}
              className={`relative ml-[8%] mt-5 block w-[92%] overflow-hidden rounded-[20px_20px_6px_20px] border bg-[#fffaf7] px-6 py-5 text-left text-[#263b5b] shadow-[0_8px_20px_rgba(38,59,91,0.12)] transition-all duration-300 hover:-translate-y-0.5 ${selectedCard === 1 ? "-translate-x-[3%] scale-[1.02] border-[#c1735c] ring-2 ring-[#c1735c]/30" : "border-[#eadfce] opacity-80"}`}
              style={{
                backgroundColor: "#f7f2e8",
                padding: "0 12px",
                marginTop: "40px",
              }}
            >
              <p
                className="text-[1rem] font-semibold leading-[1.25] tracking-[-0.04em]"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                Nobody to go with?
              </p>
              <p
                className="mt-0 text-[0.85rem] font-normal leading-[1.4] tracking-normal"
                style={{ fontSize: "0.85rem", fontWeight: 400 }}
              >
                Coordinating an outing is harder than it should be. Several
                people, one group chat, no decision.
              </p>
            </button>
            <button
              type="button"
              aria-pressed={selectedCard === 2}
              onClick={() => setSelectedCard(2)}
              className={`relative mr-[8%] mt-5 block w-[92%] overflow-hidden rounded-[20px_20px_20px_6px] border bg-[#fffaf7] px-6 py-5 text-left text-[#263b5b] shadow-[0_8px_20px_rgba(38,59,91,0.12)] transition-all duration-300 hover:-translate-y-0.5 ${selectedCard === 2 ? "translate-x-[3%] scale-[1.02] border-[#c1735c] ring-2 ring-[#c1735c]/30" : "border-[#eadfce] opacity-80"}`}
              style={{
                backgroundColor: "#f7f2e8",
                padding: "0 12px 24px",
                marginTop: "40px",
              }}
            >
              <p
                className="text-[1rem] font-semibold leading-[1.25] tracking-[-0.04em]"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                Staying home again?
              </p>
              <p
                className="mt-0 text-[0.85rem] font-normal leading-[1.4] tracking-normal"
                style={{ fontSize: "0.85rem", fontWeight: 400 }}
              >
                The intention was there. The plan wasn&apos;t. Another weekend
                gone to with no motion.
              </p>
            </button>
          </div>
        </section>

        <section
          className="relative mx-auto mt-10 w-[95%] px-[8%] py-8 text-left"
          style={{ marginTop: "60px" }}
        >
          <p
            className="text-xl font-bold text-[#263b5b]"
            style={{ fontSize: "1.25rem", fontWeight: 700 }}
          >
            How it works
          </p>
          <div
            className="mt-4 text-[#c1735c]"
            aria-hidden="true"
            style={{ marginTop: "40px" }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M15 27s9-7.2 9-14A9 9 0 1 0 6 13c0 6.8 9 14 9 14Z"
                fill="currentColor"
              />
              <circle cx="15" cy="13" r="3.2" fill="#f7f2e8" />
            </svg>
          </div>
          <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#c1735c]">
            Step 01
          </p>
          <p
            className="mt-2 text-base font-semibold text-black"
            style={{ fontWeight: 600 }}
          >
            Browse
          </p>
          <p className="mt-2 max-w-[280px] text-sm font-light leading-5 text-[#6b7280]">
            Venues and experiences in your city, sorted by vibes needed.
          </p>
          <div
            className="mt-7 text-[#c1735c]"
            aria-hidden="true"
            style={{ marginTop: "40px" }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect
                x="4"
                y="6"
                width="22"
                height="20"
                rx="4"
                fill="currentColor"
              />
              <path d="M4 11h22" stroke="#f7f2e8" strokeWidth="2" />
              <path
                d="M9 4v5M21 4v5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="m9 18 3 3 8-8"
                stroke="#f7f2e8"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#c1735c]">
            STEP 02
          </p>
          <p
            className="mt-2 text-base font-semibold text-black"
            style={{ fontWeight: 600 }}
          >
            Register or save
          </p>
          <p className="mt-2 max-w-[280px] text-sm font-light leading-5 text-[#6b7280]">
            Book a curated group outing, or save the spots you&apos;re keeping
            for later.
          </p>
          <div
            className="mt-7 text-[#c1735c]"
            aria-hidden="true"
            style={{ marginTop: "40px" }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 40 40"
              fill="none"
              style={{ transform: "rotate(20deg)", transformOrigin: "center" }}
            >
              <path
                d="M9 13h22L20 34h-2L9 13Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M8 12.5h24"
                stroke="#f7f2e8"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M17 8V3M10 9 7 5M24 9l3-4M7 14H3M27 14h5"
                stroke="#263b5b"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="17" cy="3" r="1.6" fill="#c1735c" />
              <circle cx="7" cy="5" r="1.6" fill="#263b5b" />
              <circle cx="27" cy="5" r="1.6" fill="#c1735c" />
              <path
                d="m14 17 7 13"
                stroke="#f7f2e8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#c1735c]">
            STEP 03
          </p>
          <p
            className="mt-2 text-base font-semibold text-black"
            style={{ fontWeight: 600 }}
          >
            Show up
          </p>
          <p className="mt-2 max-w-[280px] text-sm font-light leading-5 text-[#6b7280]">
            Meet people, experience your city, leave with new friends and a
            story.
          </p>
        </section>

        <section
          className="relative mx-auto mt-4 w-[95%] bg-white px-[8%] pb-8 pt-12 text-left"
          style={{
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
            overflow: "hidden",
            paddingTop: "64px",
          }}
        >
          <p
            className="text-2xl font-bold text-black"
            style={{ fontSize: "1.5rem", fontWeight: 700 }}
          >
            What you get
          </p>
          <div
            className="mt-6 flex min-h-[180px] flex-col items-start justify-start rounded-[24px] bg-[#263b5b] p-6"
            style={{
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              padding: "24px",
              marginTop: "40px",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 54 54"
              fill="none"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              <circle
                cx="27"
                cy="27"
                r="20"
                stroke="#f6d7c5"
                strokeWidth="2.2"
              />
              <path
                d="m34 20-5 10-10 5 5-10 10-5Z"
                fill="#c1735c"
                stroke="#f6d7c5"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="27" cy="27" r="2" fill="#f6d7c5" />
            </svg>
            <p
              className="text-2xl font-extrabold text-[#c1735c]"
              style={{
                margin: 0,
                marginTop: "16px",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#c1735c",
              }}
            >
              Explore
            </p>
            <p
              className="max-w-[280px] text-sm font-light leading-5 text-[#f8e8df]"
              style={{ margin: 0, marginTop: "12px", marginBottom: "12px" }}
            >
              Browse restaurants, parks, bars, and hidden gems in Abuja. Filter
              by vibe, budget, and occasion.
            </p>
          </div>
          <div
            className="mt-6 flex min-h-[180px] flex-col items-start justify-start rounded-[24px] bg-[#c1735c] p-6"
            style={{
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              padding: "24px",
              marginTop: "24px",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 54 54"
              fill="none"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              <circle cx="19" cy="15" r="4" fill="#f6d7c5" />
              <circle cx="35" cy="15" r="4" fill="#f6d7c5" />
              <path
                d="M13 24c0-3.3 2.7-6 6-6s6 2.7 6 6v10h-12V24Z"
                fill="#f6d7c5"
                opacity="0.8"
              />
              <path
                d="M29 24c0-3.3 2.7-6 6-6s6 2.7 6 6v10h-12V24Z"
                fill="#f6d7c5"
              />
            </svg>
            <p
              className="text-2xl font-extrabold text-white"
              style={{
                margin: 0,
                marginTop: "16px",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Experience
            </p>
            <p
              className="max-w-[280px] text-sm font-light leading-5 text-[#f8e8df]"
              style={{ margin: 0, marginTop: "12px", marginBottom: "12px" }}
            >
              Join curated group outings with strangers who become friends.
              Female only, Male only or mixed.
            </p>
          </div>
          <div
            className="mt-6 flex min-h-[180px] flex-col items-start justify-start rounded-[24px] bg-white p-6"
            style={{
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              padding: "24px",
              marginTop: "24px",
              border: "1px solid #c1735c",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 54 54"
                fill="none"
                aria-hidden="true"
                style={{ display: "block" }}
              >
                <path
                  d="M27 45C13.2 38.4 8 30.6 8 22c0-7.7 6.3-14 14-14 4.2 0 8.1 1.8 10.9 4.7 2.8-2.9 6.7-4.7 10.9-4.7 7.7 0 14 6.3 14 14 0 8.6-5.2 16.4-19 23Z"
                  fill="#c1735c"
                />
              </svg>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  padding: "6px 10px",
                  backgroundColor: "#fff5f2",
                  borderRadius: "8px",
                  border: "1px solid #c1735c",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill="#c1735c"
                  />
                </svg>
                <p
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: "#c1735c",
                    margin: "0",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Coming soon
                </p>
              </div>
            </div>
            <p
              className="text-2xl font-extrabold text-[#c1735c]"
              style={{
                margin: 0,
                marginTop: "16px",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#c1735c",
              }}
            >
              Match
            </p>
            <p
              className="max-w-[280px] text-sm font-light leading-5 text-gray-600"
              style={{ margin: 0, marginTop: "12px", marginBottom: "12px" }}
            >
              Tell us your mood and budget. Our recommendation engine finds your
              perfect spot.
            </p>
          </div>
        </section>

        <section
          className="relative mx-auto w-full py-24 text-center"
          style={{
            backgroundColor: "#c1735c",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="mx-auto w-[95%] max-w-[600px]">
            <p
              className="text-3xl font-bold text-white"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Built for the Nigerian who wants more from their city.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
