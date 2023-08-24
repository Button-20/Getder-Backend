const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
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
    negotiations: {
      type: [
        {
          price: {
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
          negotiator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Drivers",
          },
          conversation: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Conversations",
          },
          conclusion: {
            type: String,
            enum: ["accepted", "rejected"],
            default: null,
          },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "negotiating", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
