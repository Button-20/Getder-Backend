const User = require("../../models/user.model");
const generateToken = require("../../utils/generateToken");

async function login(req, res) {
  try {
    const { email, authMethod, phone, firstname, lastname } = req.body;

    if (!email || !authMethod || !phone) {
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
          return res.status(404).json({ message: "User not found" });
        case "google":
        case "facebook":
          user = new User({
            email,
            firstname,
            lastname,
            authMethod,
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
        return res.status(201).json({ message: "User created", token });
      }

      return res.status(201).json({ message: "User created" });
    }

    if (authMethod !== "local") {
      const token = generateToken(user);
      return res.status(200).json({ message: "User logged in", token });
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
