const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    deactivated: {
      status: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
      },
    },
    profile_picture: {
      type: String,
      default: "",
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    authMethod: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    vehicle_info: {
      car_type: { type: String, enum: ["economy", "comfort", "premium"] },
      make: String,
      model: String,
      year: String,
      color: String,
      plate: String,
    },
    payout_info: {
      network: String,
      account_number: String,
      account_name: String,
    },
    onboarding_complete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
