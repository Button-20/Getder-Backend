const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingsAndReviewSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Request",
    },
    driver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },
    rating: {
      type: Number,
        required: true,
      default: 0,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RatingsAndReview", ratingsAndReviewSchema);
