import {Schema, Model} from "mongoose";

const HolidaySchema = new Schema({
  holidayFrom: {
    type: String,
    required: true,
  },
  holidayTill: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  staffMembers: [ // to whom the holiday is granted
    {
      type: Schema.Types.ObjectId,
      ref: "User"        
    }
  ]
}, {
  timestamps: true,
});

export const Holiday = new Model("Holiday", HolidaySchema)