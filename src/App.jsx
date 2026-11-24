import React, { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Experience from "./pages/Experience";
import Profile from "./pages/Profile";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import ListYourVenue from "./pages/ListYourVenue";
import AdminDashboard from "./pages/AdminDashboard";
import VenueDetail from "./pages/VenueDetail";
import ExperienceDetail from "./pages/ExperienceDetail";
import { hasRegisteredAccount } from "./utils/account";
import { experienceHostSteps } from "./utils/experienceRoutes";

function getInitialPage() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  const hostStep = experienceHostSteps.find((item) => item.path === pathname);
  if (hostStep) return hostStep.page;
  if (pathname === "/admin") return "admin";
  if (pathname.startsWith("/venue/")) return "venue";
  if (pathname.startsWith("/experience/") && !pathname.startsWith("/experience/host/")) return "experience-detail";
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

  const navigate = (page, itemId) => {
    const hostStep = experienceHostSteps.find((item) => item.page === page);
    const nextPath =
      hostStep
        ? hostStep.path
        : page === "admin"
          ? "/admin"
          : page === "venue" && itemId
            ? `/venue/${encodeURIComponent(itemId)}`
            : page === "experience-detail" && itemId
              ? `/experience/${encodeURIComponent(itemId)}`
              : "/";
    const nextUrl = new URL(nextPath, window.location.origin);
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

  const showBottomNav = ["explore", "experience", "profile"].includes(active);
  const experienceStep = experienceHostSteps.findIndex(
    (item) => item.page === active,
  );

  function renderPage() {
    if (active === "home") return <Home onNavigate={navigate} />;
    if (active === "explore") return <Explore onNavigate={navigate} />;
    if (active === "venue") return <VenueDetail onNavigate={navigate} />;
    if (active === "experience-detail") return <ExperienceDetail onNavigate={navigate} />;
    if (active === "experience" || experienceStep !== -1) {
      return (
        <Experience
          onNavigate={navigate}
          step={experienceStep === -1 ? null : experienceStep}
        />
      );
    }
    if (active === "getstarted") return <GetStarted onNavigate={navigate} />;
    if (active === "login") return <Login onNavigate={navigate} />;
    if (active === "listvenue") return <ListYourVenue onNavigate={navigate} />;
    if (active === "admin") return <AdminDashboard onNavigate={navigate} />;
    return <Profile onNavigate={navigate} />;
  }

  return (
    <div
      className={`app-shell min-h-screen flex flex-col${showBottomNav ? " has-bottom-nav" : ""}`}
      style={{ background: "#f7f2e8" }}
    >
      <main className="flex-1">
        <div className="mx-auto w-full">{renderPage()}</div>
      </main>

      {showBottomNav && (
        <BottomNav active={active} onChange={(page) => navigate(page)} />
      )}
    </div>
  );
}
