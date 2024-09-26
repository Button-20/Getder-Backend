const User = require("../../models/user.model");
const generateToken = require("../../utils/generateToken");

async function register(req, res) {
  try {
    const { firstname, lastname, email, phone, authMethod, profile_picture } =
      req.body;

    if (!firstname || !lastname || !authMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user;
    if (authMethod === "local") {
      if (!phone) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      user = await User.findOne({ phone });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      user = new User({ firstname, lastname, phone, authMethod });
    } else if (["google", "facebook"].includes(authMethod)) {
      if (!email) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      user = await User.findOne({ email });
      if (user) {
        user.authMethod = authMethod;
        user.profile_picture = profile_picture;
      } else {
        user = new User({
          firstname,
          lastname,
          email,
          authMethod,
          profile_picture,
          isLoggedIn: true,
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid auth method: " + authMethod });
    }

    await user.save();

    const token = generateToken(user);
    return res.status(201).json({ message: "User created", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  method: "post",
  route: "/register",
  controller: [register],
};
