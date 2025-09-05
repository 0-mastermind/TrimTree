import type { Types } from "mongoose";
import type { attendanceStatus, attendanceType, Branch, userRoles, WorkingHour } from "../utils/constants.js";

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
  branch: Branch;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): string;
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
  manager: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;  
}

export interface IOfficialHoliday  {
  name: string;
  date: Date;
  type: WorkingHour;
  branch: Branch;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}