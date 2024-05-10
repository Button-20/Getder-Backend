const Negotiation = require("../../models/negotiation.model");
const Request = require("../../models/request.model");
const verifyUser = require("../../middleware/verifyUser.module");
const { TRIGGERS } = require("../../utils/variables");
const { emitToUser } = require("../../config/socket.config");

async function updateNegotiation(req, res) {
  try {
    const { negotiation_id } = req.params;
    const { status } = req.body;

    if (!negotiation_id || !status)
      return res.status(400).json({ message: "😒 Invalid request!!" });

    const negotiation = await Negotiation.findById(negotiation_id)
      .populate("request")
      .populate("driver")
      .populate({
        path: "driver",
        populate: {
          path: "vehicle",
        },
      });

    if (!negotiation)
      return res.status(404).json({ message: "😥 Negotiation not found" });

    if (
      negotiation.request.user._id.toString() !== req._id.toString() &&
      negotiation.driver._id.toString() !== req._id.toString()
    )
      return res.status(403).json({ message: "😒 You are not authorized" });

    if (negotiation.status === status)
      return res.status(400).json({ message: "😒 Status already updated" });

    const updatedNegotiation = await Negotiation.findByIdAndUpdate(
      { _id: negotiation_id },
      { status },
      { new: true }
    )
      .populate({
        path: "request",
        populate: {
          path: "user",
        },
      })
      .populate("driver")
      .populate({
        path: "driver",
        populate: {
          path: "vehicle",
        },
      });

    if (!updatedNegotiation)
      return res.status(404).json({ message: "😥 Negotiation not found" });

    if (status === "accepted") {
      // Update request
      await Request.findByIdAndUpdate(updatedNegotiation.request._id, {
        status: "ongoing",
      });

      // Emit to user and driver
      emitToUser(
        updatedNegotiation.request.user._id,
        TRIGGERS.NEGOTIATION_UPDATE,
        updatedNegotiation,
        "user"
      );

      emitToUser(
        updatedNegotiation.driver._id,
        TRIGGERS.NEGOTIATION_UPDATE,
        updatedNegotiation,
        "driver"
      );
    }

    return res.status(200).json({
      message: `🎉 Negotiation ${status} successfully!!`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

module.exports = {
  method: "put",
  route: "/negotiation/:negotiation_id",
  controller: [verifyUser, updateNegotiation],
};
