const Request = require("../../models/request.model");
const verifyDriver = require("../../middleware/verifyDriver.module");

async function getRequests(req, res) {
  try {
    const { driver } = req;

    if (!driver) {
      return res.status(400).json({ message: "😒 Invalid request!!" });
    }

    // Get requests
    const requests = await Request.find({ driver: driver._id });

    // Send response to client
    return res.status(200).json({
      message: "🎉 Requests retrieved successfully!!",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

module.exports = {
  method: "get",
  route: "/requests",
  controller: [verifyDriver, getRequests],
};
