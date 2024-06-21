const Otp = require("../../models/otp.model");

async function verifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).send({ message: "Phone number is required." });
    }

    const otpRecord = await Otp.findOne({ phone });

    if (!otpRecord) {
      return res.status(404).send({ message: "OTP not found." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).send({ message: "Invalid OTP." });
    }

    return res.status(200).send({ 
      message: "OTP verified successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Internal server error." });
  }
}

module.exports = {
  method: "post",
  route: "/verify-otp",
  controller: [verifyOtp],
};
