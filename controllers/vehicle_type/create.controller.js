const VehicleType = require("../../models/vehicle_type.model");

async function create(req, res) {
  try {
    const { type, image, cost } = req.body;

    if (!type || !image || !cost)
      return res.status(400).json({ message: "😒 Invalid request!!" });

    // Create vehicle type
    const vehicle_type = new VehicleType({
      type,
      image,
      cost,
    });

    // Create vehicle type
    await vehicle_type.save();

    // Send response to client
    return res.status(200).json({
      message: "🎉 Vehicle type created successfully!!",
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
  route: "/vehicle_type",
  controller: [create],
};
