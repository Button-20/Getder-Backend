const Driver = require("../../models/driver.model");

async function register(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const { firstname, lastname, email, phone, authMethod, profile_picture } =
        req.body;
      if (!firstname || !lastname || !email || !phone || !authMethod) {
        return resolve(
          res.status(400).json({ message: "😒 Missing required fields" })
        );
      }
      const driver = new Driver({
        firstname,
        lastname,
        email,
        phone,
        authMethod,
        profile_picture,
      });
      await driver.save();

      return resolve(
        res.status(200).json({ message: "🎉 Driver created successfully!!" })
      );
    } catch (error) {
      return reject(
        res.status(500).json({ message: "😥 Internal server error" })
      );
    }
  });
}

module.exports = {
  method: "post",
  route: "/driver/register",
  controller: [register],
};
