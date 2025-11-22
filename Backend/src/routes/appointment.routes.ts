import { Router } from "express";
import { createAppointment, deleteAppointment, getAllAppointment, getAppointmentsByStaffId, updateAppointment } from "../controllers/appointment.controller.js";
import { authMiddleware, generalManagerAndStaffMiddleware, managerMiddleware, staffMiddleware } from "../middleware/auth.middleware.js";

const appointmentRouter = Router();

appointmentRouter.post("/create", authMiddleware, managerMiddleware, createAppointment);

appointmentRouter.patch("/update", authMiddleware, managerMiddleware, updateAppointment);

appointmentRouter.delete("/delete", authMiddleware, managerMiddleware, deleteAppointment);

appointmentRouter.get("/get-appointment-by-employee", authMiddleware, staffMiddleware, getAppointmentsByStaffId);

appointmentRouter.get("/appointments", authMiddleware, managerMiddleware, getAllAppointment);

export default appointmentRouter;