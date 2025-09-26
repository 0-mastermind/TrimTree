export interface DemoState {
  message: string;
}

export interface StoreData {
  branchImage: string;
  branchName: string;
  address: string;
  branchURL: string;
}

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";

export interface User {
  _id: string;
  name: string;
  username: string;
  image?: {
    url: string;
    public_id: string;
  };
  email?: string;
  role: UserRole;
  branch: Branch;
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

export type attendanceType = "LEAVE" | "ATTENDANCE";

export type WorkingHour = "FULL_DAY" | "HALF_DAY";

export type punchOutStatus =
  | "NOT APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type attendanceStatus =
  | "PENDING"
  | "DISMISSED"
  | "PRESENT"
  | "ABSENT"
  | "HOLIDAY"
  | "REJECTED LEAVE"
  | "LEAVE PAID"
  | "LEAVE UNPAID"
  | "WORKING HOLIDAY";

export interface Attendance {
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

export interface Branch {
  _id: string;
  name: string;
  branchImage: {
    publicId: string;
    url: string;
  };
  address: string;
  updatedAt: Date;
  createdAt: Date;
}
