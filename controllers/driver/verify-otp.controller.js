const Driver = require("../../models/driver.model");
const generateToken = require("../../utils/generateToken");

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Missing required fields" });

    const driver = await Driver.findOne({ email });
    if (!driver || !driver.otp?.code)
      return res.status(400).json({ message: "No pending sign-in for this email" });

    // Max 5 wrong guesses per code — then the code is burned
    if ((driver.otp.attempts ?? 0) >= 5) {
      driver.otp = undefined;
      await driver.save();
      return res
        .status(429)
        .json({ message: "Too many attempts — request a new code" });
    }

    if (driver.otp.code !== String(otp)) {
      driver.otp.attempts = (driver.otp.attempts ?? 0) + 1;
      await driver.save();
      return res.status(400).json({ message: "Invalid code" });
    }

    if (driver.otp.expires < new Date())
      return res.status(400).json({ message: "Code expired — request a new one" });

    driver.otp = undefined;
    driver.isLoggedIn = true;
    await driver.save();

    const token = generateToken(driver._id);
    return res.status(200).json({ message: "🎉 Login successful!!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  method: "post",
  route: "/driver/verify-otp",
  controller: [verifyOtp],
};
