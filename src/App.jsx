import React, { useState } from "react";
import BottomNav from "./components/BottomNav";
import Fab from "./components/Fab";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Experience from "./pages/Experience";
import Profile from "./pages/Profile";

export default function App() {
  const [active, setActive] = useState("home");

  function renderPage() {
    if (active === "home") return <Home />;
    if (active === "explore") return <Explore />;
    if (active === "experience") return <Experience />;
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

      <Fab onClick={() => console.log("FAB clicked")} />
      <BottomNav active={active} onChange={setActive} />
    </div>
  );
}
