import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath: string,
  folderName: string
): Promise<UploadApiResponse | null> => {
  try {
    const response: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
        folder: folderName,
      }
    );

    return response;
  } catch (error) {
    console.log("Error in cloudinary upload: ", error);
    return null;
  }
};

export { uploadOnCloudinary };
