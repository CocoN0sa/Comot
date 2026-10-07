import React, { useState, useEffect } from "react";
import Logo from "../assets/images/comot logo.png";

export default function Login({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        if (onNavigate) onNavigate("explore");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, onNavigate]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setStep(2);
  };

  const navigateToGetStarted = () => {
    if (onNavigate) onNavigate("getstarted");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f2e8", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
      <header style={{ width: "100%", background: "#f7f2e8", height: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxSizing: "border-box" }}>
        <img src={Logo} alt="COMOT logo" style={{ height: "32px", width: "auto", maxWidth: "130px" }} />
        <button onClick={() => onNavigate && onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#263b5b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </header>
      <div style={{ maxWidth: "380px", width: "100%", marginLeft: "auto", marginRight: "auto", boxSizing: "border-box", marginTop: "24px", overflowY: "auto", maxHeight: "calc(100vh - 40px)", paddingBottom: "20px" }}>
        {step === 1 && (
          <>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 6px", color: "#c1735c" }}>
                <circle cx="12" cy="12" r="10" stroke="#c1735c" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#c1735c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#263b5b", margin: "0 0 4px" }}>
                Welcome back
              </h1>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.4 }}>
                Sign in to discover and experience
              </p>
            </div>

            <div style={{ background: "#fff", borderRadius: "20px", padding: "12px", boxShadow: "0 4px 24px rgba(38,59,91,0.08)" }}>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c", padding: "10px 12px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", fontWeight: 500, textAlign: "center" }}>
                    {error}
                  </div>
                )}
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#263b5b", marginBottom: "6px" }}>
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
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#263b5b", marginTop: "16px", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
              autoComplete="current-password"
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
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <span style={{ color: "#c1735c", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
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
                Sign In
              </button>
            </div>
            <button
              type="button"
              onClick={() => alert("Google Login coming soon!")}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #dadce0",
                background: "#fff",
                color: "#3c4043",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.22c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12px", color: "#6b7280" }}>
            Don't have an account?{" "}
            <span
              style={{ color: "#c1735c", fontWeight: 600, cursor: "pointer" }}
              onClick={navigateToGetStarted}
            >
              Sign Up
            </span>
          </p>
        </div>
          </>
        )}

        {step === 2 && (
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
              Welcome back!
            </h3>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#c1735c", margin: 0, animation: "fadeInUp 0.6s ease 0.2s both" }}>
              Oya Start Exploring 😉
            </p>
            <style>{`
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
      </div>
    </div>
  );
}