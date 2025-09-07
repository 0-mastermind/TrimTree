import { Router } from "express";
import { authMiddleware , staffMiddleware } from "../middleware/auth.middleware.js";
import { applyForAttendance, applyForLeave, applyForPunchOut, getMonthlyAttendance } from "../controllers/staff.controller.js";

const staffRouter = Router();

staffRouter.post("/apply-attendance", authMiddleware ,staffMiddleware , applyForAttendance);  

staffRouter.post("/apply-leave", authMiddleware ,staffMiddleware , applyForLeave)

staffRouter.post("/apply-punch-out", authMiddleware ,staffMiddleware , applyForPunchOut);

staffRouter.get("/get-monthly-attendance", authMiddleware , staffMiddleware , getMonthlyAttendance);

export default staffRouter;
