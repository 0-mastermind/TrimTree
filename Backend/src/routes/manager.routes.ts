import { Router } from "express";
import { adminMiddleware, authMiddleware, managerMiddleware } from "../middleware/auth.middleware.js";
import { approveAttendance, approveLeaves, approvePunchOut, createOfficialHoliday, dismissAttendance, getAllPendingAttendance, getAllPendingLeaves, getAllPendingPunchOuts, getMonthlyOfficialHolidays, rejectAttendance, rejectLeaves, rejectPunchOut } from "../controllers/manager.controller.js";

const managerRouter = Router();

managerRouter.post("/create-holiday", authMiddleware ,managerMiddleware, createOfficialHoliday);  

managerRouter.patch("/approve-attendance", authMiddleware ,  managerMiddleware , approveAttendance);  

managerRouter.patch("/reject-attendance", authMiddleware ,  managerMiddleware , rejectAttendance);

managerRouter.patch("/dismiss-attendance" , authMiddleware , managerMiddleware , dismissAttendance);

managerRouter.patch("/approve-leave" , authMiddleware , managerMiddleware , approveLeaves);

managerRouter.patch("/reject-leave" , authMiddleware , managerMiddleware , rejectLeaves);

managerRouter.patch("/approve-punch-out", authMiddleware ,  managerMiddleware , approvePunchOut);

managerRouter.patch("/reject-punch-out", authMiddleware ,  managerMiddleware , rejectPunchOut);

managerRouter.get("/attendance/pending", authMiddleware , managerMiddleware , getAllPendingAttendance);

managerRouter.get("/leaves/pending", authMiddleware , managerMiddleware , getAllPendingLeaves);

managerRouter.get("/punchOut/pending", authMiddleware , managerMiddleware , getAllPendingPunchOuts);

managerRouter.get("/holidays/monthly", authMiddleware , managerMiddleware , getMonthlyOfficialHolidays);


export default managerRouter;
