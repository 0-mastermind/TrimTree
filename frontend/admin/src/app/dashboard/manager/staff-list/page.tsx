"use client";
import StaffCard from "@/components/StaffCard";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getEmployeesByManager } from "@/utils/api/staff";
import { useEffect } from "react";

const ViewManagerStaffList = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        await dispatch(getEmployeesByManager());
      } catch (error) {
        console.error("Error while fetching employees", error);
      }
    };
    fetchEmployees();
  }, [dispatch]);

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {employees ? (
          employees.map((item) => {
            return (
              <StaffCard
                imageUrl={item.userId.image?.url || "/user.png"}
                designation={item.designation!}
                name={item.userId.name}
                branchName={item.userId.branch.name}
                key={item._id}
              />
            );
          })
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default ViewManagerStaffList;
