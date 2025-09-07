import { Router } from "express";
import { authMiddleware, managerMiddleware } from "../middleware/auth.middleware.js";
import { approveAttendance, approveLeaves, approvePunchOut, createOfficialHoliday, rejectLeaves } from "../controllers/manager.controller.js";

const managerRouter = Router();

managerRouter.post("/create-holiday", authMiddleware ,managerMiddleware, createOfficialHoliday);  

managerRouter.post("/approve-attendance/:attendanceId", authMiddleware ,  managerMiddleware , approveAttendance);  

managerRouter.post("/reject-attendance/:attendanceId", authMiddleware ,  managerMiddleware , approveAttendance);

managerRouter.post("/approve-leave" , authMiddleware , managerMiddleware , approveLeaves);

managerRouter.post("/reject-leave" , authMiddleware , managerMiddleware , rejectLeaves);

managerRouter.post("/approve-punch-out/:attendanceId", authMiddleware ,  managerMiddleware , approvePunchOut);


export default managerRouter;
