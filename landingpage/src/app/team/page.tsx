"use client";
import employees from "@/components/our-team/data";
import EmployeeCard from "@/components/our-team/EmployeeCard";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Team = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative px-6 md:px-12 lg:px-20 pt-8 pb-16 md:pb-20">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[var(--text-primary)] mb-8 md:mb-12 group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
            <ArrowLeft className="w-5 h-5 text-black" />
          </div>
          <span className="font-medium">Back</span>
        </button>   

        {/* Title Section */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block">
            <span className="text-sm font-semibold tracking-wider uppercase text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
              Our Team
            </span>
          </div>
          <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
            Meet the experts behind your perfect hair
          </h1>

          <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
            Our talented team of professionals is dedicated to bringing out the
            best in you
          </h6>
        </div>
      </div>

      {/* Team Grid Section */}
      <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {employees.map((employee, index) => (
              <div
                key={index}
                className="transform transition-all duration-300"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                  opacity: 0,
                }}
              >
                <EmployeeCard employee={employee} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Team;
