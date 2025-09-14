export enum userRoles {
  ADMIN="ADMIN",
  MANAGER="MANAGER",
  STAFF="STAFF"
}

export const EnumUserRoles = Object.values(userRoles);

export enum attendanceStatus {
  PENDING="PENDING",
  DISMISSED="DISMISSED",
  PRESENT="PRESENT",
  ABSENT="ABSENT",
  HOLIDAY="HOLIDAY",
  WORKING_HOLIDAY="WORKING HOLIDAY",
  REJECTED_LEAVE="REJECTED LEAVE",
  LEAVE_PAID="LEAVE PAID",
  LEAVE_UNPAID="LEAVE UNPAID"
}

export const EnumAttendanceStatus = Object.values(attendanceStatus);

export enum leaveStatus {
  PENDING="PENDING",
  APPROVED="APPROVED",
  REJECTED="REJECTED"
}

export const EnumLeaveStatus = Object.values(leaveStatus);

export enum punchOutStatus {
  NOT_APPLIED="NOT APPLIED",
  PENDING="PENDING",
  APPROVED="APPROVED",
  REJECTED="REJECTED"
}

export const EnumPunchOutStatus = Object.values(punchOutStatus);



export enum leaveType {
 LEAVE_PAID='LEAVE PAID',
 LEAVE_UNPAID='LEAVE UNPAID'
}

export const EnumLeaveType = Object.values(leaveType);

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