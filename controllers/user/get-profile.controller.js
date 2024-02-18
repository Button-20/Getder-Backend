const User = require("../../models/user.model");
const verifyUser = require("../../middleware/verifyUser.module");

async function profile(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      console.log(req._id);
      if (!req._id) {
        return resolve(
          res.status(400).json({
            message: "😒 Invalid request!!",
          })
        );
      }
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
      return reject(
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
