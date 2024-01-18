const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const negotiationSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Request",
    },
    driver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },
    suggested_price: {
      type: Number,
      required: true,
    },
    currency: {
      code: {
        type: String,
        required: true,
      },
      symbol: {
        type: String,
        required: true,
      },
    },
    chat_session: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ChatSession",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Negotiation", negotiationSchema);
