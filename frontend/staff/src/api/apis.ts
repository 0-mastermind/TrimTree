const BASE_URL = import.meta.env.VITE_BASE_URL + "/api";

// AUTH ENDPOINTS
export const AuthEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login/staff",
  LOGOUT_API: BASE_URL + "/auth/logout",
  PROFILE_API: BASE_URL + "/auth/profile",
};

// ATTENDANCE ENDPOINTS
export const AttendanceEndpoints = {
  TODAY_STATUS_API: BASE_URL + "/staff/attendance/today",
  ATTENDANCE_MONTHLY_API: BASE_URL + "/staff/attendance/monthly",
  APPLY_FOR_ATTENDANCE_API: BASE_URL + "/staff/apply-attendance",
  APPLY_FOR_LEAVE_API: BASE_URL + "/staff/apply-leave",
  APPLY_FOR_PUNCH_OUT_API: BASE_URL + "/staff/apply-punch-out",
}

