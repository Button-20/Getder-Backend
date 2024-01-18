const Request = require("../../models/request.model");
const verifyUser = require("../../middleware/verifyUser.module");
const { TRIGGERS } = require("../../utils/variables");
const socketService = require("../../config/socket.config");

async function create(req, res) {
  try {
    const {
      pickup_location,
      dropoff_location,
      car_type,
      suggested_price,
      code,
      symbol,
    } = req.body;

    if (
      !pickup_location ||
      !dropoff_location ||
      !car_type ||
      !suggested_price ||
      !code ||
      !symbol
    )
      return res.status(400).json({ message: "😒 Invalid request!!" });

    const request = new Request({
      user: req.user._id,
      pickup_location,
      dropoff_location,
      car_type,
      currency: { code, symbol },
      suggested_price,
    });

    await request.save();

    // Trigger event
    socketService.emitToUser("trigger", {
      trigger: TRIGGERS.NEW_REQUEST,
      data: request,
    });

    return res.status(200).json({
      message: "🎉 Request created successfully!!",
      data: request,
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
  route: "/request",
  controller: [verifyUser, create],
};
