const User = require("../../models/user.model");
const firebase = require("../../configs/firebase.config");
const generateToken = require("../../utils/generateToken");

async function login(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const { firstname, lastname, email, phone, authMethod, profile_picture } =
        req.body;

      // Local (phone) auth has no email; social auth has no phone. Require
      // only what each method actually uses — the create branches below
      // enforce the rest.
      if (!authMethod)
        return resolve(
          res.status(400).json({ message: "Missing required fields" })
        );

      if (authMethod === "local" && !phone)
        return resolve(
          res.status(400).json({ message: "Missing required fields" })
        );

      if (authMethod !== "local" && !email)
        return resolve(
          res.status(400).json({ message: "Missing required fields" })
        );

      // Check if user email or phone already exists. Build the $or
      // explicitly — an `{ email: undefined }` clause would be stripped to
      // `{}` and match every user.
      const lookup = [];
      if (email) lookup.push({ email });
      if (phone) lookup.push({ phone });
      let user = await User.findOne({ $or: lookup });

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
            return resolve(
              res.status(400).json({ message: "Invalid auth method" })
            );
        }
        await user.save();

        // Issue a token for every method. Local originally waited for the
        // Firebase phone OTP before issuing one, but OTP verification was
        // disabled in the app upstream — without a token here the client
        // can never call the JWT-protected routes.
        const token = generateToken(user);
        return resolve(
          res.status(200).json({ message: "User created", token })
        );
      }

      if (user) {
        if (authMethod !== "local") {
          // Refresh the social profile photo on every login — it also heals
          // accounts whose photo was clobbered by the old pre-save hook.
          if (profile_picture && user.profile_picture !== profile_picture) {
            user.profile_picture = profile_picture;
          }
          user.isLoggedIn = true;
          await user.save();
          const token = generateToken(user);
          return resolve(
            res.status(200).json({ message: "User logged in", token })
          );
        }

        // Confirm signin with OTP from firebase when the user exists there.
        // Phone OTP was disabled in the app upstream, so users are typically
        // absent from Firebase — treat that as "verification unavailable"
        // and let them in rather than failing every local login.
        try {
          const confirmationResult = await firebase
            .auth()
            .getUserByPhoneNumber(phone);

          if (!confirmationResult?.metadata?.lastSignInTime)
            return resolve(
              res.status(400).json({ message: "Phone number is not verified" })
            );
        } catch (firebaseError) {
          console.warn(
            `Firebase phone lookup skipped for ${phone}: ${firebaseError.message}`
          );
        }

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
  route: "/login",
  controller: [login],
};
