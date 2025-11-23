import multer, { type StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({});

export const multerUpload = multer({storage ,  limits: {
    fileSize: 5 * 1024 * 1024, 
  },});