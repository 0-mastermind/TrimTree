import { Schema, Model } from "mongoose";

const staffSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    leaves: [
      {
        date: {
          type: String,
          required: true,
        },
        isApproved: {
          type: Boolean,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    attendance: [
      {
        date: {
          type: String,
          required: true,
        },
        punchInTime: {
          time: Date,
          isApproved: Boolean,
        },
        punchOutTime: {
          time: Date,
          isApproved: Boolean,
        },
      },
    ],
    designation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Staff = new Model("Staff", staffSchema);