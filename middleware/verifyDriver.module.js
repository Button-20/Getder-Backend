const Driver = require("../models/driver.model");

module.exports = async function (req, res, next) {
  try {
    const driver = await Driver.findOne({ _id: req._id });
    if (!driver) {
      return res.status(404).json({
        message: "😒 Bad request",
      });
    }
    req.driver = driver;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};
