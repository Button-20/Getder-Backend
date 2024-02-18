const User = require("../models/user.model");

module.exports = async function (req, res, next) {
  try {
    const user = await User.findOne({ _id: req._id });
    if (!user) {
      return res.status(404).json({
        message: "😥 User not found",
      });
    }

    next();
    req.user = user;
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};
