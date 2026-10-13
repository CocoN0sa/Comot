import React, { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Fab from "./components/Fab";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Experience from "./pages/Experience";
import Profile from "./pages/Profile";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import ListYourVenue from "./pages/ListYourVenue";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [active, setActive] = useState(() =>
    window.location.pathname.replace(/\/$/, "") === "/admin" ? "admin" : "home",
  );

  useEffect(() => {
    const syncRoute = () =>
      setActive(
        window.location.pathname.replace(/\/$/, "") === "/admin"
          ? "admin"
          : "home",
      );
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigate = (page) => {
    const nextPath = page === "admin" ? "/admin" : "/";
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setActive(page);
  };

  const showBottomNav = ["explore", "experience", "profile"].includes(active);

  function renderPage() {
    if (active === "home") return <Home onNavigate={navigate} />;
    if (active === "explore") return <Explore />;
    if (active === "experience") return <Experience />;
    if (active === "getstarted") return <GetStarted onNavigate={navigate} />;
    if (active === "login") return <Login onNavigate={navigate} />;
    if (active === "listvenue") return <ListYourVenue onNavigate={navigate} />;
    if (active === "admin") return <AdminDashboard onNavigate={navigate} />;
    return <Profile />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f7f2e8" }}
    >
      <main className="flex-1 bottom-safe">
        <div className="mx-auto w-full">{renderPage()}</div>
      </main>

      {showBottomNav && (
        <>
          <Fab onClick={() => console.log("FAB clicked")} />
          <BottomNav active={active} onChange={navigate} />
        </>
      )}
    </div>
  );
}
