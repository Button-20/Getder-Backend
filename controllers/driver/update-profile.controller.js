const Driver = require("../../models/driver.model");

const ALLOWED = ["vehicle_info", "onboarding_complete", "profile_picture", "payout_info"];

async function updateProfile(req, res) {
  try {
    const update = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => ALLOWED.includes(k))
    );
    if (!Object.keys(update).length) {
      return res.status(400).json({ message: "No updatable fields provided" });
    }
    const driver = await Driver.findByIdAndUpdate(req._id, update, { new: true });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    return res.status(200).json({ message: "Profile updated", data: driver });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

module.exports = {
  method: "patch",
  route: "/driver/profile",
  controller: [updateProfile],
};
