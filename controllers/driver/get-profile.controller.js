const Driver = require("../../models/driver.model");

async function profile(req, res) {
  try {
    const driver = await Driver.findOne({ _id: req._id }).populate(
      "vehicle"
    );
    if (!driver) {
      return res.status(404).json({
        message: "😥 User not found",
      });
    }
    return res.status(200).json({
      message: "🎉 User fetched successfully!!",
      data: driver,
    });
  } catch (error) {
    return res.status(500).json({
      message: "😥 Internal server error!!",
      error: error,
    });
  }
}

module.exports = {
  method: "get",
  route: "/driver/profile",
  controller: [profile],
};
