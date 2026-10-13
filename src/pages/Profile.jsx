import React from "react";
import TopNav from "../components/TopNav";

export default function Profile({ onNavigate }) {
  return (
    <div className="simple-page">
      <div className="simple-page-inner">
        <TopNav active="profile" onNavigate={onNavigate} />
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p className="text-sm text-gray-600">
          Placeholder content for Profile page.
        </p>
      </div>
    </div>
  );
}
