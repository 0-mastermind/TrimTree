import React, { useState } from "react";
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
} from "lucide-react";

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  type: string;
}

const LeaveApplication: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [leaveType, setLeaveType] = useState<string>("casual");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Mock data for pending leaves
  const [pendingLeaves] = useState<LeaveRequest[]>([
    {
      id: "1",
      startDate: "2025-10-15",
      endDate: "2025-10-17",
      days: 3,
      reason: "Family function",
      status: "pending",
      appliedOn: "2025-09-25",
      type: "Casual Leave",
    },
    {
      id: "2",
      startDate: "2025-11-20",
      endDate: "2025-11-22",
      days: 3,
      reason: "Medical appointment",
      status: "approved",
      appliedOn: "2025-09-20",
      type: "Sick Leave",
    },
    {
      id: "3",
      startDate: "2025-12-01",
      endDate: "2025-12-05",
      days: 5,
      reason: "Personal work",
      status: "rejected",
      appliedOn: "2025-09-18",
      type: "Personal Leave",
    },
  ]);

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const timeDiff = endDateObj.getTime() - startDateObj.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      alert("Please fill all required fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    console.log({ startDate, endDate, reason, leaveType });

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStartDate("");
      setEndDate("");
      setReason("");
      setLeaveType("casual");
      alert("Leave application submitted successfully!");
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalDays = calculateDays(startDate, endDate);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Leave Application Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            Apply for Leave
          </h2>
          <p className="text-gray-600 mt-2">
            Submit your leave request with the required details
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Leave Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="LEAVE PAID">PAID LEAVE</option>
              <option value="LEAVE UNPAID">UNPAID LEAVE</option>
            </select>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                  required
                />
                <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                  required
                />
                <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Duration Display */}
          {totalDays > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-medium">
                  Total Duration: {totalDays} day{totalDays > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for your leave request..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 resize-none"
                required
              />
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting || !startDate || !endDate || !reason.trim()
              }
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pending Leaves */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            Leave History
          </h3>
          <p className="text-gray-600 mt-2">
            Track your leave applications and their status
          </p>
        </div>

        <div className="p-6">
          {pendingLeaves.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No leave applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(leave.status)}
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {leave.type}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Applied on {formatDate(leave.appliedOn)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(leave.startDate)} -{" "}
                            {formatDate(leave.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {leave.days} days
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{leave.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span className={getStatusBadge(leave.status)}>
                        {leave.status.charAt(0).toUpperCase() +
                          leave.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;
