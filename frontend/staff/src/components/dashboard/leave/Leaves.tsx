import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  User,
  CalendarDays,
  RefreshCw,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store/hook";
import { applyForLeave, getLeaveHistory } from "@/api/attendance";
import type { leaveStatus, Leave } from "@/types/type";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Button from "@/components/common/Button";

const LeaveApplication: React.FC = () => {
  const [form, setForm] = useState<{
    startDate: string;
    endDate: string;
    reason: string;
  }>({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const dispatch = useAppDispatch();
  const pendingLeaves: Leave[] =
    useSelector((state: RootState) => state.attendance.leaveHistory) || [];

  // Filter state (month: 0-11, year: YYYY)
  const today = useMemo(() => new Date(), []);
  const [filter, setFilter] = useState<{ month: number; year: number }>({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Derived string values (YYYY and MM)
  const yearString = String(filter.year);
  const monthString = String(filter.month + 1).padStart(2, "0"); // "01".."12"

  // Precompute list of years
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr: number[] = [];
    for (let y = currentYear - 5; y <= currentYear + 2; y++) arr.push(y);
    return arr;
  }, []);

  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      await dispatch(getLeaveHistory(yearString, monthString));
      setIsLoadingHistory(false);
    };
    fetchHistory();
  }, [dispatch, yearString, monthString]);

  const toIST = (dateObj: Date | string) => {
    if (!dateObj) return "";
    const date = typeof dateObj === "string" ? new Date(dateObj) : dateObj;
    const istOffset = 5.5 * 60;
    const localOffset = date.getTimezoneOffset();
    const istTime = new Date(date.getTime() + (istOffset + localOffset) * 60000);
    return istTime.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) return 0;
    const timeDiff = endDateObj.getTime() - startDateObj.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { startDate, endDate, reason } = form;
    if (!startDate || !endDate || !reason.trim()) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setIsSubmitting(true);
    const res = await dispatch(applyForLeave(reason, startDate, endDate));
    if (res) {
      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
      await dispatch(getLeaveHistory(yearString, monthString));
    }
    setIsSubmitting(false);
  };

  const getStatusIcon = (status: leaveStatus) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: leaveStatus) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "APPROVED":
        return `${baseClasses} bg-emerald-100 text-emerald-800`;
      case "REJECTED":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-amber-100 text-amber-800`;
    }
  };

  const totalDays = calculateDays(form.startDate, form.endDate);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, month: Number(e.target.value) }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, year: Number(e.target.value) }));
  };

  const resetToCurrent = () => {
    const now = new Date();
    setFilter({ month: now.getMonth(), year: now.getFullYear() });
  };

  const manualRefresh = async () => {
    setIsLoadingHistory(true);
    await dispatch(getLeaveHistory(yearString, monthString));
    setIsLoadingHistory(false);
  };

  return (
    <div className="min-h-scree mt-15">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Leave Application Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              Apply for Leave
            </h2>
            <p className="text-gray-600 mt-2">
              Submit your leave request with the required details
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-12"
                    required
                  />
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleInputChange}
                    min={form.startDate || new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-12"
                    required
                  />
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {totalDays > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-blue-800 font-semibold">
                      Total Duration: {totalDays} day{totalDays > 1 ? "s" : ""}
                    </span>
                    <p className="text-blue-600 text-sm">
                      Leave period calculated
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <div className="relative">
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleInputChange}
                  placeholder="Please provide a reason for your leave request..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pl-12 resize-none"
                  required
                />
                <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !form.startDate ||
                  !form.endDate ||
                  !form.reason.trim()
                }
                variant="primary"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  Leave History
                </h3>
                <p className="text-gray-600 mt-2">
                  Track your leave applications and their status
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-end gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center w-full gap-2 mb-1">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Filter by Month & Year
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Month
                    </label>
                    <select
                      value={filter.month}
                      onChange={handleMonthChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {monthNames.map((m, idx) => (
                        <option key={m} value={idx}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Year
                    </label>
                    <select
                      value={filter.year}
                      onChange={handleYearChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={resetToCurrent}
                      disabled={
                        filter.month === today.getMonth() &&
                        filter.year === today.getFullYear()
                      }
                    >
                      This Month
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={manualRefresh}
                      disabled={isLoadingHistory}
                    >
                      {isLoadingHistory ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Loading
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Refresh
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-6"></div>
                <p className="text-gray-600 font-medium">
                  Loading leave history for {monthNames[filter.month]}{" "}
                  {filter.year}...
                </p>
              </div>
            ) : pendingLeaves.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  No Leave Applications
                </h4>
                <p className="text-gray-500">
                  No leave requests for {monthNames[filter.month]} {filter.year}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="rounded-xl p-6 shadow-xs border border-gray-100 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-white rounded-lg p-2 shadow-xs border border-gray-100">
                              {getStatusIcon(leave.status)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900">
                                Leave
                              </h4>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Applied on {toIST(leave.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className={getStatusBadge(leave.status)}>
                            {leave.status.charAt(0).toUpperCase() +
                              leave.status.slice(1).toLowerCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Duration
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {toIST(leave.startDate).split(",")[0]} -{" "}
                                  {toIST(leave.endDate).split(",")[0]}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <User className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">
                                  Reason
                                </p>
                                <p
                                  className="text-sm font-semibold text-gray-700 truncate"
                                  title={leave.reason}
                                >
                                  {leave.reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))} 
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;