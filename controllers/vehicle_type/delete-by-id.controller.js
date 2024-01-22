const VehicleType = require("../../models/vehicle_type.model");

async function deleteVehicleType(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const { id } = req.params;

      if (!id) {
        return resolve(
          res.status(400).json({
            message: "😒 Invalid request!!",
          })
        );
      }

      const vehicle_type = await VehicleType.findByIdAndDelete(id);

      if (!vehicle_type) {
        return resolve(
          res.status(404).json({
            message: "😥 Vehicle type not found",
          })
        );
      }

      return resolve(
        res.status(200).json({
          message: "🎉 Vehicle type deleted successfully!!",
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
  method: "delete",
  route: "/vehicle_type/:id",
  controller: [deleteVehicleType],
};
