import { ApiError } from "../utils/ApiError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import branchModel from "../models/branch.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createBranch = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, address } = req.body;
    const { branchImage } = req.files as {
      [filedName: string]: Express.Multer.File[];
    };

    if (!name && !address && !branchImage) {
      throw new ApiError(400, "All fields are required");
    }

    const imageUpload = await uploadOnCloudinary(
      branchImage[0].path,
      "Branches"
    );

    if (!imageUpload) {
      throw new ApiError(500, "Error while uploading image");
    }

    const branch = await branchModel.create({
      name,
      address,
      branchImage: {
        publicId: imageUpload.public_id,
        url: imageUpload.secure_url,
      },
    });

    if (!branch) {
      throw new ApiError(500, "Error while storing branch data");
    }

   
      return new ApiResponse({
        statusCode: 201,
        message: "Branch created successfully!",
      }).send(res);
  }
);
