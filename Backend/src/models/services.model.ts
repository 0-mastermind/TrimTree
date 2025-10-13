import mongoose, { model, Model, Schema } from "mongoose";
import type { IService } from "../types/type.js";

const ServiceSchema = new Schema<IService>(
  {
    name : {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    description: {
        type: String,
        trim: true,
    }
  },
  { timestamps: true }
);

const ServiceModel: Model<IService> =
  mongoose.models.Service || model<IService>("Service", ServiceSchema);
export default ServiceModel;
