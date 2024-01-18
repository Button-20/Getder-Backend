const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSessionSchema = new Schema(
  {
    driver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },

    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    request: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Request",
    },

    start_time: {
      type: Date,
      required: true,
      default: Date.now,
    },

    end_time: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 10 * 60 * 1000),
    },

    status: {
      type: String,
      enum: ["active", "expired", "completed"],
      default: "active",
    },

    messages: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);
