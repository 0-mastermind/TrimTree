"use client";
import React from "react";
import EmployeeCard from "./EmployeeCard";
import { Employee } from "@/types/type";
import { employeesData } from "./data";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomEmployees<T extends Employee>(
  array: T[],
  count: number,
  prevSet: Set<string> = new Set()
): T[] {
  if (array.length <= count) return [...array];

  let attempt = 0;
  let selection: T[] = [];
  const maxAttempts = 5;

  do {
    selection = shuffleArray(array).slice(0, count);
    attempt++;
    const overlap = selection.filter((e) =>
      prevSet.has(getEmployeeId(e))
    ).length;
    if (overlap < Math.floor(count / 2) || attempt > maxAttempts) break;
  } while (attempt <= maxAttempts);

  return selection;
}

function getEmployeeId(employee: Employee): string {
  return String(employee._id || employee.userId.name || Math.random());
}

const Team: React.FC = () => {
  return (
    <div id="team" className="py-20 px-3 transition-colors duration-300">
      <h1 className="my-4 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-gray-900 dark:text-white transition-colors duration-300 font-bold">
        Meet the experts behind your perfect look
      </h1>
      <div
        className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 mt-20 mb-10"
        style={{ perspective: "1500px" }}>
        {employeesData.map((employee, index) => (
          <div key={index}>
            <EmployeeCard
              name={employee.name}
              image={employee.image}
              designation={employee.designation}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
