import React from "react";
import RecentRaces from "./RecentRaces";
import TopRacers from "./TopRacers";
export default function SideBar({ top = true, recent = false }) {
  return (
    <div className="sidebar">
      {recent ? <RecentRaces noNames noScore /> : ""}
      {top ? <TopRacers noNames /> : ""}
    </div>
  );
}
