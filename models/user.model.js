const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      min: 3,
    },
    lastname: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      default: "",
      sparse: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
      sparse: true,
      unique: true,
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
    locationHistory: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
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

module.exports = mongoose.model("User", userSchema);
