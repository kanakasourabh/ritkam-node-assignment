import { Schema, model } from "mongoose";

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Group = model("Group", groupSchema);
