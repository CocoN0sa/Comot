import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/images/comot logo.png";

export default function GetStarted({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    location: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("comot_remember_email");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "rememberMe") {
      setRememberMe(checked);
      if (checked) {
        localStorage.setItem("comot_remember_email", formData.email);
      } else {
        localStorage.removeItem("comot_remember_email");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.username || !formData.email || !formData.location || !formData.phone) {
        setError("Please fill in all fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Simulate sending verification email
      setError("");
      setStep(3);
    } else if (step === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      // Don't go back from success screen
    } else {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        if (onNavigate) onNavigate("explore");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onNavigate]);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const locations = [
    { value: "", label: "Select your city" },
    { value: "Abuja", label: "Abuja" },
    { value: "Lagos", label: "Lagos" },
    { value: "Port Harcourt", label: "Port Harcourt" },
    { value: "Benin City", label: "Benin City" },
  ];

  const handleLocationSelect = (value) => {
    setFormData({ ...formData, location: value });
    setIsLocationOpen(false);
  };

  const selectedLocation = locations.find((l) => l.value === formData.location);

  return (
    <div style={{ height: "100vh", width: "100%", background: "#f7f2e8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px", boxSizing: "border-box" }}>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#f7f2e8", height: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxSizing: "border-box" }}>
        <img src={Logo} alt="COMOT logo" style={{ height: "44px", width: "auto", maxWidth: "170px" }} />
        <button onClick={() => onNavigate && onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#263b5b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </header>
      <div style={{ maxWidth: "380px", width: "100%", marginLeft: "auto", marginRight: "auto", boxSizing: "border-box", marginTop: "50px" }}>
        {step !== 4 && (
        <div style={{ textAlign: "center", marginTop: "-100px", marginBottom: "24px" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 8px", color: "#c1735c" }}>
            <circle cx="12" cy="12" r="10" stroke="#c1735c" strokeWidth="2" />
            <path d="M8 12l3 3 5-5" stroke="#c1735c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#263b5b", margin: "0 0 6px" }}>
            Welcome to COMOT
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.4 }}>
            Create your account to discover and experience
          </p>
        </div>
        )}

        <div style={{ background: "#fff", borderRadius: "20px", padding: "12px", boxShadow: "0 4px 24px rgba(38,59,91,0.08)" }}>
          {step !== 4 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: step >= 1 ? "#c1735c" : "#eadfce" }} />
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: step >= 2 ? "#c1735c" : "#eadfce" }} />
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: step >= 3 ? "#c1735c" : "#eadfce" }} />
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: step >= 4 ? "#c1735c" : "#eadfce" }} />
          </div>
          )}

          <form onSubmit={handleNext}>
            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c", padding: "10px 12px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", fontWeight: 500, textAlign: "center" }}>
                {error}
              </div>
            )}
            {step === 1 && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#263b5b", marginBottom: "6px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setFormData({ ...formData, fullName: filtered });
                    setError("");
                  }}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    background: "#faf9f7",
                  }}
                  autoComplete="name"
                />
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#263b5b", marginTop: "16px", marginBottom: "6px" }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^a-zA-Z0-9_.]/g, "");
                    setFormData({ ...formData, username: filtered });
                    setError("");
                  }}
                  placeholder="Nickname"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    background: "#faf9f7",
                  }}
                  autoComplete="username"
                />
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#263b5b", marginTop: "16px", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    background: "#faf9f7",
                  }}
                  autoComplete="email"
                />
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#263b5b", marginTop: "16px", marginBottom: "8px" }}>
                  Location
                </label>
                <div ref={locationRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #eadfce",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      background: "#faf9f7",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: selectedLocation && selectedLocation.value ? "#263b5b" : "#9ca3af",
                    }}
                  >
                    <span>{selectedLocation ? selectedLocation.label : "Select your city"}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isLocationOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                        marginLeft: "12px",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isLocationOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        right: 0,
                        background: "#1a2a4a",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px rgba(26, 42, 74, 0.3), 0 0 0 1px rgba(255,255,255,0.05)",
                        zIndex: 50,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {locations.map((loc) => (
                        <button
                          key={loc.value}
                          type="button"
                          onClick={() => handleLocationSelect(loc.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                            color: loc.value === formData.location ? "#fff" : "#e5e7eb",
                            transition: "background 0.15s ease, color 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "rgba(255,255,255,0.08)";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = loc.value === formData.location ? "#fff" : "#e5e7eb";
                          }}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#263b5b", marginTop: "16px", marginBottom: "8px" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, phone: filtered });
                    setError("");
                  }}
                  placeholder="+234 8XX XXX XXXX"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    background: "#faf9f7",
                  }}
                  autoComplete="tel"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#263b5b", margin: "0 0 8px" }}>
                    Verify your email
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                    We've sent a verification link to <strong>{formData.email}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#c1735c",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    marginBottom: "12px",
                  }}
                >
                  I've verified my email
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    background: "#fff",
                    color: "#263b5b",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Resend link
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#263b5b", marginBottom: "6px" }}>
                  Create Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    background: "#faf9f7",
                  }}
                  autoComplete="new-password"
                />
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#263b5b", marginTop: "16px", marginBottom: "8px" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    background: "#faf9f7",
                  }}
                  autoComplete="new-password"
                />
                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", fontSize: "13px", color: "#263b5b", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={handleChange}
                    style={{ width: "18px", height: "18px", accentColor: "#c1735c" }}
                  />
                  <span style={{ fontWeight: 500 }}>Remember me</span>
                </label>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "16px", lineHeight: 1.5, textAlign: "center" }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}

            {step === 4 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ 
                  width: "80px", 
                  height: "80px", 
                  borderRadius: "50%", 
                  background: "#e8f5e9", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 20px",
                  animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#263b5b", margin: "0 0 8px", animation: "fadeInUp 0.6s ease 0.1s both" }}>
                  Account Successfully Created!
                </h3>
                <p style={{ fontSize: "18px", fontWeight: 600, color: "#c1735c", margin: 0, animation: "fadeInUp 0.6s ease 0.2s both" }}>
                  Oya Start Exploring 😉
                </p>
                <style jsx>{`
                  @keyframes scaleIn {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #eadfce",
                    background: "#fff",
                    color: "#263b5b",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
              )}
              {step !== 2 && step !== 4 && (
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#c1735c",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(193,115,92,0.3)",
                  }}
                >
                  {step === 1 ? "Continue" : "Create Account"}
                </button>
              )}
            </div>
          </form>

          {step === 1 && (
            <p style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
              Already have an account?{" "}
              <span
                style={{ color: "#c1735c", fontWeight: 600, cursor: "pointer" }}
                onClick={() => onNavigate && onNavigate("login")}
              >
                Log in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}