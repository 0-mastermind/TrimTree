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
    appointmentAt: string;
    assignedStaffMember: string;
    description: string;
  };
}

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 30);

const EditAppointmentDailogue = ({
  onClose,
  appointment,
}: EditAppointmentDialogueProps) => {
  const { staff } = useAppSelector((state) => state.manager);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // Split the existing appointmentAt into date and time
  const [appointmentDate, setAppointmentDate] = useState(
    appointment.appointmentAt.split("T")[0]
  );
  const [appointmentTime, setAppointmentTime] = useState(
    appointment.appointmentAt.split("T")[1]?.substring(0, 5) || ""
  );

  const [formData, setFormData] = useState({
    customerName: appointment.customerName,
    appointmentAt: appointment.appointmentAt,
    assignedStaffMember: appointment.assignedStaffMember,
    description: appointment.description,
  });

  useEffect(() => {
    dispatch(getStaffByManager());
  }, []);

  // Combine date and time into appointmentAt whenever they change
  useEffect(() => {
    if (appointmentDate && appointmentTime) {
      const combinedDateTime = `${appointmentDate}T${appointmentTime}:00`;
      setFormData((prev) => ({ ...prev, appointmentAt: combinedDateTime }));
    }
  }, [appointmentDate, appointmentTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await dispatch(
        updateAppointment({ id: appointment._id, formData })
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
      onClick={onClose}>
      <div
        className="bg-white relative rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}>
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
                  required>
                  <option value="">Select a staff member</option>
                  {staff &&
                    staff.map((staff) => (
                      <option
                        key={staff._id}
                        value={staff._id}
                        className="capitalize">
                        {staff.userId.name} - {staff.userId.role}
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
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Notes for the staff about customer and the service they want..."></textarea>
              </fieldset>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
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