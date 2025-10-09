"use client";
import Approvals from "./Approvals";

const DetailsToday = () => {
  return (
    <div className="mt-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Attendance Management
        </h2>
        <p className="text-gray-600">
          Review and manage pending attendance requests from your team
        </p>
      </div>
      
      <div>
        <Approvals />
      </div>
    </div>
  );
};

export default DetailsToday;