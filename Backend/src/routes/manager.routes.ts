import { Router } from "express";
import { authMiddleware, managerMiddleware } from "../middleware/auth.middleware.js";
import { approveAttendance, approveLeaves, approvePunchOut, createOfficialHoliday, getAllPendingAttendance, getAllPendingLeaves, getAllPendingPunchOuts, getMonthlyOfficialHolidays, rejectAttendance, rejectLeaves, rejectPunchOut } from "../controllers/manager.controller.js";

const managerRouter = Router();

managerRouter.post("/create-holiday", authMiddleware ,managerMiddleware, createOfficialHoliday);  

managerRouter.patch("/approve-attendance/:attendanceId", authMiddleware ,  managerMiddleware , approveAttendance);  

managerRouter.patch("/reject-attendance/:attendanceId", authMiddleware ,  managerMiddleware , rejectAttendance);

managerRouter.patch("/approve-leave" , authMiddleware , managerMiddleware , approveLeaves);

managerRouter.patch("/reject-leave" , authMiddleware , managerMiddleware , rejectLeaves);

managerRouter.patch("/approve-punch-out/:attendanceId", authMiddleware ,  managerMiddleware , approvePunchOut);

managerRouter.patch("/reject-punch-out/:attendanceId", authMiddleware ,  managerMiddleware , rejectPunchOut);

managerRouter.get("/attendance/pending", authMiddleware , managerMiddleware , getAllPendingAttendance);

managerRouter.get("/leaves/pending", authMiddleware , managerMiddleware , getAllPendingLeaves);

managerRouter.get("/punchOut/pending", authMiddleware , managerMiddleware , getAllPendingPunchOuts);

managerRouter.get("/holidays/monthly", authMiddleware , managerMiddleware , getMonthlyOfficialHolidays);


export default managerRouter;
