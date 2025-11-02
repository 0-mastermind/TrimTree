import mongoose, { Model, Schema, model } from "mongoose";
import type { ISlider } from "../types/type.js";
const Slider = new Schema<ISlider>(
  {
    name : {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },  
    gallery: [
        {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        }
    ],
    },
  { timestamps: true }
);


const SliderModel: Model<ISlider> =
  mongoose.models.Slider || model<ISlider>("Slider", Slider);
export default SliderModel;