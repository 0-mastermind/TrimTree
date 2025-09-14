"use client";
import React, { useState } from "react";
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });
import "@/app/calendar.css";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import dynamic from "next/dynamic";

type Holiday = {
  date: string;
  name: string;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const HolidayCalendar: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedHoliday, setSelectedHoliday] = useState<{
    date: Date;
    holidays: Holiday[];
  } | null>(null);

  // Sample holiday data
  const holidays: Holiday[] = [
    { date: "2025-08-15", name: "Independence Day" },
    { date: "2025-09-05", name: "Labor Day" },
    { date: "2025-10-31", name: "Halloween" },
    { date: "2025-11-23", name: "Thanksgiving" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-31", name: "New Year's Eve" },
    { date: "2025-08-21", name: "Summer Break" },
    { date: "2025-08-22", name: "Summer Break" },
    { date: "2025-08-23", name: "Summer Break" },
    { date: "2025-12-26", name: "Office Closure" },
    { date: "2025-12-27", name: "Office Closure" },
  ];

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
  const getHolidaysForDate = (date: Date): Holiday[] => {
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-base-content">
            Holiday Calendar
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-box shadow-md p-6">
              <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleDateClick}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full border-none bg-base-100 text-base-content"
              />

              <div className="mt-6 flex items-center justify-end">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span className="text-xs text-base-content">Holiday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Holiday Details Section */}
          <div className="bg-base-100 rounded-box shadow-md p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Holiday Details
            </h2>

            {selectedHoliday ? (
              <div>
                <h3 className="text-lg font-medium text-base-content mb-2">
                  {selectedHoliday.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                <div className="space-y-3">
                  {selectedHoliday.holidays.map((holiday, index) => (
                    <div
                      key={index}
                      className="bg-primary/20 p-3 rounded-box border border-primary/30">
                      <div className="flex items-center">
                        <Info className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium text-base-content">
                          {holiday.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                  <CalendarIcon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base-content/70">
                  Select a date with a holiday to view details
                </p>
              </div>
            )}

            {/* Upcoming Holidays */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-base-content mb-3">
                Upcoming Holidays
              </h3>
              <div className="space-y-2">
                {holidays
                  .filter((holiday) => new Date(holiday.date) > new Date())
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .slice(0, 3)
                  .map((holiday, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-base-200 rounded-box">
                      <span className="text-sm font-medium text-base-content">
                        {holiday.name}
                      </span>
                      <span className="text-xs text-base-content/70">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Holiday List */}
        <div className="mt-8 bg-base-100 rounded-box shadow-md p-6">
          <h2 className="text-xl font-semibold text-base-content mb-4">
            All Holidays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidays
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((holiday, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-primary/20 rounded-box border border-primary/30">
                  <Info className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-base-content">
                      {holiday.name}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;
