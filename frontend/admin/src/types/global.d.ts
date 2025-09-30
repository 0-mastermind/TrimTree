declare module "*.css";
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

interface Bonus {
  date: string;
  description: string;
  amount: number;
  _id?: string;
}

interface Payment {
  from: string;
  to: string;
  amount: number;
  _id?: string;
}

export interface Staff {
  _id: string;
  userId: User;
  designation?: string;
  manager: string;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
  payments: Payment[];
  bonus: Bonus[];
}

export interface BranchManagerByNameState {
  _id: string;
  name: string;
  branch: {
    _id: string;
    name: string;
  };
}

export interface SalaryAnalticsState {
  grossSalary: string;
  halfDayPresentSalary: string;
  fullDaySalary: string;
  paidHolidaySalary: string;
  totalWorkingHolidaySalary: string;
  totalSalary: string;
  totalBonus: string;
}

export interface AttendanceAnalyticsState {
  totalPresent: number;
  totalHalfDayPresent: number;
  totalFullDayPresent: number;
  totalAbsent: number;
  totalPaidHoliday: number;
  totalWorkingHoliday: number;
  totalLeave: number;
  totalDays: number;
}
export interface EmployeeAnalyticsState {
  attendance: AttendanceAnalyticsState;
  salary: SalaryAnalticsState;
}

export type attendanceType = "LEAVE" | "ATTENDANCE";

export type WorkingHour = "FULL_DAY" | "HALF_DAY";

export type punchOutStatus =
  | "NOT APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type attendanceStatus =
  "PENDING"|
  "PRESENT"|
  "ABSENT"|
  "LEAVE"|
  "HOLIDAY"|
  "WORKING HOLIDAY"|
  "REJECTED LEAVE"|
  "DISMISSED";

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
