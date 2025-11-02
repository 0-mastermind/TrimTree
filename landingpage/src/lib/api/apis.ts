const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/api";

export const LandingPageEndpoints = {
  GET_REVIEWS_API: BASE_URL + "/landingpage/reviews",
  GET_EMPLOYEES_API: BASE_URL + "/landingpage/employees",
};