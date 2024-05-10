const Negotiation = require("../../models/negotiation.model");
const Request = require("../../models/request.model");
const verifyDriver = require("../../middleware/verifyDriver.module");
const { TRIGGERS } = require("../../utils/variables");
const { emitToUser } = require("../../config/socket.config");

async function create(req, res) {
  try {
    const { request, price, code, symbol } = req.body;

    if (!request || !price || !code || !symbol) {
      return res.status(400).json({ message: "😒 Invalid request!!" });
    }

    const requestData = await Request.findById(request).populate(
      "negotiations"
    );

    if (!requestData) {
      return res.status(404).json({ message: "😥 Request not found" });
    }

    const driverHasNegotiation = requestData.negotiations.some((negotiation) =>
      negotiation.driver.equals(req.driver._id)
    );

    if (driverHasNegotiation) {
      return res.status(400).json({
        message: "😒 You have already sent a negotiation offer",
      });
    }

    const negotiation = await Negotiation.create({
      request,
      driver: req.driver._id,
      currency: { code, symbol },
      price,
    });

    // Update request
    await Request.findByIdAndUpdate(request, {
      $push: { negotiations: negotiation._id },
    });

    // Populate negotiation with driver and vehicle details
    const savedNegotiation = await negotiation.populate({
      path: "driver",
      populate: { path: "vehicle" },
    });

    // Trigger event
    emitToUser(
      requestData.user,
      TRIGGERS.NEW_NEGOTIATION,
      savedNegotiation,
      "user"
    );

    return res.status(200).json({
      message: "🎉 Negotiation created successfully!!",
      data: savedNegotiation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  method: "post",
  route: "/negotiation",
  controller: [verifyDriver, create],
};
