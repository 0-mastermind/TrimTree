"use client";
import { useState } from "react";
import Approvals from "./Approvals";
import Presenties from "./Presenties";
import Absenties from "./Absenties";

enum ManagerTabState {
  approvals = "approvals",
  presenties = "presenties",
  absenties = "absenties",
}

const DetailsToday = () => {
  const [tab, setTab] = useState<ManagerTabState>(ManagerTabState.approvals);

  const handleTabClick = (tabname: ManagerTabState) => {
    setTab(tabname);
  };

  return (
    <div className="mt-4">
      <nav className="flex gap-4">
        <div
          className={`flex-1 text-center p-3 hover:bg-gray-200 rounded-md transition-all duration-75 ${
            ManagerTabState.approvals === tab ? "bg-gray-200" : "bg-transparent"
          }`}
          onClick={() => handleTabClick(ManagerTabState.approvals)}>
          Approvals
        </div>
        <div
          className={`flex-1 text-center p-3 hover:bg-gray-200 rounded-md transition-all duration-75 ${
            ManagerTabState.presenties === tab
              ? "bg-gray-200"
              : "bg-transparent"
          }`}
          onClick={() => handleTabClick(ManagerTabState.presenties)}>
          Presenties
        </div>
        <div
          className={`flex-1 text-center p-3 hover:bg-gray-200 rounded-md transition-all duration-75 ${
            ManagerTabState.absenties === tab ? "bg-gray-200" : "bg-transparent"
          }`}
          onClick={() => handleTabClick(ManagerTabState.absenties)}>
          Absenties
        </div>
      </nav>
      <div>
        {tab === ManagerTabState.approvals && <Approvals /> }
        {tab === ManagerTabState.presenties && <Presenties /> }
        {tab === ManagerTabState.absenties && <Absenties /> }
      </div>
    </div>
  );
};

export default DetailsToday;
