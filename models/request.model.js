const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    pickup_location: {
      type: String,
      required: true,
    },
    dropoff_location: {
      type: String,
      required: true,
    },
    car_type: {
      type: String,
      required: true,
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
    negotiations: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Negotiation",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "cancelled", "ongoing", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
