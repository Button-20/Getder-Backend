const Driver = require("../../models/driver.model");
const generateToken = require("../../utils/generateToken");

async function login(req, res) {x
  try {
    const { email, phone, driversLicense } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required for login" });
    }

    // Find the driver by email or phone
    const driver = await Driver.findOne({
      $or: [{ email }, { phone }],
      driversLicense,
    });

    if (!driver) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(driver);

    // Update driver status, e.g., set isLoggedIn to true
    driver.isLoggedIn = true;
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
