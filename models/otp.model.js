const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: "1m", 
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
