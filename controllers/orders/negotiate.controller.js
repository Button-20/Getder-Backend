const Order = require("../../models/orders.model");
const verifyDriver = require("../../utils/verifyDriver");
const { TRIGGERS } = require("../../utils/variables");
const { emitToUser } = require("../../configs/socket.config");

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

    const order = new Order({
      pickup_location,
      dropoff_location,
      car_type,
      suggested_price,
      code,
      symbol,
    });

    await order.save();

    // Trigger event
    emitToUser("trigger", { trigger: TRIGGERS.NEW_ORDER, data: order });

    return res.status(200).json({
      message: "🎉 Order created successfully!!",
      data: order,
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
  route: "/order",
  controller: [verifyDriver, create],
};
