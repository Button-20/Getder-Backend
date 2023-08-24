const User = require("../../models/user.model");
const firebase = require("../../config/firebase.config");
const generateToken = require("../../utils/generateToken");

async function login(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const { firstname, lastname, email, phone, authMethod, profile_picture } =
        req.body;

      if (!firstname || !lastname || !email || !authMethod)
        return resolve(
          res.status(400).json({ message: "Missing required fields" })
        );

      // Check if user email or phone already exists
      let user = await User.findOne({
        $or: [{ email }, { phone }],
      });

      if (!user) {
        switch (authMethod) {
          case "local":
            if (!firstname || !lastname || !phone)
              return resolve(
                res.status(400).json({ message: "Missing required fields" })
              );
            user = new User({
              firstname,
              lastname,
              phone,
              authMethod,
            });
            break;
          case "google" || "facebook":
            user = new User({
              firstname,
              lastname,
              email,
              authMethod,
              profile_picture,
              isLoggedIn: true,
            });
            break;
          default:
            return resolve(
              res.status(400).json({ message: "Invalid auth method" })
            );
        }
        await user.save();

        // Generate token
        if (authMethod !== "local") {
          const token = generateToken(user);
          return resolve(
            res.status(200).json({ message: "User created", token })
          );
        }

        return resolve(res.status(200).json({ message: "User created" }));
      }

      if (user) {
        // Generate token
        if (authMethod !== "local") {
          const token = generateToken(user);
          return resolve(
            res.status(200).json({ message: "User logged in", token })
          );
        }

        // Confirm signin with OTP from firebase
        const confirmationResult = await firebase
          .auth()
          .getUserByPhoneNumber(phone);

        if (!confirmationResult?.metadata?.lastSignInTime)
          return resolve(
            res.status(400).json({ message: "Phone number is not verified" })
          );

        user.isLoggedIn = true;
        await user.save();
        return resolve(
          res
            .status(200)
            .json({ message: "User logged in", token: generateToken(user) })
        );
      }
    } catch (error) {
      console.error(error);
      return reject(res.status(500).json({ message: "Internal server error" }));
    }
  });
}

module.exports = {
  method: "post",
  route: "/login",
  controller: [login],
};
