import type { Types } from "mongoose";
import type { attendanceStatus, attendanceType, userRoles, WorkingHour } from "../utils/constants.js";

export interface IUser  {
  name: string;
  username: string;
  password: string;
  image: {
    url: string;
    publicId: string;
  };
  email: string;
  role: userRoles;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance  {
  staffId: Types.ObjectId;
  date: Date;
  type: attendanceType;
  workingHour: WorkingHour;
  punchIn: {
    time: Date;
    isApproved: boolean;
  };
  punchOut: {
    time: Date;
    isApproved: boolean;
  };
  status: attendanceStatus;
  leaveDescription: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IStaff  {
  userId: Types.ObjectId;
  designation: string;
  salary: number;
  createdAt: Date;
  updatedAt: Date;  
}

export interface IOfficialHoliday  {
  name: string;
  date: Date;
  type: WorkingHour;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}