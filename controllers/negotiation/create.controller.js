const Negotiation = require("../../models/negotiation.model");
const Request = require("../../models/request.model");
const verifyDriver = require("../../middleware/verifyDriver.module");
const { TRIGGERS } = require("../../utils/variables");
const { emitToUser } = require("../../config/socket.config");

async function create(req, res) {
  try {
    const { request, price, code, symbol } = req.body;

    if (!request || !price || !code || !symbol)
      return res.status(400).json({ message: "😒 Invalid request!!" });

    const negotiation = new Negotiation({
      request,
      driver: req.driver._id,
      currency: { code, symbol },
      price,
    });

    let savedNegotiation = await negotiation.save();
    savedNegotiation = savedNegotiation.populate("driver").execPopulate();

    // Update request
    const updatedRequest = await Request.findByIdAndUpdate(request, {
      $push: { negotiations: negotiation._id },
    });

    // Trigger event
    emitToUser(updatedRequest.user, "trigger", {
      trigger: TRIGGERS.NEW_NEGOTIATION,
      data: savedNegotiation,
    });

    return res.status(200).json({
      message: "🎉 Negotiation created successfully!!",
      data: savedNegotiation,
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
  controller: [verifyDriver, create],
};
