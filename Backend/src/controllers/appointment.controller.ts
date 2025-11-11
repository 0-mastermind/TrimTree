import AppointmentModel from "../models/appointments.model.js";
import { emitCreateAppointment } from "../socketio.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { Request, Response } from "express";

export const createAppointment = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { customerName, description, appointmentAt, assignedStaffMember } =
      req.body;

    if (
      !customerName ||
      !description ||
      !appointmentAt ||
      !assignedStaffMember
    ) {
      throw new ApiError(400, "All fields are required!");
    }

    const createdAppointment = await AppointmentModel.create({
      customerName,
      description,
      appointmentAt,
      assignedStaffMember,
    });
    
    if (!createdAppointment) {
      throw new ApiError(500, "Appointment can't be created!");
    }
    
    const managerID = req.userId as string;
    
    emitCreateAppointment(createAppointment, managerID);
    
    return new ApiResponse({
      statusCode: 201,
      message: "Appointment Created Successfully!",
    }).send(res);
  }
);

export const updateAppointment = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const id = req.query.appointmentId;
    const { customerName, description, appointmentAt, assignedStaffMember } =
      req.body;

    if (!id) {
      throw new ApiError(400, "Appointment Id not found!");
    }

    if (
      !customerName ||
      !description ||
      !appointmentAt ||
      !assignedStaffMember
    ) {
      throw new ApiError(400, "All fields are required!");
    }

    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      throw new ApiError(404, "Can't able to find appointment");
    }

    appointment.customerName = customerName || appointment.customerName;
    appointment.description = description || appointment.description;
    appointment.appointmentAt = appointmentAt || appointment.appointmentAt;
    appointment.assignedStaffMember =
      assignedStaffMember || appointment.assignedStaffMember;

    await appointment.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Updated successfully!",
    }).send(res);
  }
);

export const deleteAppointment = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const id = req.query.appointmentId;

    if (!id) {
      throw new ApiError(400, "Appointment Id not found!");
    }

    const deletedAppointment = await AppointmentModel.findByIdAndDelete(id);

    if (!deletedAppointment) {
      throw new ApiError(500, "Appointment failed to delete");
    }

    return new ApiResponse({
      statusCode: 200,
      message: "Appointment deleted successfull!",
    }).send(res);
  }
);

export const getAllAppointment = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const appointments = await AppointmentModel.find();
    
    return new ApiResponse({
      statusCode: 200,
      message: "All appointments fetched successfully!",
      data: appointments,
    }).send(res);
  }
);

export const getAppointmentsByStaffId = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const id = req.query.staffId;

    if (!id) {
      throw new ApiError(400, "Staff Id not found!");
    }

    const appointments = await AppointmentModel.find({
      assignedStaffMember: id,
    });

    return new ApiResponse({
      statusCode: 200,
      message: "Found appointments successfully!",
      data: appointments,
    }).send(res);
  }
);
