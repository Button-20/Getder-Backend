const Negotiation = require("../../models/negotiation.model");
const verifyUser = require("../../middleware/verifyUser.module");
const { TRIGGERS } = require("../../utils/variables");
const { emitToUser } = require("../../config/socket.config");

async function create(req, res) {
  try {
    const { request, driver, suggested_price, code, symbol } = req.body;

    if (
      !pickup_location ||
      !dropoff_location ||
      !car_type ||
      !suggested_price ||
      !code ||
      !symbol
    )
      return res.status(400).json({ message: "😒 Invalid request!!" });

    const negotiation = new Negotiation({
      request,
      driver,
      currency: { code, symbol },
      suggested_price,
    });

    await negotiation.save();

    // Trigger event
    // emitToUser("trigger", { trigger: TRIGGERS.NEW_REQUEST, data: request });

    return res.status(200).json({
      message: "🎉 Negotiation created successfully!!",
      data: negotiation,
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
  route: "/negotiation",
  controller: [verifyUser, create],
};
