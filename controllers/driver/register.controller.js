const Driver = require("../../models/driver.model");

async function createDriver(req, res) {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      profile_picture,
      vehicleDetails,
      driversLicense,
    } = req.body;

    const newDriver = new Driver({
      firstname,
      lastname,
      email,
      phone,
      vehicleDetails: {
        type: vehicleDetails.vehicleType,
        model: vehicleDetails.model,
        plateNumber: vehicleDetails.plateNumber,
        color: vehicleDetails.color,
      },
      profile_picture,
      driversLicense,
      available: false, // Default to false for new drivers
    });

    await newDriver.save();

    return res.status(201).json({
      message: "🎉 Driver created successfully!!",
      driverId: newDriver._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  method: "post",
  route: "/driver",
  controller: [createDriver],
};
