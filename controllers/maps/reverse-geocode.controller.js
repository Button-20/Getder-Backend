const googleMaps = require("../../services/googleMaps.service");

async function reverseGeocode(req, res) {
  try {
    const { lat, lng } = req.body;
    if (lat == null || lng == null)
      return res.status(400).json({ message: "lat and lng are required" });

    const address = await googleMaps.reverseGeocode(lat, lng);
    return res.status(200).json({ address });
  } catch (error) {
    console.error("reverse-geocode failed:", error.message);
    return res.status(502).json({ message: "Reverse geocoding failed" });
  }
}

module.exports = {
  method: "post",
  route: "/maps/reverse-geocode",
  controller: [reverseGeocode],
};
