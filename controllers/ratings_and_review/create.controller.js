const RatingsAndReview = require("../../models/ratings_and_review.model");
const verifyUser = require("../../middleware/verifyUser.module");

async function create(req, res) {
  try {
    const { request, driver, rating, review } = req.body;

    if (!request || !driver || !rating || !review)
      return res.status(400).json({ message: "😒 Invalid request!!" });

    const ratings_and_review = new RatingsAndReview({
      request,
      driver,
      rating,
      review,
    });

    await ratings_and_review.save();

    // Trigger event
    // emitToUser("trigger", { trigger: TRIGGERS.NEW_REQUEST, data: request });

    return res.status(200).json({
      message: "🎉 Ratings and review created successfully!!",
      data: ratings_and_review,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

module.exports = {
  method: "post",
  route: "/ratings_and_review",
  controller: [verifyUser, create],
};
