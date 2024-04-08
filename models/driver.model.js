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
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
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
    online: {
      type: Boolean,
      default: false,
    },
    authMethod: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    driversLicense: {
      type: String,
      required: true,
    },
    locationHistory: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    available: {
      type: Boolean,
      default: false,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
