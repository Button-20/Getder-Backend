const VehicleType = require("../../models/vehicle_type.model");

async function getVehicleTypes(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const vehicle_types = await VehicleType.find();
      if (!vehicle_types) {
        return resolve(
          res.status(404).json({
            message: "😥 Vehicle types not found",
          })
        );
      }

      return resolve(
        res.status(200).json({
          message: "🎉 Vehicle types fetched successfully!!",
          data: vehicle_types,
        })
      );
    } catch (error) {
      return reject(
        res.status(500).json({
          message: "😥 Internal server error!!",
          error: error,
        })
      );
    }
  });
}

module.exports = {
  method: "get",
  route: "/vehicle_types",
  controller: [getVehicleTypes],
};
