import { Calendar, Clock, FileText } from "lucide-react";

interface StaffAppointmentCardProps {
  customerName: string;
  appointmentDate: string;
  appointmentTime: string;
  description: string;
}

const StaffAppointmentCard = ({
  customerName,
  appointmentDate,
  appointmentTime,
  description,
}: StaffAppointmentCardProps) => {

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-lg">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize">
                {customerName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Date */}
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-black-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Date</p>
              <p className="text-sm sm:text-base font-medium">
                {appointmentDate}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-black-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Time</p>
              <p className="text-sm sm:text-base font-medium">
                {appointmentTime}
              </p>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="flex items-start gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Service Details
                </p>
                <p className="text-sm text-gray-600 break-words">
                  {description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAppointmentCard;
