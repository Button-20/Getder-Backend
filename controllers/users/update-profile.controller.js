const User = require("../../models/user.model");

const ALLOWED = ["home_address", "work_address"];

async function updateProfile(req, res) {
  try {
    const update = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => ALLOWED.includes(k))
    );
    if (!Object.keys(update).length) {
      return res.status(400).json({ message: "No updatable fields provided" });
    }
    const user = await User.findByIdAndUpdate(req._id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Profile updated", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

module.exports = {
  method: "patch",
  route: "/profile",
  controller: [updateProfile],
};
