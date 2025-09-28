const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api";

// AUTH ENDPOINTS
export const AuthEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login/admin",
  LOGOUT_API: BASE_URL + "/auth/logout",
  PROFILE_API: BASE_URL + "/auth/profile",
  CREATE_USER_API: BASE_URL + "/auth/register",
};

export const BranchEndpoints = {
  GET_BRANCHES_API: BASE_URL + "/admin/branches",
  CREATE_BRANCH_API: BASE_URL + "/admin/create-branch"
}

export const EmployeeEndpoints = {
  GET_BRANCH_EMPLOYEES_API: BASE_URL + "/staff/get-staff-by-branch",
  GET_EMPLOYEES_BY_MANAGER_API: BASE_URL + "/staff/get-staff-by-manager",
  GET_ALL_EMPLOYEES_API: BASE_URL + "/staff/get-all-staff-members",
}

export const ManagerEndpoints = {
  GET_MANAGER_BY_BRANCH_NAME: BASE_URL + "/admin/getManagerNameByBranch",
}