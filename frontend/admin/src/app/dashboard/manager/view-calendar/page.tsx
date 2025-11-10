"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });
import "@/app/calendar.css";
import {
  Calendar as CalendarIcon,
  Info,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getOfficialHolidays } from "@/utils/api/manager";
import type { OfficialHolidays } from "@/types/global";
import Image from "next/image";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const HolidayCalendar: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState<{
    date: Date;
    holidays: OfficialHolidays[];
  } | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [expandedHolidays, setExpandedHolidays] = useState<Set<string>>(
    new Set()
  );

  const dispatch = useAppDispatch();
  const { holidays } = useAppSelector((state) => state.holidays);

  const fetchHolidays = useCallback(async () => {
    try {
      await dispatch(getOfficialHolidays(currentMonth, currentYear));
    } catch (error) {
      console.log("Error! while fetching holidays", error);
    }
  }, [dispatch, currentMonth, currentYear]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  // Check if a date has a holiday
  const dateHasHoliday = (date: Date): boolean => {
    return holidays.some((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === date.getDate() &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get holidays for a specific date
  const getHolidaysForDate = (date: Date): OfficialHolidays[] => {
    return holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === date.getDate() &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Handle date click
  const handleDateClick = (value: Date) => {
    const dateHolidays = getHolidaysForDate(value);
    if (dateHolidays.length > 0) {
      setSelectedHoliday({ date: value, holidays: dateHolidays });
    } else {
      setSelectedHoliday(null);
    }
  };

  // Handle month/year change
  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      const newMonth = activeStartDate.getMonth() + 1;
      const newYear = activeStartDate.getFullYear();

      if (newMonth !== currentMonth || newYear !== currentYear) {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
      }
    }
  };

  // Toggle employee list expansion
  const toggleEmployeeExpansion = (holidayId: string) => {
    setExpandedHolidays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(holidayId)) {
        newSet.delete(holidayId);
      } else {
        newSet.add(holidayId);
      }
      return newSet;
    });
  };

  // Custom tile content for the calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && dateHasHoliday(date)) {
      return (
        <span className="bg-primary rounded-full w-2 h-2 inline-block ml-1"></span>
      );
    }
    return null;
  };

  // Custom tile class for styling
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && dateHasHoliday(date)) {
      return "bg-primary/20 text-primary-content";
    }
    return "relative";
  };

  // Memoized upcoming holidays
  const upcomingHolidays = useMemo(() => {
    return [...holidays]
      .filter((holiday) => new Date(holiday.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [holidays]);

  // Memoized sorted holidays
  const sortedHolidays = useMemo(() => {
    return [...holidays].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [holidays]);

  // Employee list component with virtualization for large lists
  const EmployeeList = ({
    employees,
    maxVisible = 3,
  }: {
    employees: any[];
    maxVisible?: number;
  }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleEmployees = showAll
      ? employees
      : employees.slice(0, maxVisible);
    const hasMore = employees.length > maxVisible;

    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-base-content flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employees ({employees.length})
          </h4>
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-primary hover:text-primary-focus flex items-center gap-1 transition-colors"
            >
              {showAll ? (
                <>
                  Show less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show all <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {visibleEmployees.map((emp) => (
            <div
              key={emp._id}
              className="flex items-center gap-3 p-2 bg-base-100 rounded-box border border-base-200 hover:bg-base-200 transition-colors"
            >
              <Image
                width={1920}
                height={1080}
                quality={100}
                src={emp.image?.url || "/default-avatar.png"}
                alt={emp.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-base-content truncate">
                  {emp.name}
                </div>
                <div className="text-xs text-base-content/70 truncate">
                  @{emp.username}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && !showAll && employees.length - maxVisible > 0 && (
          <div className="text-xs text-base-content/60 text-center mt-2">
            +{employees.length - maxVisible} more
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary rounded-box">
            <CalendarIcon className="h-6 w-6 text-primary-content" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">
            Holiday Calendar
          </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="xl:col-span-2">
            <div className="bg-base-100 rounded-box shadow-sm border border-base-300 p-6">
              <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleDateClick}
                onActiveStartDateChange={handleActiveStartDateChange}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full border-none bg-base-100 text-base-content"
              />

              <div className="mt-6 flex items-center justify-end">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span className="text-sm text-base-content">
                      Public Holiday
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Holiday Details Section */}
          <div className="space-y-6">
            {/* Selected Holiday Details */}
            <div className="bg-base-100 rounded-box shadow-sm border border-base-300 p-6">
              <h2 className="text-xl font-semibold text-base-content mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Holiday Details
              </h2>

              {selectedHoliday ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-base-content mb-2">
                      {selectedHoliday.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedHoliday.holidays.map((holiday) => (
                      <div
                        key={holiday._id}
                        className="bg-gray-300/20 p-4 rounded-box border border-primary/20"
                      >
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-base-content block truncate">
                              {holiday.name}
                            </span>
                            <div className="mt-2 text-sm text-base-content/70 flex items-center gap-4">
                              <span>
                                {holiday.employees.length} employee(s)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Employees list for this holiday */}
                        {holiday.employees.length > 0 && (
                          <EmployeeList employees={holiday.employees} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <CalendarIcon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-base-content/70">
                    Select a date with a holiday to view details
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Holidays */}
            <div className="bg-base-100 rounded-box shadow-sm border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                Upcoming Holidays
              </h3>
              <div className="space-y-3">
                {upcomingHolidays.length > 0 ? (
                  upcomingHolidays.map((holiday) => (
                    <div
                      key={holiday._id}
                      className="flex items-center justify-between p-3 bg-base-200 rounded-box hover:bg-base-300 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-base-content truncate">
                          {holiday.name}
                        </div>
                        <div className="text-xs text-base-content/70">
                          {new Date(holiday.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {holiday.employees.length}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-base-content/70 text-center py-4">
                    No upcoming holidays
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Holidays Section */}
        <div className="mt-8 bg-base-100 rounded-box shadow-sm border border-base-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-base-content">
              All Holidays ({holidays.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedHolidays.length > 0 ? (
              sortedHolidays.map((holiday) => {
                const isExpanded = expandedHolidays.has(holiday._id);
                return (
                  <div
                    key={holiday._id}
                    className="p-4 bg-gray-300/20 rounded-box border border-base-300 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base-content truncate">
                          {holiday.name}
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">
                          {new Date(holiday.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-base-content/60">
                            {holiday.employees.length} employee(s)
                          </p>

                          {holiday.employees.length > 0 && (
                            <button
                              onClick={() =>
                                toggleEmployeeExpansion(holiday._id)
                              }
                              className="text-xs text-primary hover:text-primary-focus flex items-center gap-1 transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  Hide <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  Show <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable employees list */}
                    {isExpanded && holiday.employees.length > 0 && (
                      <EmployeeList
                        employees={holiday.employees}
                        maxVisible={5}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-base-300 rounded-full mb-4">
                  <CalendarIcon className="h-8 w-8 text-base-content/50" />
                </div>
                <p className="text-base-content/70">No holidays scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;
