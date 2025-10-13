import mongoose, { model, Model, Schema } from "mongoose";
import type { ICategory } from "../types/type.js";

const CategorySchema = new Schema<ICategory>(
  {
    name : {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },

  },
  { timestamps: true }
);

const CategoryModel: Model<ICategory> =
  mongoose.models.Category || model<ICategory>("Category", CategorySchema);
export default CategoryModel;
