"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { connectSocket, socket } from "@/utils/socket";
import React, { useEffect, useRef, useState } from "react";
import { Calendar, Clock, User, Trash2, Edit, Plus, X } from "lucide-react";
import { IAppointment, IStaffMember } from "@/types/global";

const AppointmentManager = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [staffMembers, setStaffMembers] = useState<IStaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<IAppointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string>("");

  const [formData, setFormData] = useState({
    customerName: "",
    description: "",
    appointmentAt: "",
    assignedStaffMember: "",
  });

  useEffect(() => {
    connectSocket();

    if (user?.branch && user?._id) {
      socket.emit("joinRoom", `manager:${user._id}`);
    }

    const handleNewAppointment = (data: IAppointment) => {
      console.log("New appointment created!", data);
      setAppointments((prev) => [data, ...prev]);
      showNotification("New appointment created!");
      playSound();
    };

    socket.on("createAppointment", handleNewAppointment);

    fetchAppointments();
    fetchStaffMembers();

    return () => {
      socket.off("createAppointment", handleNewAppointment);
    };
  }, [user]);

  const playSound = () => {
    try {
      notifyAudioRef.current?.play();
    } catch (e) {
      console.error("Error playing notification sound: ", e);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointments");
      const result = await response.json();
      if (result.data) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch("/api/staff");
      const result = await response.json();
      if (result.data) {
        setStaffMembers(result.data);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaffMembers([
        { _id: "1", name: "John Doe" },
        { _id: "2", name: "Jane Smith" },
        { _id: "3", name: "Mike Johnson" },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.customerName ||
      !formData.description ||
      !formData.appointmentAt ||
      !formData.assignedStaffMember
    ) {
      showNotification("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const url = editingAppointment
        ? `/api/appointments?appointmentId=${editingAppointment._id}`
        : "/api/appointments";

      const method = editingAppointment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(
          editingAppointment ? "Appointment updated!" : "Appointment created!"
        );
        fetchAppointments();
        closeModal();
      } else {
        showNotification(result.message || "Error saving appointment");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      showNotification("Error saving appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/appointments?appointmentId=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showNotification("Appointment deleted!");
        setAppointments((prev) => prev.filter((apt) => apt._id !== id));
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showNotification("Error deleting appointment");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (appointment?: IAppointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        customerName: appointment.customerName,
        description: appointment.description,
        appointmentAt: new Date(appointment.appointmentAt)
          .toISOString()
          .slice(0, 16),
        assignedStaffMember: appointment.assignedStaffMember,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerName: "",
        description: "",
        appointmentAt: "",
        assignedStaffMember: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setFormData({
      customerName: "",
      description: "",
      appointmentAt: "",
      assignedStaffMember: "",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStaffName = (staffId: string) => {
    const staff = staffMembers.find((s) => s._id === staffId);
    return staff?.name || "Unknown Staff";
  };

  return (
    <div className="mx-10 my-8">
      <audio ref={notifyAudioRef} src="/notification.mp3" preload="auto" />

      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage your appointments and schedule
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      {loading && !appointments.length ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No appointments yet</p>
          <p className="text-gray-500 mt-2">
            Create your first appointment to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {appointment.customerName}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {appointment.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-blue-600" />
                      {formatDate(appointment.appointmentAt)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-green-600" />
                      {getStaffName(appointment.assignedStaffMember)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(appointment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit">
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingAppointment ? "Edit Appointment" : "New Appointment"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.appointmentAt}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentAt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Staff Member
                </label>
                <select
                  value={formData.assignedStaffMember}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedStaffMember: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select a staff member</option>
                  {staffMembers.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {loading
                    ? "Saving..."
                    : editingAppointment
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;
