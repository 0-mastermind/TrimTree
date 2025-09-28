import type { Types } from "mongoose";
import type { attendanceStatus, attendanceType,  leaveStatus, punchOutStatus, userRoles, WorkingHour } from "../utils/constants.js";

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
  branch: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): string;
}

export interface IAttendance  {
  userId: Types.ObjectId;
  date: Date;
  branch: Types.ObjectId;
  type: attendanceType;
  workingHour: WorkingHour;
  punchIn: {
    time: Date;
    isApproved: boolean;
  };
  punchOut: {
    time: Date;
    isApproved: boolean;
    status: punchOutStatus;
  };
  status: attendanceStatus;
  leaveDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeave {
  userId: Types.ObjectId;
  branch: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: leaveStatus;
  reason?: string;
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
  branch: Types.ObjectId;
  employees: Types.ObjectId[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBranches {
  name: string;
  branchImage: {
    publicId: string;
    url: string;
  };
  address: string;
  createdAt: Date;
  updatedAt: Date;
}