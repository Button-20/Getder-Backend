const Driver = require("../../models/driver.model");
const firebase = require("../../configs/firebase.config");
const generateToken = require("../../utils/generateToken");

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

      // Generate token
      const token = generateToken(driver._id);

      // Send token to client
      return resolve(
        res.status(200).json({ message: "🎉 Login successful!!", token })
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
