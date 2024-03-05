const verifyDriver = require("../../middleware/verifyDriver.module");
const Driver = require("../../models/driver.model");

async function updateProfile(req, res) {
  try {
    if (!req.driver) {
      return res.status(400).json({
        message: "😒 Invalid request!!",
      });
    }

    const { firstname, lastname, phone, profile_picture, available } = req.body;

    let query = {};

    if (firstname) query.firstname = firstname;

    if (lastname) query.lastname = lastname;

    if (phone) query.phone = phone;

    if (profile_picture) query.profile_picture = profile_picture;

    if (available !== undefined) query.available = available;

    await Driver.findOneAndUpdate({ _id: req.driver._id }, query, {
      new: true,
    });

    return res.status(200).json({
        message: "🎉 Driver profile updated successfully!!",
    })
  } catch (error) {
    return res.status(500).json({
      message: "😥 Internal server error!!",
      error: error,
    });
  }
}

module.exports = {
  method: "put",
  route: "/driver/profile",
  controller: [verifyDriver, updateProfile],
};
