import ReviewsModel from "../models/reviews.model.js";
import SliderModel from "../models/slider.model.js";
import StaffModel from "../models/staff.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const createReview = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { customerName, service, rating, comment } = req.body;

    if (!customerName || !service || !rating || !comment) {
      throw new ApiError(400, "All fields are required");
    }

   await ReviewsModel.create({
      customerName,
      service,
      rating,
      comment,
    });

    return new ApiResponse({
      statusCode: 201,
      message: "Review created successfully",
    }).send(res);
  }
);

export const getAllReviews = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const reviews = await ReviewsModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  }
);

export const fetchReviewById = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await ReviewsModel.findById(id);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    return new ApiResponse({
      statusCode: 200,
      message: "Review fetched successfully",
      data: review,
    }).send(res);
  }
);

export const updateReview = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { customerName, service, rating, comment } = req.body;

    if (!customerName && !service && !rating && !comment) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const review = await ReviewsModel.findById(id);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    review.customerName = customerName || review.customerName;
    review.service = service || review.service;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Review updated successfully",
    }).send(res);
  }
);

export const deleteReview = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await ReviewsModel.findById(id);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    await review.deleteOne();

    return new ApiResponse({
      statusCode: 200,
      message: "Review deleted successfully",
    }).send(res);
  }
);

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

export const addToSlider = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, price ,description} = req.body;

    if (!name || !price || !description) {
      throw new ApiError(400, "Name price and description are required!");
    }

    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    };

    const thumbnail = files?.thumbnail?.[0];
    const gallery = files?.gallery;

    if (!thumbnail) throw new ApiError(400, "Thumbnail image is required!");
    if (!gallery || gallery.length === 0)
      throw new ApiError(400, "At least one gallery image is required!");

    const thumbnailUpload = await uploadOnCloudinary(
      thumbnail.path,
      "slider/thumbnail"
    );
    const galleryUploads = await Promise.all(
      gallery.map(async (file) => {
        const result = await uploadOnCloudinary(file.path, "slider/gallery");
        return { url: result.secure_url, publicId: result.public_id };
      })
    );

    const newSliderItem = await SliderModel.create({
      name,
      price,
      thumbnail: {
        url: thumbnailUpload.secure_url,
        publicId: thumbnailUpload.public_id,
      },
      gallery: galleryUploads,
      description
    });

    return new ApiResponse({
      statusCode: 201,
      message: "New slider item added successfully!",
      data: newSliderItem,
    }).send(res);
  }
);

export const getSliderItems = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const sliderItems = await SliderModel.find().sort({ createdAt: -1 });
    return new ApiResponse({
      statusCode: 200,
      message: "Slider items fetched successfully!",
      data: sliderItems,
    }).send(res);
  }
);

export const updateSliderItem = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, price , description} = req.body;

    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    };

    const thumbnail = files?.thumbnail?.[0];
    const gallery = files?.gallery;
    let thumbnailUpload = null;
    let galleryUploads = null;
    if (thumbnail) {
      thumbnailUpload = await uploadOnCloudinary(
        thumbnail.path,
        "slider/thumbnail"
      );
      cloudinary.uploader.destroy(thumbnailUpload.public_id);
    }
    if (gallery && gallery.length > 0) {
      galleryUploads = await Promise.all(
        gallery.map(async (file) => {
          const result = await uploadOnCloudinary(file.path, "slider/gallery");
          return { url: result.secure_url, publicId: result.public_id };
        })
      );
      galleryUploads.forEach(async (item) => {
        await cloudinary.uploader.destroy(item.publicId);
      });
    }

    const sliderItem = await SliderModel.findById(id);
    if (!sliderItem) {
      throw new ApiError(404, "Slider item not found");
    }

    sliderItem.name = name || sliderItem.name;
    sliderItem.price = price || sliderItem.price;
    sliderItem.description = description || sliderItem.description;
    if (thumbnailUpload) {
      sliderItem.thumbnail = {
        url: thumbnailUpload.secure_url,
        publicId: thumbnailUpload.public_id,
      };
    }
    if (galleryUploads && galleryUploads.length > 0) {
      sliderItem.gallery = galleryUploads;
    }

    await sliderItem.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Slider item updated successfully",
      data: sliderItem,
    }).send(res);
  }
);

export const deleteSliderItem = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const sliderItem = await SliderModel.findById(id);
    if (!sliderItem) {
      throw new ApiError(404, "Slider item not found");
    }

    await cloudinary.uploader.destroy(sliderItem.thumbnail.publicId);
    for (const item of sliderItem.gallery) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    await sliderItem.deleteOne();

    return new ApiResponse({
      statusCode: 200,
      message: "Slider item deleted successfully",
    }).send(res);
  }
);


export const fetchSlideById = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const slide = await SliderModel.findById(id);
    if (!slide) {
      throw new ApiError(404, "Slide not found");
    }

    return new ApiResponse({
      statusCode: 200,
      message: "Slide fetched successfully",
      data: slide,
    }).send(res);
  }
);