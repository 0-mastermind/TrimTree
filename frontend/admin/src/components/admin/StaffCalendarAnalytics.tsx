import React, { useState, useEffect, useMemo, useCallback } from "react";
import Calendar from "react-calendar";
import "./calendar.css";
import {
  CalendarDays,
  BarChart3,
  Calendar as CalendarIcon,
} from "lucide-react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getMonthlyAttendance } from "@/utils/api/staff";
import Loader from "@/components/common/Loader";
import type { Value } from "react-calendar/dist/shared/types.js";
import { Attendance, attendanceStatus } from "@/types/global";
import { statusMeta } from "./config";

const attendanceStatuses: attendanceStatus[] = [
  "PENDING",
  "PRESENT",
  "ABSENT",
  "LEAVE",
  "HOLIDAY",
  "WORKING_HOLIDAY",
  "REJECTED_LEAVE",
  "DISMISSED",
];

type AttendanceSummary = {
  summary: Record<attendanceStatus, number>;
};

interface StaffAnalyticsProps {
  staffId?: string;
  showTitle?: boolean;
  className?: string;
}

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

const StaffCalendarAnalytics: React.FC<StaffAnalyticsProps> = ({
  staffId,
  showTitle = true,
  className = "",
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);

  const month = useMemo(
    () => String(currentMonthDate.getMonth() + 1).padStart(2, "0"),
    [currentMonthDate]
  );
  const year = useMemo(
    () => String(currentMonthDate.getFullYear()),
    [currentMonthDate]
  );

  const attendanceData: Attendance[] = useSelector(
    (state: RootState) => state.employees.monthlyAttendance
  );

  useEffect(() => {
    let isActive = true;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        await dispatch(getMonthlyAttendance(month, year, staffId as string));
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchAttendance();
    return () => {
      isActive = false;
    };
  }, [dispatch, month, year, staffId]);

  const attendanceMap = useMemo(() => {
    const map: Record<string, Attendance> = {};
    attendanceData.forEach((record) => {
      if (!record?.date) return;
      // Support if date comes as string from API
      const key = toISODate(new Date(record.date));
      map[key] = record;
    });
    return map;
  }, [attendanceData]);

  const selectedDateKey = useMemo(
    () => toISODate(selectedDate),
    [selectedDate]
  );
  const selectedRecord = useMemo(
    () => attendanceMap[selectedDateKey],
    [attendanceMap, selectedDateKey]
  );

  const { summary }: AttendanceSummary = useMemo(() => {
    const base: Record<attendanceStatus, number> = attendanceStatuses.reduce(
      (acc, s) => {
        acc[s] = 0;
        return acc;
      },
      {} as Record<attendanceStatus, number>
    );

    attendanceData.forEach((record) => {
      if (!record?.status) return;
      if (base[record.status] !== undefined) {
        base[record.status] += 1;
      }
    });

    return {
      summary: base,
    };
  }, [attendanceData]);

  const handleDateChange = useCallback(
    (value: Value) => {
      if (!value || Array.isArray(value)) return;
      const date = value as Date;
      setSelectedDate(date);
      if (
        date.getMonth() !== currentMonthDate.getMonth() ||
        date.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        setCurrentMonthDate(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    },
    [currentMonthDate]
  );

  const handleActiveStartDateChange = useCallback(
    ({ activeStartDate }: { activeStartDate: Date | null }) => {
      if (!activeStartDate) return;
      setCurrentMonthDate(activeStartDate);
      if (
        activeStartDate.getMonth() !== selectedDate.getMonth() ||
        activeStartDate.getFullYear() !== selectedDate.getFullYear()
      ) {
        setSelectedDate(activeStartDate);
      }
    },
    [selectedDate]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className={`min-h-screen p-3 mt-15 sm:p-4 md:p-6 lg:p-8 z-0 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              {showTitle && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Monthly Attendance
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {currentMonthDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="w-full">
                  <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    onActiveStartDateChange={handleActiveStartDateChange}
                    locale="en-US"
                    calendarType="gregory"
                    showWeekNumbers={false}
                    showNeighboringMonth={true}
                    formatShortWeekday={(_, date) => {
                      const days = [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ];
                      return days[date.getDay()];
                    }}
                    tileContent={({ date, view }) => {
                      if (view === "month") {
                        const key = toISODate(date);
                        const record = attendanceMap[key];
                        const meta = record
                          ? statusMeta[record.status]
                          : undefined;
                        return record && meta ? (
                          <div className="flex justify-center absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <span
                              className={clsx(
                                "block w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-sm",
                                meta.color
                              )}
                              title={meta.label}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3">
                {attendanceStatuses.map((status) => {
                  const meta = statusMeta[status];
                  return (
                    <div
                      key={status}
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={clsx(
                          "w-3 h-3 rounded-full shadow-sm flex-shrink-0",
                          meta?.color
                        )}
                      />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium">
                        {meta?.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Date Details */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Selected Date
                </h3>
              </div>

              <div className="space-y-4">
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {selectedRecord ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div
                      className={clsx(
                        "flex items-center space-x-3 p-3 sm:p-4 rounded-2xl border-2",
                        statusMeta[selectedRecord.status]?.bgColor,
                        statusMeta[selectedRecord.status]?.textColor
                      )}
                    >
                      {statusMeta[selectedRecord.status]?.icon}
                      <span className="font-bold text-sm sm:text-base lg:text-lg">
                        {(selectedRecord.type === "LEAVE" && selectedRecord.status === "PENDING") ? statusMeta["LEAVE"]?.label + " " : "Attendance "} 
                        {statusMeta[selectedRecord.status]?.label}
                      </span>
                    </div>

                    {(selectedRecord.punchIn?.time ||
                      selectedRecord.punchOut?.time) && (
                      <div className="space-y-2 sm:space-y-3">
                        {selectedRecord.punchIn?.time && (
                          <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium text-xs sm:text-sm">
                              Punch In
                            </span>
                            <span className="font-bold text-gray-900 text-xs sm:text-sm">
                              {new Date(
                                selectedRecord.punchIn.time
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                        {selectedRecord.punchOut?.time && (
                          <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium text-xs sm:text-sm">
                              Punch Out
                            </span>
                            <span className="font-bold text-gray-900 text-xs sm:text-sm">
                              {new Date(
                                selectedRecord.punchOut.time
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                        {selectedRecord.punchIn?.time &&
                          selectedRecord.punchOut?.time && (
                            <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-xl">
                              <span className="text-blue-600 font-medium text-xs sm:text-sm">
                                Hours Worked
                              </span>
                              <span className="font-bold text-blue-900 text-xs sm:text-sm">
                                {(
                                  (new Date(
                                    selectedRecord.punchOut.time
                                  ).getTime() -
                                    new Date(
                                      selectedRecord.punchIn.time
                                    ).getTime()) /
                                  36e5
                                ).toFixed(2)}
                                h
                              </span>
                            </div>
                          )}
                      </div>
                    )}

                    {selectedRecord.leaveDescription &&
                      (selectedRecord.type === "LEAVE" ||
                        (selectedRecord.type === "ATTENDANCE" &&
                          selectedRecord.status === "HOLIDAY")) && (
                        <div className="mt-2 text-xs sm:text-sm bg-yellow-50 rounded-lg p-2">
                          <span className="text-yellow-700 font-medium">
                            Reason:{" "}
                          </span>
                          {selectedRecord.leaveDescription}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      No data for selected date
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Monthly Breakdown
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {attendanceStatuses.map((status) => {
                  const meta = statusMeta[status];
                  return (
                    <div
                      key={status}
                      className={clsx(
                        "flex items-center justify-between p-2 sm:p-3 rounded-xl",
                        meta?.bgColor
                      )}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div
                          className={clsx(
                            "p-1 sm:p-2 rounded-lg",
                            meta?.color,
                            "bg-opacity-20"
                          )}
                        >
                          {meta?.icon}
                        </div>
                        <span
                          className={clsx(
                            "font-medium text-xs sm:text-sm",
                            meta?.textColor
                          )}
                        >
                          {meta?.label}
                        </span>
                      </div>
                      <span
                        className={clsx(
                          "font-bold text-sm sm:text-base lg:text-lg",
                          meta?.textColor
                        )}
                      >
                        {summary[status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCalendarAnalytics;
