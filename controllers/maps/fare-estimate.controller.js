const googleMaps = require("../../services/googleMaps.service");

async function fareEstimate(req, res) {
  try {
    const { pickup, dropoff } = req.body;
    if (!pickup || !dropoff)
      return res
        .status(400)
        .json({ message: "pickup and dropoff are required" });

    const estimate = await googleMaps.estimateFare(pickup, dropoff);
    return res.status(200).json(estimate);
  } catch (error) {
    console.error("fare-estimate failed:", error.message);
    return res.status(502).json({ message: "Fare estimation failed" });
  }
}

module.exports = {
  method: "post",
  route: "/maps/fare-estimate",
  controller: [fareEstimate],
};
