const Otp = require("../../models/otp.model");
const smsConfig = require("../../config/sms.config");

async function sendOtp(req, res) {
  try {
    const { phone } = req.body;

    // Check if phone number is provided
    if (!phone) {
      return res.status(400).send({ message: "Phone number is required." });
    }

    // Check if OTP already exists
    const otpRecord = await Otp.findOne({ phone });
    if (otpRecord) {
      await sendSmsToUser(phone, otpRecord.otp);

      return res.status(200).send({
        message: "OTP re-sent successfully.",
      });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    const newOtp = new Otp({
      phone,
      otp,
    });

    await newOtp.save();

    // Send OTP via SMS
    if (phone) await sendSmsToUser(phone, otp);

    return res.status(200).send({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

module.exports = {
  method: "post",
  route: "/send-otp",
  controller: [sendOtp],
};

async function sendSmsToUser(phone, otp) {
  await smsConfig({
    destination: phone,
    message: `Please use this OTP to verify your Getder account: ${otp}`,
  });
}
