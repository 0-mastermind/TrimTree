import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css"; // Custom styles for calendar
import { 
  User, 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Coffee,
  Plane,
  MapPin,
  AlertTriangle
} from "lucide-react";
import clsx from "clsx";

type AttendanceStatus =
  | "Pending"
  | "Present"
  | "Absent"
  | "Paid Leave"
  | "Unpaid Leave"
  | "Holiday"
  | "Working Holiday";

type AttendanceRecord = {
  date: string; // ISO date
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  hours?: number;
};

// Enhanced mock data with more details
const attendanceData: AttendanceRecord[] = [
  { date: "2025-09-01", status: "Present", checkIn: "9:00 AM", checkOut: "6:00 PM", hours: 8 },
  { date: "2025-09-02", status: "Present", checkIn: "9:15 AM", checkOut: "6:15 PM", hours: 8 },
  { date: "2025-09-03", status: "Paid Leave" },
  { date: "2025-09-04", status: "Present", checkIn: "8:45 AM", checkOut: "5:45 PM", hours: 8 },
  { date: "2025-09-05", status: "Absent" },
  { date: "2025-09-06", status: "Holiday" },
  { date: "2025-09-07", status: "Working Holiday", checkIn: "10:00 AM", checkOut: "4:00 PM", hours: 6 },
  { date: "2025-09-08", status: "Unpaid Leave" },
  { date: "2025-09-09", status: "Pending" },
  { date: "2025-09-10", status: "Present", checkIn: "9:05 AM", checkOut: "6:05 PM", hours: 8 },
  { date: "2025-09-11", status: "Present", checkIn: "9:10 AM", checkOut: "6:10 PM", hours: 8 },
  { date: "2025-09-12", status: "Paid Leave" },
  { date: "2025-09-13", status: "Holiday" },
  { date: "2025-09-14", status: "Holiday" },
  { date: "2025-09-15", status: "Present", checkIn: "9:00 AM", checkOut: "6:00 PM", hours: 8 },
  { date: "2025-09-16", status: "Present", checkIn: "8:50 AM", checkOut: "5:50 PM", hours: 8 },
  { date: "2025-09-17", status: "Absent" },
  { date: "2025-09-18", status: "Present", checkIn: "9:20 AM", checkOut: "6:20 PM", hours: 8 },
  { date: "2025-09-19", status: "Present", checkIn: "9:00 AM", checkOut: "6:00 PM", hours: 8 },
  { date: "2025-09-20", status: "Holiday" },
  { date: "2025-09-21", status: "Holiday" },
  { date: "2025-09-22", status: "Present", checkIn: "9:05 AM", checkOut: "6:05 PM", hours: 8 },
  { date: "2025-09-23", status: "Present", checkIn: "9:00 AM", checkOut: "6:00 PM", hours: 8 },
  { date: "2025-09-24", status: "Paid Leave" },
  { date: "2025-09-25", status: "Present", checkIn: "8:55 AM", checkOut: "5:55 PM", hours: 8 },
  { date: "2025-09-26", status: "Present", checkIn: "9:00 AM", checkOut: "6:00 PM", hours: 8 }
];

const statusMeta: Record<
  AttendanceStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode; textColor: string }
> = {
  Pending: { 
    label: "Pending", 
    color: "bg-gray-500", 
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  Present: { 
    label: "Present", 
    color: "bg-emerald-500", 
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  Absent: { 
    label: "Absent", 
    color: "bg-red-500", 
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  "Paid Leave": { 
    label: "Paid Leave", 
    color: "bg-blue-500", 
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    icon: <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  "Unpaid Leave": { 
    label: "Unpaid Leave", 
    color: "bg-orange-500", 
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    icon: <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  Holiday: { 
    label: "Holiday", 
    color: "bg-purple-500", 
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    icon: <Plane className="w-4 h-4 sm:w-5 sm:h-5" />
  },
  "Working Holiday": { 
    label: "Working Holiday", 
    color: "bg-indigo-500", 
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
  },
};

const getMonthlySummary = (data: AttendanceRecord[]) => {
  const summary: Record<AttendanceStatus, number> = {
    Pending: 0,
    Present: 0,
    Absent: 0,
    "Paid Leave": 0,
    "Unpaid Leave": 0,
    Holiday: 0,
    "Working Holiday": 0,
  };
  
  data.forEach((d) => summary[d.status]++);
  
  const totalHours = data.reduce((sum, record) => sum + (record.hours || 0), 0);
  const workingDays = data.filter(d => d.status === "Present" || d.status === "Working Holiday").length;
  const totalDays = data.length;
  const attendanceRate = ((summary.Present + summary["Working Holiday"]) / totalDays * 100).toFixed(1);
  
  return { summary, totalHours, workingDays, totalDays, attendanceRate };
};

const StaffAnalytics: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-09-01"));
  const { summary, totalHours, workingDays, totalDays, attendanceRate } = getMonthlySummary(attendanceData);

  const selectedDateString = selectedDate.toISOString().slice(0, 10);
  const selectedRecord = attendanceData.find(record => record.date === selectedDateString);

  const StatCard = ({ icon, title, value, subtitle, color = "bg-white" }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <div className={`${color} rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="ml-2 sm:ml-4 p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            subtitle="This month"
          />
          <StatCard
            icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Working Days"
            value={workingDays}
            subtitle={`Out of ${totalDays} total days`}
          />
          <StatCard
            icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Total Hours"
            value={totalHours}
            subtitle={`Avg: ${(totalHours / workingDays || 0).toFixed(1)}h/day`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                  <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Monthly Attendance</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">September 2025</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="w-full">
                  
                  <Calendar
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                    tileContent={({ date, view }) => {
                      if (view === "month") {
                        const record = attendanceData.find(
                          (r) => r.date === date.toISOString().slice(0, 10)
                        );
                        return record ? (
                          <div className="flex justify-center absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <span
                              className={clsx(
                                "block w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-sm",
                                statusMeta[record.status].color
                              )}
                              title={record.status}
                            />
                          </div>
                        ) : null;
                      }
                      return null;
                    }}
                    className="react-calendar w-full"
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3">
                {Object.entries(statusMeta).map(([status, meta]) => (
                  <div key={status} className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className={clsx("w-3 h-3 rounded-full shadow-sm flex-shrink-0", meta.color)} />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">{meta.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Date Details */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Selected Date</h3>
              </div>

              <div className="space-y-4">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                {selectedRecord ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className={clsx(
                      "flex items-center space-x-3 p-3 sm:p-4 rounded-2xl border-2",
                      statusMeta[selectedRecord.status].bgColor,
                      statusMeta[selectedRecord.status].textColor
                    )}>
                      {statusMeta[selectedRecord.status].icon}
                      <span className="font-bold text-sm sm:text-base lg:text-lg">{selectedRecord.status}</span>
                    </div>

                    {selectedRecord.checkIn && (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-600 font-medium text-xs sm:text-sm">Check In</span>
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">{selectedRecord.checkIn}</span>
                        </div>
                        
                        {selectedRecord.checkOut && (
                          <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium text-xs sm:text-sm">Check Out</span>
                            <span className="font-bold text-gray-900 text-xs sm:text-sm">{selectedRecord.checkOut}</span>
                          </div>
                        )}
                        
                        {selectedRecord.hours && (
                          <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-xl">
                            <span className="text-blue-600 font-medium text-xs sm:text-sm">Hours Worked</span>
                            <span className="font-bold text-blue-900 text-xs sm:text-sm">{selectedRecord.hours}h</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm">No data for selected date</p>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Monthly Breakdown</h3>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {Object.entries(statusMeta).map(([status, meta]) => (
                  <div key={status} className={clsx("flex items-center justify-between p-2 sm:p-3 rounded-xl", meta.bgColor)}>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={clsx("p-1 sm:p-2 rounded-lg", meta.color, "bg-opacity-20")}>
                        {meta.icon}
                      </div>
                      <span className={clsx("font-medium text-xs sm:text-sm", meta.textColor)}>{meta.label}</span>
                    </div>
                    <span className={clsx("font-bold text-sm sm:text-base lg:text-lg", meta.textColor)}>
                      {summary[status as AttendanceStatus]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAnalytics;