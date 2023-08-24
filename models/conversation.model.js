const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Users" || "Drivers",
        },
      ],
      required: true,
    },
    messages: {
      type: [
        {
          sender: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Users" || "Drivers",
          },
          message: {
            type: String,
            required: true,
          },
          timestamp: {
            type: Date,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
