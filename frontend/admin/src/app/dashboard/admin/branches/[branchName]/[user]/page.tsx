"use client";
import { attendanceData, metricsData } from "@/data/data";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import Image from "next/image";
import "@/app/calendar.css";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addEmployeeBonus,
  deleteStaffMember,
  getSpecificEmployeeAnalytics,
  getSpecificEmployeeDetails,
  markEmployeePaymentAsPaid,
  removeEmployeeBonus,
} from "@/utils/api/staff";
import PaycheckDetails from "@/components/admin/PaycheckDetails";
import { Bonus, Payment } from "@/types/global";
import StaffCalendarAnalytics from "@/components/admin/StaffCalendarAnalytics";
import { authenticateUser } from "@/utils/api/auth";
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

const User = () => {
  const [deleteUserSection, setDeleteUserSection] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useAppDispatch();
  const staffId = useSearchParams().get("id");
  const router = useRouter();
  const { selectedEmployee, employeeAnalytics } = useAppSelector(
    (state) => state.employees
  );

  const fetchEmployeeData = useCallback(async () => {
    try {
      await dispatch(getSpecificEmployeeDetails(staffId as string));
    } catch (error) {
      console.error("Error! while fetching employees details", error);
    }
  }, []);

  const fetchEmployeeAnalytics = useCallback(async () => {
    if (!selectedEmployee) return;

    try {
      const payments = selectedEmployee.payments;
      const previousPayments = payments[payments.length - 1];
      const lastToDate = new Date(previousPayments?.to);

      await dispatch(
        getSpecificEmployeeAnalytics({
          userId: selectedEmployee.userId._id,
          staffId: selectedEmployee._id,
          date: lastToDate.toISOString().split("T")[0],
        })
      );
    } catch (error) {
      console.error("Error! while fetching employees analytics", error);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    if (!selectedEmployee) return;
    fetchEmployeeAnalytics();
  }, [selectedEmployee]);

  const handleEmployeeDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmEmployeeDelete = async () => {
    if (!password.trim()) {
      alert("Please enter your password to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      // authenticating user
      const isAuthenticated = await dispatch(authenticateUser(password));

      if (!isAuthenticated) return;

      // deleting employee
      const isDeleted = await dispatch(
        deleteStaffMember(selectedEmployee?.userId._id as string)
      );

      if (isDeleted) {
        router.push("/dashboard/admin/branches");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPassword("");
    }
  };

  const cancelEmployeeDelete = () => {
    setIsDeleteDialogOpen(false);
    setPassword("");
  };

  const handleAddBonus = async (bonusData: Bonus) => {
    await dispatch(
      addEmployeeBonus({
        formData: bonusData,
        staffId: staffId as string,
      })
    );
    await fetchEmployeeData();
  };

  const handleRemoveBonus = async (bonusDate: string) => {
    await dispatch(
      removeEmployeeBonus({ date: bonusDate, staffId: staffId as string })
    );

    await fetchEmployeeData();
  };

  const handleMarkAsPaymentChange = async (paymentData: Payment) => {
    await dispatch(
      markEmployeePaymentAsPaid({
        data: paymentData,
        staffId: staffId as string,
      })
    );

    // Fetch both employee details and analytics after marking as paid
    await fetchEmployeeData();
    await fetchEmployeeAnalytics();
  };

  if (!selectedEmployee) {
    return <div></div>;
  }

  return (
    <div className="mt-6 p-2">
      {/* User Details */}
      <div className="flex gap-4 ">
        <div className="flex items-center justify-center">
          <Image
            src={selectedEmployee.userId.image?.url || "/user.png"}
            alt="Employee avatar"
            height={100}
            width={100}
            className="rounded-full object-cover aspect-square shadow-md border border-gray-200"
            priority
          />
        </div>

        <div>
          <h1 className="text-xl font-semibold">
            {selectedEmployee.userId.name}
          </h1>
          <p className="text-black/60 mt-1">{selectedEmployee.designation}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Days Present */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalPresent}
            </h1>
            <p className="text-sm text-black mt-2">Total Days Present</p>
          </div>

          {/* Full Day Present */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalFullDayPresent}
            </h1>
            <p className="text-sm text-black mt-2">Full Day Present</p>
          </div>

          {/* Half Day Present */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalHalfDayPresent}
            </h1>
            <p className="text-sm text-black mt-2">Half Day Present</p>
          </div>

          {/* Total Absent */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalAbsent}
            </h1>
            <p className="text-sm text-black mt-2">Total Absent</p>
          </div>

          {/* Total Leave */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalLeave}
            </h1>
            <p className="text-sm text-black mt-2">Total Leave</p>
          </div>

          {/* Paid Holiday */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalPaidHoliday}
            </h1>
            <p className="text-sm text-black mt-2">Paid Holiday</p>
          </div>

          {/* Working Holiday */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalWorkingHoliday}
            </h1>
            <p className="text-sm text-black mt-2">Working Holiday</p>
          </div>

          {/* Total Days */}
          <div className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
            <h1 className="text-4xl font-semibold">
              {employeeAnalytics?.attendance.totalDays}
            </h1>
            <p className="text-sm text-black mt-2">Total Days</p>
          </div>
        </div>

        <div className="mt-6">
          {/* Paycheck details */}
          {employeeAnalytics && (
            <PaycheckDetails
              salary={employeeAnalytics.salary}
              payments={selectedEmployee.payments}
              bonuses={selectedEmployee.bonus}
              onMarkAsPaid={(paymentData) =>
                handleMarkAsPaymentChange(paymentData)
              }
              onAddBonus={(bonusData) => handleAddBonus(bonusData)}
              onRemoveBonus={(bonusDate) => handleRemoveBonus(bonusDate)}
            />
          )}
        </div>

        {/* User Attendance */}
        <StaffCalendarAnalytics staffId={staffId as string} />

        {/* Delete user section */}
        <div className="my-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">
                Click to enable this section
              </span>
              <input
                onChange={() => setDeleteUserSection(!deleteUserSection)}
                type="checkbox"
                className="h-4 w-4"
              />
            </div>
          </div>
          <button
            className="w-full bg-red-500 p-2 text-sm mt-4 rounded-md text-white cursor-pointer disabled:bg-red-500/50 disabled:cursor-default"
            disabled={!deleteUserSection}
            title="This action will delete this employee permanantly"
            onClick={handleEmployeeDelete}>
            Remove employee
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Confirm Deletion
                </h3>
              </div>
              <button
                onClick={cancelEmployeeDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-semibold">
                    ⚠️ This action cannot be undone
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    You are about to permanently delete{" "}
                    <strong>{selectedEmployee.userId.name}</strong> and all
                    associated data.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your password to confirm
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    autoComplete="current-password"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    For security reasons, please enter your password to confirm
                    this action.
                  </p>
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cancelEmployeeDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmEmployeeDelete}
                  disabled={!password.trim() || isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Employee"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
