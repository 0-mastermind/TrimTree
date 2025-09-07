import { Router } from "express";
import { authMiddleware , staffMiddleware } from "../middleware/auth.middleware.js";
import { applyForAttendance, applyForLeave, applyForPunchOut, getMonthlyAttendance, getTodayAttendanceStatus } from "../controllers/staff.controller.js";

const staffRouter = Router();

staffRouter.post("/apply-attendance", authMiddleware ,staffMiddleware , applyForAttendance);  

staffRouter.post("/apply-leave", authMiddleware ,staffMiddleware , applyForLeave)

staffRouter.post("/apply-punch-out", authMiddleware ,staffMiddleware , applyForPunchOut);

staffRouter.get("/attendance/monthly", authMiddleware , staffMiddleware , getMonthlyAttendance);

staffRouter.get("/attendance/today", authMiddleware , staffMiddleware , getTodayAttendanceStatus);



export default staffRouter;
