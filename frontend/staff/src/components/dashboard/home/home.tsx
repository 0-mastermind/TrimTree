import React, { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Plus,
  LogIn,
  LogOut,
  Timer,
  Plane,
  User,
} from 'lucide-react';
import type { Attendance,  attendanceType,  WorkingHour } from '@/types/type';
import { getPunchOutStatusConfig, getStatusConfig } from './colorConfigs';

interface AttendanceStatusProps {
  attendance?: Attendance | null;
  onApplyAttendance?: (workingHour: WorkingHour) => void;
  onApplyLeave?: (workingHour: WorkingHour, description: string) => void;
  onApplyPunchOut?: () => void;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ 
  attendance,
  onApplyAttendance,
  onApplyLeave,
  onApplyPunchOut
}) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isPunchOutModalOpen, setIsPunchOutModalOpen] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] = useState<attendanceType>('ATTENDANCE');
  const [leaveDescription, setLeaveDescription] = useState('');

 

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleApplicationClick = () => {
    setIsApplicationModalOpen(true);
  };

  const handlePunchOutApplyClick = () => {
    setIsPunchOutModalOpen(true);
  };

  const handleAttendanceConfirm = (workingHour: WorkingHour) => {
    onApplyAttendance?.(workingHour);
    setIsApplicationModalOpen(false);
  };

  const handleLeaveConfirm = (workingHour: WorkingHour) => {
    if (leaveDescription.trim()) {
      onApplyLeave?.(workingHour, leaveDescription.trim());
      setIsApplicationModalOpen(false);
      setLeaveDescription('');
    }
  };

  const handlePunchOutConfirm = () => {
    onApplyPunchOut?.();
    setIsPunchOutModalOpen(false);
  };

  const handleCancel = () => {
    setIsApplicationModalOpen(false);
    setIsPunchOutModalOpen(false);
    setLeaveDescription('');
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Show application button if no attendance record exists
  const showApplicationButton = !attendance;
  
  // Show punch times and punch out for attendance applications that are present/working holiday
  const isAttendanceType = attendance?.type === 'ATTENDANCE';
  const isLeaveType = attendance?.type === 'LEAVE';
  const showPunchTimes = isAttendanceType && (attendance.status === 'PRESENT' || attendance.status === 'WORKING HOLIDAY');
  const showPunchOutButton = showPunchTimes && attendance.punchOut.status === 'NOT APPLIED';

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Status</h2>
        <p className="text-sm text-gray-600">{today}</p>
      </div>

      {/* Application Type Badge */}
      {attendance && (
        <div className="mb-4 flex justify-center">
          <div className={`
            inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
            ${isLeaveType 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
            }
          `}>
            {isLeaveType ? <Plane className="h-4 w-4" /> : <User className="h-4 w-4" />}
            {attendance.type} - {attendance.workingHour.replace('_', ' ')}
          </div>
        </div>
      )}

      {/* Status Display */}
      {attendance && (
        <>
          {(() => {
            const statusConfig = getStatusConfig(attendance.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div className={`
                ${statusConfig.bgColor} 
                rounded-lg p-4 mb-4 flex items-center justify-center gap-3
                transition-all duration-200 hover:shadow-md
              `}>
                <StatusIcon className={`h-8 w-8 ${statusConfig.iconColor}`} />
                <div className="text-center">
                  <span className={`text-lg font-semibold ${statusConfig.textColor} block`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Leave Description (for leave types) */}
          {isLeaveType && attendance.leaveDescription && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Plane className="h-4 w-4" />
                <span className="font-medium text-sm">Leave Description</span>
              </div>
              <p className="text-purple-800 text-sm ml-6">
                {attendance.leaveDescription}
              </p>
            </div>
          )}

          {/* Punch In Information */}
          {showPunchTimes && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700">
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Punch In</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-800 font-semibold">
                    {formatTime(attendance.punchIn.time)}
                  </span>
                  {attendance.punchIn.isApproved ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Timer className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Punch Out Information */}
          {showPunchTimes && (
            <>
              {(() => {
                const punchOutConfig = getPunchOutStatusConfig(attendance.punchOut.status);
                const PunchOutIcon = punchOutConfig.icon;
                return (
                  <div className={`
                    ${punchOutConfig.bgColor} 
                    ${punchOutConfig.borderColor}
                    border rounded-lg p-3 mb-4
                  `}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PunchOutIcon className={`h-5 w-5 ${punchOutConfig.iconColor}`} />
                        <span className={`font-medium ${punchOutConfig.textColor}`}>
                          Punch Out: {punchOutConfig.label}
                        </span>
                      </div>
                      {attendance.punchOut.status === 'APPROVED' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${punchOutConfig.textColor}`}>
                            {formatTime(attendance.punchOut.time)}
                          </span>
                          {attendance.punchOut.isApproved && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {/* Application Info */}
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Applied:</span> {formatDate(attendance.createdAt)} at {formatTime(attendance.createdAt)}</p>
              <p><span className="font-medium">Branch:</span> {attendance.branch}</p>
              {attendance.updatedAt.getTime() !== attendance.createdAt.getTime() && (
                <p><span className="font-medium">Updated:</span> {formatDate(attendance.updatedAt)} at {formatTime(attendance.updatedAt)}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Apply Button (when no attendance record exists) */}
        {showApplicationButton && (
          <button
            onClick={handleApplicationClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Apply for Today
          </button>
        )}

        {/* Apply for Punch Out Button */}
        {showPunchOutButton && (
          <button
            onClick={handlePunchOutApplyClick}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Apply for Punch Out
          </button>
        )}
      </div>

      {/* Application Modal */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apply for Today
              </h3>
              <p className="text-sm text-gray-600">
                Choose application type and duration
              </p>
            </div>

            {/* Application Type Selection */}
            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedApplicationType('ATTENDANCE')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedApplicationType === 'ATTENDANCE'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="h-4 w-4 mx-auto mb-1" />
                  Attendance
                </button>
                <button
                  onClick={() => setSelectedApplicationType('LEAVE')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedApplicationType === 'LEAVE'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Plane className="h-4 w-4 mx-auto mb-1" />
                  Leave
                </button>
              </div>
            </div>

            {/* Leave Description Input (only for leave) */}
            {selectedApplicationType === 'LEAVE' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Description
                </label>
                <textarea
                  value={leaveDescription}
                  onChange={(e) => setLeaveDescription(e.target.value)}
                  placeholder="Enter reason for leave..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Duration Options */}
            <div className="space-y-3 mb-6">
              {selectedApplicationType === 'ATTENDANCE' ? (
                <>
                  <button
                    onClick={() => handleAttendanceConfirm('FULL_DAY')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Full Day Attendance
                  </button>
                  <button
                    onClick={() => handleAttendanceConfirm('HALF_DAY')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Half Day Attendance
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleLeaveConfirm('FULL_DAY')}
                    disabled={!leaveDescription.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Full Day Leave
                  </button>
                  <button
                    onClick={() => handleLeaveConfirm('HALF_DAY')}
                    disabled={!leaveDescription.trim()}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Half Day Leave
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleCancel}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Punch Out Modal */}
      {isPunchOutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <LogOut className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apply for Punch Out
              </h3>
              <p className="text-sm text-gray-600">
                Request approval to punch out for today
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={handlePunchOutConfirm}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Submit Punch Out Request
              </button>
            </div>

            <button
              onClick={handleCancel}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component
const AttendanceDemo: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance | null>(null);

  const handleApplyAttendance = (workingHour: WorkingHour) => {
    console.log(`Applied for ${workingHour} attendance`);
    const now = new Date();
    
    setAttendance({
      _id: '1',
      staffId: 'STAFF001',
      date: now,
      branch: 'Main Branch',
      type: 'ATTENDANCE',
      workingHour,
      punchIn: {
        time: now,
        isApproved: true
      },
      punchOut: {
        time: now,
        isApproved: false,
        status: 'NOT APPLIED'
      },
      status: 'PRESENT',
      leaveDescription: '',
      createdAt: now,
      updatedAt: now
    });
  };

  const handleApplyLeave = (workingHour: WorkingHour, description: string) => {
    console.log(`Applied for ${workingHour} leave: ${description}`);
    const now = new Date();
    
    setAttendance({
      _id: '2',
      staffId: 'STAFF001',
      date: now,
      branch: 'Main Branch',
      type: 'LEAVE',
      workingHour,
      punchIn: {
        time: now,
        isApproved: false
      },
      punchOut: {
        time: now,
        isApproved: false,
        status: 'NOT APPLIED'
      },
      status: 'PENDING',
      leaveDescription: description,
      createdAt: now,
      updatedAt: now
    });
  };

  const handleApplyPunchOut = () => {
    console.log('Applied for punch out');
    if (attendance) {
      setAttendance({
        ...attendance,
        punchOut: {
          ...attendance.punchOut,
          status: 'PENDING'
        },
        updatedAt: new Date()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <AttendanceStatus 
          attendance={attendance}
          onApplyAttendance={handleApplyAttendance}
          onApplyLeave={handleApplyLeave}
          onApplyPunchOut={handleApplyPunchOut}
        />
        
        {/* Demo Controls */}
        <div className="mt-8 max-w-lg mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Demo: Quick Status Changes
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={() => setAttendance(null)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm"
            >
              Reset (No Application)
            </button>
            
            <button
              onClick={() => {
                const now = new Date();
                setAttendance({
                  _id: '3',
                  staffId: 'STAFF001',
                  date: now,
                  branch: 'Main Branch',
                  type: 'LEAVE',
                  workingHour: 'FULL_DAY',
                  punchIn: { time: now, isApproved: false },
                  punchOut: { time: now, isApproved: false, status: 'NOT APPLIED' },
                  status: 'LEAVE PAID',
                  leaveDescription: 'Medical appointment',
                  createdAt: now,
                  updatedAt: now
                });
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm"
            >
              Set Leave Paid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDemo;