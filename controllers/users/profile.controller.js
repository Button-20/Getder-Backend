const User = require("../../models/user.model");

async function profile(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: req._id });
      if (!user) {
        return resolve(
          res.status(404).json({
            message: "😥 User not found",
          })
        );
      }
      return resolve(
        res.status(200).json({
          message: "🎉 User fetched successfully!!",
          data: user,
        })
      );
    } catch (error) {
      // resolve, not reject: the response is already sent, and rejecting an
      // awaited promise here becomes an unhandled rejection that crashes the
      // whole Node process on Node >= 15.
      return resolve(
        res.status(500).json({
          message: "😥 Internal server error!!",
          error: error,
        })
      );
    }
  });
}

module.exports = {
  method: "get",
  route: "/profile",
  controller: [profile],
};
