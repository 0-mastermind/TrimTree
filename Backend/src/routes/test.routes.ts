import { multerUpload } from "../middleware/multer.middleware.js";
import { Router, type Request, type Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const fileUploads = multerUpload.fields([
  {
    name: "image",
    maxCount: 1,
  },
]);

const testRoutes = Router();

testRoutes.route("/upload").post(
  fileUploads,
  asyncErrorHandler(async (req: Request, res: Response) => {
    let files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log(files);

    const response = await uploadOnCloudinary(files.image[0].path, "test");

    if (!response) return;
    console.log(response.url);

    return res.status(200).send(
      new ApiResponse({
        statusCode: 200,
        data: response.url,
        message: "success",
      })
    );
  })
);

export { testRoutes };
