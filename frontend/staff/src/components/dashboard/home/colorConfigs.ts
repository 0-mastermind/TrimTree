  import type { attendanceStatus, punchOutStatus } from "@/types/type";
  import { AlertCircle, AlertTriangle, Ban, Briefcase, Calendar, CheckCircle, CheckSquare, Clock, DollarSign, Timer, XCircle } from "lucide-react";

  export const getStatusConfig = (status: attendanceStatus) => {
      const configs = {
        'PENDING': {
          icon: Timer,
          label: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        },
        'PRESENT': {
          icon: CheckCircle,
          label: 'Present',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        },
        'ABSENT': {
          icon: XCircle,
          label: 'Absent',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        },
        'DISMISSED': {
          icon: AlertTriangle,
          label: 'Dismissed',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600'
        },
        'HOLIDAY': {
          icon: Calendar,
          label: 'Holiday',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600'
        },
        'REJECTED LEAVE': {
          icon: Ban,
          label: 'Rejected Leave',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        },
        'LEAVE PAID': {
          icon: DollarSign,
          label: 'Leave Paid',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-800',
          iconColor: 'text-emerald-600'
        },
        'LEAVE UNPAID': {
          icon: XCircle,
          label: 'Leave Unpaid',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600'
        },
        'WORKING HOLIDAY': {
          icon: Briefcase,
          label: 'Working Holiday',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          iconColor: 'text-purple-600'
        }
      };
      return configs[status];
    };

  export const getPunchOutStatusConfig = (status: punchOutStatus) => {
      const configs = {
        'NOT APPLIED': {
          icon: Clock,
          label: 'Not Applied',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          iconColor: 'text-gray-400',
          borderColor: 'border-gray-200'
        },
        'PENDING': {
          icon: Timer,
          label: 'Pending Approval',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-200'
        },
        'APPROVED': {
          icon: CheckSquare,
          label: 'Approved',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-500',
          borderColor: 'border-green-200'
        },
        'REJECTED': {
          icon: AlertCircle,
          label: 'Rejected',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          iconColor: 'text-red-500',
          borderColor: 'border-red-200'
        }
      };
      return configs[status];
    };