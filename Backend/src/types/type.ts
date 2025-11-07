import type { Types } from "mongoose";
import type {
  attendanceStatus,
  attendanceType,
  leaveStatus,
  punchOutStatus,
  userRoles,
  WorkingHour,
} from "../utils/constants.js";

export interface IUser {
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

export interface IAttendance {
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

export interface IStaff {
  userId: Types.ObjectId;
  designation: string;
  salary: number;
  manager: Types.ObjectId;
  bonus: {
    date: Date;
    description: string;
    amount: string;
  }[];
  payments: {
    from: Date;
    to: Date;
    amount: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOfficialHoliday {
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

export interface ICategory {
  name: string;
  image: {
    url: string;
    publicId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  name: string;
  price: number;
  category: Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviews {
  customerName: string;
  service: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointments {
  customerName: string;
  appointmentAt: Date;
  description: string;
  assignedStaffMember: Types.ObjectId;
}

export interface ISlider {
  name : string;
  price: number;
  thumbnail: {
    url: string;
    publicId: string;
  };
  description : string;
  gallery: {
    url: string;
    publicId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
