const User = require("../../models/user.model");
const firebase = require("../../config/firebase.config");
const generateToken = require("../../utils/generateToken");

async function login(req, res) {
  try {
    const { firstname, lastname, email, phone, authMethod, profile_picture } =
      req.body;

    if (!firstname || !lastname || !email || !authMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      switch (authMethod) {
        case "local":
          if (!phone) {
            return res.status(400).json({ message: "Missing required fields" });
          }
          user = new User({ firstname, lastname, phone, authMethod });
          break;
        case "google":
        case "facebook":
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
          return res
            .status(400)
            .json({ message: "Invalid auth method: " + authMethod });
      }

      await user.save();

      if (authMethod !== "local") {
        const token = generateToken(user);
        return res.status(200).json({ message: "User created", token });
      }

      return res.status(200).json({ message: "User created" });
    }

    if (authMethod !== "local") {
      const token = generateToken(user);
      return res.status(200).json({ message: "User logged in", token });
    }

    const confirmationResult = await firebase
      .auth()
      .getUserByPhoneNumber(phone);

    if (!confirmationResult?.metadata?.lastSignInTime) {
      return res.status(400).json({ message: "Phone number is not verified" });
    }

    user.isLoggedIn = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "User logged in", token: generateToken(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  method: "post",
  route: "/login",
  controller: [login],
};
