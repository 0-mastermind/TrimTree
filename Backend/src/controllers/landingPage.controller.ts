import ReviewsModel from "../models/reviews.model.js";
import StaffModel from "../models/staff.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { Request, Response } from "express";

export const createReview = asyncErrorHandler( async (req : Request, res : Response) => {
    const { customerName, service, rating, comment } = req.body;

    if (!customerName || !service || !rating || !comment) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const newReview = await ReviewsModel.create({
        customerName,
        service,
        rating,
        comment
    });

    res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: newReview
    });
});

export const getAllReviews = asyncErrorHandler( async (req : Request, res : Response) => {
    const reviews =  await ReviewsModel.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        data: reviews
    });
});

export const updateReview = asyncErrorHandler( async (req : Request, res : Response) => {
    const { id } = req.params;
    const { customerName, service, rating, comment } = req.body;

    if (!customerName && !service && !rating && !comment) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required to update"
        });
    }

    const review = await ReviewsModel.findById(id);
    if (!review) {
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    }

    review.customerName = customerName || review.customerName;
    review.service = service || review.service;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review
    });
});

export const deleteReview = asyncErrorHandler( async (req : Request, res : Response) => {
    const { id } = req.params;

    const review = await ReviewsModel.findById(id);
    if (!review) {
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    }

    await review.deleteOne();

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});

export const getEmployees = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffList = await StaffModel.find()
      .populate({
        path: "userId",
        select: "name username image",
      })
      .select("designation");

    return new ApiResponse({
      statusCode: 200,
      message: "All staff members fetched successfully!",
      data: staffList,
    }).send(res);
  }
);