import { Router } from "express";
import { adminMiddleware, authMiddleware , generalAdminMiddleware, managerMiddleware, staffMiddleware } from "../middleware/auth.middleware.js";
import { applyForAttendance, applyForLeave, applyForPunchOut, getLeaveHistory, getMonthlyAttendance, getStaffDetails, getStaffList, getStaffListByBranch, getStaffListByManager, getTodayAttendanceStatus } from "../controllers/staff.controller.js";

const staffRouter = Router();

staffRouter.post("/apply-attendance", authMiddleware ,staffMiddleware , applyForAttendance);  

staffRouter.post("/apply-leave", authMiddleware ,staffMiddleware , applyForLeave)

staffRouter.post("/apply-punch-out", authMiddleware ,staffMiddleware , applyForPunchOut);

staffRouter.get("/attendance/monthly", authMiddleware , staffMiddleware , getMonthlyAttendance);

staffRouter.get("/attendance/today", authMiddleware , staffMiddleware , getTodayAttendanceStatus);

staffRouter.get("/get-all-staff-members", authMiddleware, generalAdminMiddleware, getStaffList);

staffRouter.get("/get-staff-by-manager", authMiddleware, managerMiddleware, getStaffListByManager);

staffRouter.get("/get-staff-by-branch", authMiddleware, generalAdminMiddleware, getStaffListByBranch);

staffRouter.get("/get-staff-details", authMiddleware, adminMiddleware, getStaffDetails);

staffRouter.get("/leave/history", authMiddleware ,  getLeaveHistory);

export default staffRouter;
