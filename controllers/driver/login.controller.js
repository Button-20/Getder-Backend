const Driver = require("../../models/driver.model");
const firebase = require("../../configs/firebase.config");
const generateToken = require("../../utils/generateToken");
const { sendMail } = require("../../utils/mailer");

async function login(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const { email, phone, authMethod } = req.body;

      if ((!email && !authMethod) || (!phone && !authMethod))
        return resolve(
          res.status(400).json({ message: "Missing required fields" })
        );

      const lookup = [];
      if (email) lookup.push({ email });
      if (phone) lookup.push({ phone });
      if (!lookup.length)
        return resolve(res.status(400).json({ message: "Missing required fields" }));
      let driver = await Driver.findOne({ $or: lookup });

      if (!driver) {
        return resolve(
          res.status(400).json({ message: "You are not registered" })
        );
      }

      if (driver.authMethod !== authMethod) {
        return resolve(
          res.status(400).json({ message: "Invalid auth method" })
        );
      }

      // Social logins are already identity-verified — issue the token directly
      if (authMethod !== "local") {
        const token = generateToken(driver._id);
        return resolve(
          res.status(200).json({ message: "🎉 Login successful!!", token })
        );
      }

      // Local login: email an OTP; the token is issued by /driver/verify-otp

      // Rate-limit resends: one code per minute per driver
      if (
        driver.otp?.lastSentAt &&
        Date.now() - driver.otp.lastSentAt.getTime() < 60 * 1000
      ) {
        return resolve(
          res.status(429).json({
            message: "Please wait a minute before requesting a new code",
          })
        );
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      driver.otp = {
        code: otp,
        expires: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
        lastSentAt: new Date(),
      };
      await driver.save();
      console.log(`[OTP] ${driver.email}: ${otp}`);
      sendMail(
        driver.email,
        "Your JusGo Driver sign-in code",
        `Your sign-in code is ${otp}. It expires in 10 minutes.`
      ).catch((err) => console.error("OTP email failed:", err.message));

      return resolve(
        res.status(200).json({ message: "OTP sent to your email" })
      );
    } catch (error) {
      console.error(error);
      // resolve, not reject: the response is already sent, and rejecting an
      // awaited promise here becomes an unhandled rejection that crashes the
      // whole Node process on Node >= 15.
      return resolve(
        res.status(500).json({ message: "Internal server error" })
      );
    }
  });
}

module.exports = {
  method: "post",
  route: "/driver/login",
  controller: [login],
};
