import { useAppDispatch, useAppSelector } from "@/store/store";
import { createAppointment, getAllAppointments } from "@/utils/api/appointment";
import { getStaffByManager } from "@/utils/api/manager";
import { Loader, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 30);

const AddAppointmentDailogue = ({
  onClose = () => {},
}: {
  onClose: () => void;
}) => {
  const { staff } = useAppSelector((state) => state.manager);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState(
    today.toISOString().slice(0, 10)
  ); // yyyy-mm-dd
  const [appointmentTime, setAppointmentTime] = useState(""); // HH:MM (24h from input)

  const [formData, setFormData] = useState({
    customerName: "",
    appointmentAt: "",
    assignedStaffMember: "",
    description: "",
  });

  useEffect(() => {
    dispatch(getStaffByManager());
  }, [dispatch]);

  // helper to convert "HH:MM" 24h -> "hh:MM AM/PM"
  const convertTo12HourWithAmPm = (time: string) => {
    if (!time) return "";
    const [hStr, mStr] = time.split(":");
    let hours = Number(hStr);
    const minutes = mStr ?? "00";

    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12; // 0 -> 12

    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hoursStr}:${minutes} ${suffix}`;
  };

  // Combine date and time into appointmentAt in `yyyy-mm-dd hh:mm AM/PM` format
  useEffect(() => {
    if (appointmentDate && appointmentTime) {
      // appointmentDate is "yyyy-mm-dd"
      const [year, month, day] = appointmentDate.split("-");
      const formattedDate = `${year}-${month}-${day}`; // yyyy-mm-dd

      // appointmentTime is "HH:MM" 24h
      const formattedTime12h = convertTo12HourWithAmPm(appointmentTime); // hh:MM AM/PM

      const formattedDateTime = `${formattedDate} ${formattedTime12h}`; // yyyy-mm-dd hh:MM AM/PM

      setFormData((prev) => ({
        ...prev,
        appointmentAt: formattedDateTime,
      }));
    }
  }, [appointmentDate, appointmentTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await dispatch(
        createAppointment({
          formData,
        })
      );

      if (res) {
        await dispatch(getAllAppointments());
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setLoading(false);
      onClose();
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
            Schedule Appointment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to create a new appointment
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
                    setFormData({ ...formData, customerName: e.target.value })
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
                  min={today.toISOString().slice(0, 10)}
                  max={maxDate.toISOString().slice(0, 10)}
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
                    setFormData({
                      ...formData,
                      assignedStaffMember: e.target.value,
                    })
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
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Notes for the staff about customer and the service they want..."
                  required
                ></textarea>
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
              className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center min-w-[180px]"
            >
              {loading ? (
                <Loader className="animate-spin duration-300" />
              ) : (
                "Schedule Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentDailogue;