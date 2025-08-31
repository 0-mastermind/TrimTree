import type { Types } from "mongoose";
import type { attendanceStatus, userRoles, WorkingHour } from "../utils/constants.js";

export interface IUser  {
  name: string;
  username: string;
  password: string;
  role: userRoles;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance  {
  staffId: Types.ObjectId;
  date: Date;
  type: WorkingHour;
  status: attendanceStatus;
  leaveDescription: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IStaff  {
  userId: Types.ObjectId;
  designation: string;
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