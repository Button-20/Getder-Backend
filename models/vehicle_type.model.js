const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleTypeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    multiplier: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleType", vehicleTypeSchema);
