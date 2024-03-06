const Request = require("../../models/request.model");
const verifyDriver = require("../../middleware/verifyDriver.module");

async function getLatestRequests(req, res) {
  try {
    // Get today's pending requests that does not have the driver as part of the negotiation.driver in the negotiations array
    const requests = await Request.find(
      {
        status: "pending",
        "negotiations.driver": { $ne: req.driver._id },
      },
      null,
      {
        sort: { createdAt: -1 },
        limit: 5,
        populate: "negotiations",
      }
    );

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
  route: "/requests/latest",
  controller: [verifyDriver, getLatestRequests],
};
