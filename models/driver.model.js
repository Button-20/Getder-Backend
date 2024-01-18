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
    vehicleDetails: {
      type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "VehicleType",
      },
      model: {
        type: String,
        required: true,
      },
      plateNumber: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
    driversLicense: {
      type: String,
      required: true,
    },
    locationHistory: [
      {
        type: String,
        default: "",
      },
    ],
    available: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

driverSchema.pre("save", async function (next) {
  // if profile_picture is not set, set it to a default image https://ui-avatars.com/api/?name=John+Doe
  if (!this.profile_picture) {
    this.profile_picture =
      "https://ui-avatars.com/api/?name=" +
      this.firstname +
      "+" +
      this.lastname;
  }
  next();
});

module.exports = mongoose.model("Driver", driverSchema);
