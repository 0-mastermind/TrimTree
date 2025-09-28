"use client"
import React from "react";
import { CircleCheck, Search } from "lucide-react";
import { redirect } from "next/navigation";

const HolidayForm = () => {
  // Sample staff data
  const staffMembers = [
    { id: 1, name: "Emma Johnson", designation: "Senior Stylist" },
    { id: 2, name: "Michael Chen", designation: "Color Specialist" },
    { id: 3, name: "Sarah Williams", designation: "Hair Stylist" },
    { id: 4, name: "James Wilson", designation: "Barber" },
    { id: 5, name: "Olivia Martinez", designation: "Salon Manager" },
    { id: 6, name: "David Brown", designation: "Assistant Stylist" },
  ];

  return (
    <div className=" p-4">      
      <div className="card bg-base-100 shadow-md rounded-box p-6">
        <form>
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span className="label-text font-semibold">Starts From</span>
              </label>
              <input
                type="date"
                className="input input-bordered focus:outline-none w-full"
              />
            </div>

            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span className="label-text font-semibold">Ends on</span>
              </label>
              <input
                type="date"
                className="input input-bordered focus:outline-none w-full"
              />
            </div>
          </div>
          
          {/* Paid Holiday Option */}
          <div className="mb-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input 
                type="checkbox" 
                className="checkbox checkbox-primary" 
              />
              <span className="label-text font-semibold">Paid Holiday</span>
            </label>
          </div>

          {/* Staff Selection */}
          <div className="border-base-300 rounded-box border p-4">
            <h5 className="text-lg font-semibold mb-4">Included Staff</h5>
            
            {/* Search and Select All */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 -left-1 top-1 pl-3 flex items-center pointer-events-none z-10 h-8 w-8">
                    <Search />
                  </div>
                  <input
                    type="search"
                    placeholder="Search staff members..."
                    className="input input-bordered pl-10 w-full focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="label cursor-pointer justify-start gap-2">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary" 
                  />
                  <span className="label-text font-semibold">Select All</span>
                </label>
              </div>
            </div>
            
            {/* Staff member list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
              {staffMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="card card-side bg-base-100 shadow-sm border border-base-300 p-3 flex items-center"
                >
                  <div className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary" 
                    />
                    
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img src="/user.png" alt={member.name} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-base-content truncate">{member.name}</h4>
                      <p className="text-xs text-base-content/70 truncate">{member.designation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
              onClick={() => redirect("/dashboard/manager/set-holiday")}>
              <CircleCheck className="h-4 w-4 md:h-5 md:w-5" /> Set Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayForm;