import { Router } from "express";
import { adminMiddleware, authMiddleware, generalAdminMiddleware, managerMiddleware } from "../middleware/auth.middleware.js";
import { approveAttendance, approveLeaves, approvePunchOut, createOfficialHoliday, deleteBonusByDate, dismissAttendance, getAllAbsentAttendance, getAllPendingAttendance, getAllPendingLeaves, getAllPendingPunchOuts, getMonthlyOfficialHolidays, getAllPresentAttendance, getAllNotAppliedAttendance, giveBonusToEmployee, rejectAttendance, rejectLeaves, rejectPunchOut, getStaffByManager } from "../controllers/manager.controller.js";

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

managerRouter.get("/attendance/absenties", authMiddleware , managerMiddleware , getAllAbsentAttendance);

managerRouter.get("/attendance/presenties", authMiddleware , managerMiddleware , getAllPresentAttendance);

managerRouter.get("/attendance/not-applied", authMiddleware , managerMiddleware , getAllNotAppliedAttendance);

managerRouter.get("/leaves/pending", authMiddleware , managerMiddleware , getAllPendingLeaves);

managerRouter.get("/punchOut/pending", authMiddleware , managerMiddleware , getAllPendingPunchOuts);

managerRouter.get("/holidays/monthly", authMiddleware , managerMiddleware , getMonthlyOfficialHolidays);

managerRouter.get("/get-all-staff-members", authMiddleware, managerMiddleware, getStaffByManager);

managerRouter.patch("/add-staff-bonus", authMiddleware, generalAdminMiddleware, giveBonusToEmployee);

managerRouter.delete("/delete-bonus-by-date", authMiddleware, generalAdminMiddleware, deleteBonusByDate);


export default managerRouter;
