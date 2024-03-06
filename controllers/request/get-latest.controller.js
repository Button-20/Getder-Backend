const Request = require("../../models/request.model");
const verifyDriver = require("../../middleware/verifyDriver.module");

async function getLatestRequests(req, res) {
  try {
    // Get today's pending requests that does not have the driver as part of the negotiation.driver in the negotiations array
    const requests = await Request.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "negotiations",
          localField: "negotiations",
          foreignField: "_id",
          as: "negotiations",
        },
      },
      {
        $match: {
          "negotiations.driver": { $ne: req.driver._id },
        },
      },
    ]);

    return res.status(200).json({
      message: "🎉 Requests retrieved successfully!!",
      data: requests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: JSON.stringify(error, null, 2),
    });
  }
}

module.exports = {
  method: "get",
  route: "/requests/latest",
  controller: [verifyDriver, getLatestRequests],
};
