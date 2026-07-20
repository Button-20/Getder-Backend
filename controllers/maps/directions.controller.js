const googleMaps = require("../../services/googleMaps.service");

async function directions(req, res) {
  try {
    const { origin, destination } = req.body;
    if (!origin || !destination)
      return res
        .status(400)
        .json({ message: "origin and destination are required" });

    const route = await googleMaps.directions(origin, destination);
    return res.status(200).json(route);
  } catch (error) {
    console.error("directions failed:", error.message);
    return res.status(502).json({ message: "Directions failed" });
  }
}

module.exports = {
  method: "post",
  route: "/maps/directions",
  controller: [directions],
};
