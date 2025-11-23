import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllAppointments, updateAppointment } from "@/utils/api/appointment";
import { getStaffByManager } from "@/utils/api/manager";
import { Loader, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EditAppointmentDialogueProps {
  onClose: () => void;
  appointment: {
    _id: string;
    customerName: string;
    // Expected: "YYYY-MM-DD h:mm AM/PM", e.g. "2025-11-10 7:09 PM"
    appointmentAt: string;
    assignedStaffMember: string;
    description: string;
  };
}

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 30);

// ---------- Helpers ----------

// Parse "YYYY-MM-DD h:mm AM/PM" -> Date
const parseYmd12h = (str: string): Date | null => {
  if (!str) return null;

  // Example: "2025-11-10 7:09 PM"
  const parts = str.trim().split(" ");
  if (parts.length < 3) return null;

  const [datePart, timePart, ampmRaw] = parts;
  const [yearStr, monthStr, dayStr] = datePart.split("-");
  const [hourStr, minuteStr] = timePart.split(":");

  if (!yearStr || !monthStr || !dayStr || !hourStr || !minuteStr || !ampmRaw) {
    return null;
  }

  const yyyy = Number(yearStr);
  const mm = Number(monthStr);
  const dd = Number(dayStr);
  let hour = Number(hourStr);
  const minute = Number(minuteStr);
  const ampm = ampmRaw.toUpperCase();

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const d = new Date(yyyy, mm - 1, dd, hour, minute, 0, 0);
  return isNaN(d.getTime()) ? null : d;
};

// Date -> "YYYY-MM-DD" for <input type="date">
const toInputDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Date -> "HH:MM" 24h for <input type="time">
const toInputTime = (d: Date): string => {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

// Build "YYYY-MM-DD h:mm AM/PM" from date & time inputs
const fromInputsToYmd12h = (dateStr: string, timeStr: string): string | null => {
  if (!dateStr || !timeStr) return null;

  // dateStr: "2025-11-10"
  // timeStr: "19:09"
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const [hourStr, minuteStr] = timeStr.split(":");
  if (!yearStr || !monthStr || !dayStr || !hourStr || !minuteStr) return null;

  const hour24 = Number(hourStr);
  const minute = minuteStr;
  const yyyy = yearStr;
  const mm = monthStr;
  const dd = dayStr;

  const ampm = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  return `${yyyy}-${mm}-${dd} ${hour12}:${minute} ${ampm}`;
};

const EditAppointmentDailogue = ({
  onClose,
  appointment,
}: EditAppointmentDialogueProps) => {
  const { staff } = useAppSelector((state) => state.manager);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [formData, setFormData] = useState({
    customerName: appointment.customerName,
    appointmentAt: appointment.appointmentAt,
    assignedStaffMember: appointment.assignedStaffMember,
    description: appointment.description,
  });

  // Load staff once
  useEffect(() => {
    dispatch(getStaffByManager());
  }, [dispatch]);

  // Initialize when appointment changes
  useEffect(() => {
    const d = parseYmd12h(appointment.appointmentAt);

    if (d) {
      setAppointmentDate(toInputDate(d)); // "2025-11-10"
      setAppointmentTime(toInputTime(d)); // "19:09"
    } else {
      setAppointmentDate("");
      setAppointmentTime("");
    }

    setFormData({
      customerName: appointment.customerName,
      appointmentAt: appointment.appointmentAt,
      assignedStaffMember: appointment.assignedStaffMember,
      description: appointment.description,
    });
  }, [appointment]);

  // Keep formData.appointmentAt in sync when date or time changes
  useEffect(() => {
    if (!appointmentDate || !appointmentTime) return;
    const combined = fromInputsToYmd12h(appointmentDate, appointmentTime);
    if (!combined) return;

    setFormData((prev) => ({
      ...prev,
      appointmentAt: combined, // "YYYY-MM-DD h:mm AM/PM"
    }));
  }, [appointmentDate, appointmentTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      let finalAppointmentAt = formData.appointmentAt;

      const recombined = fromInputsToYmd12h(appointmentDate, appointmentTime);
      if (recombined) {
        finalAppointmentAt = recombined;
      }

      const res = await dispatch(
        updateAppointment({
          id: appointment._id,
          formData: {
            ...formData,
            appointmentAt: finalAppointmentAt,
          },
        })
      );

      if (res) {
        await dispatch(getAllAppointments());
        onClose();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white relative rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        >
          <X className="hover:text-black/70" />
        </div>

        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Edit Appointment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the appointment details
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <fieldset className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter customer name"
                  required
                />
              </fieldset>

              <fieldset className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={toInputDate(today)}
                  max={toInputDate(maxDate)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </fieldset>

              <fieldset className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </fieldset>

              <fieldset className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Staff Member <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignedStaffMember}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignedStaffMember: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none bg-white"
                  required
                >
                  <option value="">Select a staff member</option>
                  {staff &&
                    staff.map((staffMember) => (
                      <option
                        key={staffMember._id}
                        value={staffMember._id}
                        className="capitalize"
                      >
                        {staffMember.userId.name} - {staffMember.userId.role}
                      </option>
                    ))}
                </select>
              </fieldset>

              <fieldset className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Notes for the staff about customer and the service they want..."
                />
              </fieldset>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  Updating...
                </>
              ) : (
                "Update Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentDailogue;