const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pickup_location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      description: { type: String, required: true },
    },
    dropoff_location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      description: { type: String, required: true },
    },

    car_type: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "VehicleType",
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

    driverHasArrived: {
      type: Boolean,
      default: false,
    },

    waitingTime: {
      type: Number,
      default: 0,
    },

    rideHasBegan: {
      type: Boolean,
      default: false,
    },

    negotiations: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Negotiation",
      },
    ],

    messages: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Message",
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
