export enum userRoles {
  ADMIN="ADMIN",
  MANAGER="MANAGER",
  STAFF="STAFF"
}

export const EnumUserRoles = Object.values(userRoles);

export enum attendanceStatus {
  PENDING="PENDING",
  PRESENT="PRESENT",
  ABSENT="ABSENT",
  HOLIDAY="HOLIDAY",
  WORKING_HOLIDAY="WORKING HOLIDAY",
  LEAVE_PAID="LEAVE PAID",
  LEAVE_UNPAID="LEAVE UNPAID"
}

export const EnumAttendanceStatus = Object.values(attendanceStatus);

export enum WorkingHour {
  FULL_DAY="FULL_DAY",
  HALF_DAY="HALF_DAY",
}

export const EnumWorkingHour = Object.values(WorkingHour);

export enum attendanceType {
  ATTENDANCE = "ATTENDANCE",
  LEAVE = "LEAVE",
}

export const EnumAttendanceType = Object.values(attendanceType);


export enum Branch {
  BRANCH1 = "BRANCH1",
  BRANCH2 = "BRANCH2",
  BRANCH3 = "BRANCH3",
}

export const EnumBranch = Object.values(attendanceType);