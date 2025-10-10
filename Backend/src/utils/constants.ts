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
  WORKING_HOLIDAY="WORKING_HOLIDAY",
  REJECTED_LEAVE="REJECTED_LEAVE",
  LEAVE="LEAVE",
}

export const EnumAttendanceStatus = Object.values(attendanceStatus);

export enum leaveStatus {
  PENDING="PENDING",
  APPROVED="APPROVED",
  REJECTED="REJECTED"
}

export const EnumLeaveStatus = Object.values(leaveStatus);

export enum punchOutStatus {
  NOT_APPLIED="NOT_APPLIED",
  PENDING="PENDING",
  APPROVED="APPROVED",
  REJECTED="REJECTED"
}

export const EnumPunchOutStatus = Object.values(punchOutStatus);


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