import type { JSX } from "react";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  protected?: boolean;
  guest?: boolean;
}

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";


export interface User {
  _id: string;
  name: string;
  username: string;
  image: {
    url: string;
    public_id: string;
  }
  email?: string;
  role: UserRole;
  branch: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  _id: string;         
  userId: User;       
  designation?: string;
  manager: string;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
}

export type attendanceType = 'LEAVE' |"ATTENDANCE";

export type WorkingHour = 'FULL_DAY' | 'HALF_DAY';

export type punchOutStatus = 'NOT APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type attendanceStatus = 
  | 'PENDING' 
  | 'DISMISSED' 
  | 'PRESENT' 
  | 'ABSENT' 
  | 'HOLIDAY' 
  | 'REJECTED LEAVE' 
  | 'LEAVE PAID' 
  | 'LEAVE UNPAID' 
  | 'WORKING HOLIDAY';

export interface Attendance  {
  _id: string;
  staffId: string;
  date: Date;
  branch: string;
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