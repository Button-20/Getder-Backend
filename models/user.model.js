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
    // No `default: ""` on email/phone: a sparse unique index only skips
    // documents where the field is absent — empty strings are indexed, so
    // defaulting to "" makes every second local user collide on email ""
    // (and every second social user on phone "").
    email: {
      type: String,
      sparse: true,
      unique: true,
    },
    phone: {
      type: String,
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
      enum: ["local", "google"],
      default: "local",
    },
    home_address: {
      type: String,
      default: "",
    },
    work_address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Pre-save hook: generate an avatar only when the user has no picture.
// Must NOT key off isModified — every later save that doesn't touch the
// picture (socket presence, isLoggedIn, etc.) has isModified === false and
// would overwrite a real Google photo with the generated one.
userSchema.pre("save", async function (next) {
  if (!this.profile_picture) {
    this.profile_picture = `https://ui-avatars.com/api/?name=${this.firstname}+${this.lastname}&background=ffffff&size=256`;
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
