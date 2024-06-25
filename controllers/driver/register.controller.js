const Driver = require("../../models/driver.model");
const Vehicle = require("../../models/vehicle.model");
const VehicleType = require("../../models/vehicle_type.model");
const { ObjectId } = require("mongoose").Types;

async function createDriver(req, res) {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      profile_picture,
      driversLicense,
      type,
      brand,
      model,
      color,
      plateNumber,
      year,
      vehicle_license,
      roadWorthyCertificate,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !profile_picture ||
      !driversLicense ||
      !type ||
      !brand ||
      !model ||
      !color ||
      !plateNumber ||
      !year
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const vehicleType = await VehicleType.findOne({ type });

    if (!vehicleType) {
      return res.status(400).json({ message: "Invalid vehicle type" });
    }

    let newDriver = new Driver({
      firstname,
      lastname,
      email,
      phone,
      profile_picture,
      driversLicense,
    });

    newDriver = await newDriver.save();

    let newVehicle = new Vehicle({
      type: vehicleType._id,
      brand,
      model,
      color,
      plateNumber,
      year,
      vehicle_license,
      roadWorthyCertificate,
      driver: newDriver._id,
    });

    newVehicle = await newVehicle.save();

    newDriver.vehicle = newVehicle._id;

    await newDriver.save();

    return res.status(201).json({
      message: "🎉 Driver created successfully!!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  method: "post",
  route: "/driver",
  controller: [createDriver],
};
