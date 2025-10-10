import multer, { type StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({});

export const multerUpload = multer({storage});