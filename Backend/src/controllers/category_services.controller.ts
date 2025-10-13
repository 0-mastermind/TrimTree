import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import ServiceModel from "../models/services.model.js";

export const createCategory = asyncErrorHandler( 
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const { image } = req.files as {
      [filedName: string]: Express.Multer.File[];
    };

    if (!name && !image) {
      throw new ApiError(400, "All fields are required");
    }

    const imageUpload = await uploadOnCloudinary(
      image[0].path,
      "Categories"
    );

    if (!imageUpload) {
      throw new ApiError(500, "Error while uploading image");
    }

    const category = await CategoryModel.create({
      name,
      image: {
        publicId: imageUpload.public_id,
        url: imageUpload.secure_url,
      },
    });

    if (!category) {
      throw new ApiError(500, "Error while storing category data");
    }

    return new ApiResponse({
      statusCode: 201,
      message: "Category created successfully!",
    }).send(res);
  }
);

export const getAllCategories = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const categoriesList = await CategoryModel.find();

    return new ApiResponse({
      statusCode: 200,
      message: "Categories fetched successfully!",
      data: categoriesList,
    }).send(res);
  }
);


export const updateCategory = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId;
    const { name } = req.body;
    const { image } = req.files as {
      [filedName: string]: Express.Multer.File[];
    };

    if (!categoryId) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (name) {
      category.name = name;
    }

    if (image && image.length > 0) {
      if (category.image && category.image.publicId) {
        await cloudinary.uploader.destroy(category.image.publicId);
      }

      const imageUpload = await uploadOnCloudinary(
        image[0].path,
        "Categories"
      );

      if (!imageUpload) {
        throw new ApiError(500, "Error while uploading image");
      }

      category.image = {
        publicId: imageUpload.public_id,
        url: imageUpload.secure_url,
      };
    }

    await category.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Category updated successfully!",
    }).send(res);
  }
);

export const deleteCategory = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId;

    if (!categoryId) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (category.image && category.image.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId);
    }

    await CategoryModel.findByIdAndDelete(categoryId);

    return new ApiResponse({
      statusCode: 200,
      message: "Category deleted successfully!",
    }).send(res);
  }
);

export const createService = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, price, categoryId, description } = req.body;
    if (!name || !price || !categoryId || !description) {
      throw new ApiError(400, "All fields are required");
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    await ServiceModel.create({
      name,
      price,
      category: categoryId,
      description,
    });

    throw new ApiResponse({
      statusCode: 201,
      message: "Service created successfully!",
    }).send(res);
  }
);

export const getAllServices = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const servicesList = await ServiceModel.find().populate("category");
    return new ApiResponse({
      statusCode: 200,
      message: "Services fetched successfully!",
      data: servicesList,
    }).send(res);
  }
);

export const updateService = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const serviceId = req.query.serviceId;
    const { name, price, categoryId, description } = req.body;

    if (!serviceId) {
      throw new ApiError(400, "Service ID is required");
    }

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new ApiError(404, "Category not found");
      }
      service.category = categoryId;
    }

    if (name) service.name = name;
    if (price) service.price = price;
    if (description) service.description = description;

    await service.save();

    return new ApiResponse({  
      statusCode: 200,
      message: "Service updated successfully!",
    }).send(res);
  }
);

export const deleteService = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const serviceId = req.query.serviceId;

    if (!serviceId) {
      throw new ApiError(400, "Service ID is required");
    }

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    await ServiceModel.findByIdAndDelete(serviceId);

    return new ApiResponse({
      statusCode: 200,
      message: "Service deleted successfully!",
    }).send(res);
  }
);  

export const getServicesByCategory = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId;

    if (!categoryId) {
      throw new ApiError(400, "Category ID is required");
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const servicesList = await ServiceModel.find({ category: categoryId });

    return new ApiResponse({
      statusCode: 200,
      message: "Services fetched successfully!",
      data: servicesList,
    }).send(res);
  }
);  
