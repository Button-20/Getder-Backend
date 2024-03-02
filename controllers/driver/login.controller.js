const Driver = require("../../models/driver.model");
const generateToken = require("../../utils/generateToken");

async function login(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the driver by phone
    const driver = await Driver.findOne({ phone });

    if (!driver) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(driver);

    // Save driver in the database
    await driver.save();

    return res
      .status(200)
      .json({ message: "🎉 Driver logged in successfully!!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  method: "post",
  route: "/driver/login",
  controller: [login],
};
