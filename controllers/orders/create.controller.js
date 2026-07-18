const Order = require("../../models/orders.model");
const verifyUser = require("../../utils/verifyUser");
const { emit } = require("../../configs/socket.config");

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
      user: req.user._id,
      pickup_location,
      dropoff_location,
      car_type,
      suggested_price,
      currency: { code, symbol },
    });

    await order.save();

    // ponytail: broadcast to every socket; target online drivers via rooms when scale matters
    emit("new_order", order);

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
  controller: [verifyUser, create],
};
