import React from "react";
import TopNav from "../components/TopNav";

export default function Experience({ onNavigate }) {
  return (
    <div className="simple-page">
      <div className="simple-page-inner">
        <TopNav active="experience" onNavigate={onNavigate} />
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        <p className="text-sm text-gray-600">
          Placeholder content for Experience page.
        </p>
      </div>
    </div>
  );
}
