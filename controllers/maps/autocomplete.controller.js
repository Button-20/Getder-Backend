const googleMaps = require("../../services/googleMaps.service");

async function autocomplete(req, res) {
  try {
    const { input } = req.body;
    if (!input) return res.status(200).json({ predictions: [] });

    const predictions = await googleMaps.autocomplete(input);
    return res.status(200).json({ predictions });
  } catch (error) {
    console.error("autocomplete failed:", error.message);
    return res.status(502).json({ message: "Autocomplete failed" });
  }
}

module.exports = {
  method: "post",
  route: "/maps/autocomplete",
  controller: [autocomplete],
};
