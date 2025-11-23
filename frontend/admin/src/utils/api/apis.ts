const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api";

// AUTH ENDPOINTS
export const AuthEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login/admin",
  LOGOUT_API: BASE_URL + "/auth/logout",
  PROFILE_API: BASE_URL + "/auth/profile",
  CREATE_USER_API: BASE_URL + "/auth/register",
  AUTHENTICATE_USER_API: BASE_URL + "/auth/authenticate",
};

export const BranchEndpoints = {
  GET_BRANCHES_API: BASE_URL + "/admin/branches/owned",
  CREATE_BRANCH_API: BASE_URL + "/admin/create-branch",
};

export const EmployeeEndpoints = {
  GET_BRANCH_EMPLOYEES_API: BASE_URL + "/staff/get-staff-by-branch",
  GET_EMPLOYEES_BY_MANAGER_API: BASE_URL + "/staff/get-staff-by-manager",
  GET_ALL_EMPLOYEES_API: BASE_URL + "/staff/get-all-staff-members",
  GET_SPECIFIC_EMPLOYEE_API: BASE_URL + "/staff/specific-employee-details",
  GET_SPECIFIC_EMPLOYEE_ANALYTICS_API: BASE_URL + "/staff/employee-analytics",
  GET_EMPLOYEE_MONTHLY_ATTENDANCE_API: BASE_URL + "/admin/attendance/monthly",
  ADD_EMPLOYEE_BONUS_API: BASE_URL + "/manager/add-staff-bonus",
  REMOVE_EMPLOYEE_BONUS_API: BASE_URL + "/manager/delete-bonus-by-date",
  MARK_PAYMENT_API: BASE_URL + "/admin/mark-employee-payment",
  DELETE_STAFF_API: BASE_URL + "/admin/delete/staff",
};

export const ManagerEndpoints = {
  ADD_OFFICIAL_HOLIDAY_API: BASE_URL + "/manager/create-holiday",
  GET_OFFICIAL_HOLIDAYS_API: BASE_URL + "/manager/holidays/monthly",
  GET_MANAGER_BY_BRANCH_NAME_API: BASE_URL + "/admin/getManagerNameByBranch",
  GET_STAFF_BY_MANAGER_API: BASE_URL + "/manager/get-all-staff-members",
};

export const AttendanceEndpoints = {
  PENDING_ATTENDANCE_API: BASE_URL + "/manager/attendance/pending",
  ABSENT_ATTENDANCE_API: BASE_URL + "/manager/attendance/absenties",
  PRESENT_ATTENDANCE_API: BASE_URL + "/manager/attendance/presenties",
  NOT_APPLIED_ATTENDANCE_API: BASE_URL + "/manager/attendance/not-applied",
  PENDING_LEAVES_API: BASE_URL + "/manager/leaves/pending",
  PENDING_PUNCHOUT_API: BASE_URL + "/manager/punchOut/pending",
  APPROVE_ATTENDANCE_API: BASE_URL + "/manager/approve-attendance",
  REJECT_ATTENDANCE_API: BASE_URL + "/manager/reject-attendance",
  DISMISS_ATTENDANCE_API: BASE_URL + "/manager/dismiss-attendance",
  REJECT_PUNCHOUT_API: BASE_URL + "/manager/reject-punch-out",
  APPROVE_PUNCHOUT_API: BASE_URL + "/manager/approve-punch-out",
  APPROVE_LEAVE_API: BASE_URL + "/manager/approve-leave",
  REJECT_LEAVE_API: BASE_URL + "/manager/reject-leave",
};

export const LandingPageEndpoints = {
  GET_SLIDERS_API: BASE_URL + "/landingpage/slider",
  GET_SLIDER_BY_ID_API: (id: string) => `${BASE_URL}/landingpage/slider/${id}`,
  CREATE_SLIDER_API: BASE_URL + "/landingpage/slider/create",
  UPDATE_SLIDER_API: (id: string) =>
    `${BASE_URL}/landingpage/slider/update/${id}`,
  DELETE_SLIDER_API: (id: string) =>
    `${BASE_URL}/landingpage/slider/delete/${id}`,
  GET_REVIEWS_API: BASE_URL + "/landingpage/reviews",
  CREATE_REVIEW_API: BASE_URL + "/landingpage/reviews/create",
  UPDATE_REVIEW_API: (id: string) =>
    `${BASE_URL}/landingpage/reviews/update/${id}`,
  DELETE_REVIEW_API: (id: string) =>
    `${BASE_URL}/landingpage/reviews/delete/${id}`,
  GET_REVIEW_BY_ID_API: (id: string) => `${BASE_URL}/landingpage/reviews/${id}`,
};

export const AppointmentsEndpoints = {
  CREATE_APPOINTMENT_API: BASE_URL + "/appointments/create",
  UPDATE_APPOINTMENT_API: (id: string) =>
    `${BASE_URL}/appointments/update?appointmentId=${id}`,
  DELETE_APPOINTMENT_API: (id: string) =>
    `${BASE_URL}/appointments/delete?appointmentId=${id}`,
  GET_ALL_APPOINTMENTS_API: BASE_URL + "/appointments/appointments",
  GET_APPOINTMENTS_BY_STAFF_ID_API: (id: string) =>
    `${BASE_URL}/appointments/get-appointment-by-employee?staffId${id}`,
};
