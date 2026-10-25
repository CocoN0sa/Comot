import React, { useEffect, useState } from "react";
import Fab from "./components/Fab";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Experience from "./pages/Experience";
import Profile from "./pages/Profile";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import ListYourVenue from "./pages/ListYourVenue";
import AdminDashboard from "./pages/AdminDashboard";
import { hasRegisteredAccount } from "./utils/account";

function getInitialPage() {
  if (window.location.pathname.replace(/\/$/, "") === "/admin") return "admin";
  if (new URLSearchParams(window.location.search).has("venue")) {
    return hasRegisteredAccount() ? "explore" : "getstarted";
  }
  return "home";
}

export default function App() {
  const [active, setActive] = useState(getInitialPage);

  useEffect(() => {
    const syncRoute = () => setActive(getInitialPage());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigate = (page) => {
    const nextUrl = new URL(
      page === "admin" ? "/admin" : "/",
      window.location.origin,
    );
    const sharedVenueId = new URLSearchParams(window.location.search).get(
      "venue",
    );
    if (
      ["explore", "getstarted", "login"].includes(page) &&
      sharedVenueId
    ) {
      nextUrl.searchParams.set("venue", sharedVenueId);
    }
    if (
      window.location.pathname !== nextUrl.pathname ||
      window.location.search !== nextUrl.search
    ) {
      window.history.pushState({}, "", nextUrl);
    }
    setActive(page);
  };

  const showFab = ["explore", "experience", "profile"].includes(active);

  function renderPage() {
    if (active === "home") return <Home onNavigate={navigate} />;
    if (active === "explore") return <Explore onNavigate={navigate} />;
    if (active === "experience") return <Experience onNavigate={navigate} />;
    if (active === "getstarted") return <GetStarted onNavigate={navigate} />;
    if (active === "login") return <Login onNavigate={navigate} />;
    if (active === "listvenue") return <ListYourVenue onNavigate={navigate} />;
    if (active === "admin") return <AdminDashboard onNavigate={navigate} />;
    return <Profile onNavigate={navigate} />;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f7f2e8" }}
    >
      <main className="flex-1">
        <div className="mx-auto w-full">{renderPage()}</div>
      </main>

      {showFab && <Fab onClick={() => console.log("FAB clicked")} />}
    </div>
  );
}
