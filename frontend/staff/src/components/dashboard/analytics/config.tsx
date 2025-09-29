import type { attendanceStatus } from "@/types/type";
import { AlertTriangle, CheckCircle2, Coffee, MapPin, Plane, XCircle } from "lucide-react";

type StatusMeta = {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
};

export const statusMeta: Record<attendanceStatus, StatusMeta> = {
  PENDING: {
    label: "Pending",
    color: "bg-gray-500",
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  PRESENT: {
    label: "Present",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  ABSENT: {
    label: "Absent",
    color: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
  },  
  LEAVE: {
    label: "Leave",
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    icon: <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  HOLIDAY: {
    label: "Holiday",
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    icon: <Plane className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  "WORKING HOLIDAY": {
    label: "Working Holiday",
    color: "bg-indigo-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  "REJECTED LEAVE": {
    label: "Rejected Leave",
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
    icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
  DISMISSED: {
    label: "Dismissed",
    color: "bg-gray-400",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
};