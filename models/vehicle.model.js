const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    type: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "VehicleType",
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    vehicle_license: {
      type: String,
    },
    driver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },
    roadWorthyCertificate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
