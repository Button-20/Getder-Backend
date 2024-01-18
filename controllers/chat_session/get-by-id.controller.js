const ChatSession = require("../../models/chat_session.model");
const User = require("../../models/user.model");
const Driver = require("../../models/driver.model");
const verifyUser = require("../../middleware/verifyUser.module");
const verifyDriver = require("../../middleware/verifyDriver.module");

async function getChatSessionById(req, res) {
  return await new Promise(async (resolve, reject) => {
    try {
      const { id } = req.params;

      const { user } = req;

      if (!user) {
        return res.status(400).json({ message: "😒 Invalid request!!" });
      }

      if (!id) {
        return res.status(400).json({ message: "😒 Invalid request!!" });
      }

      // Check if chat session exists
      const chatSession = await ChatSession.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "drivers",
            localField: "driver",
            foreignField: "_id",
            as: "driver",
          },
        },
        {
          $lookup: {
            from: "requests",
            localField: "request",
            foreignField: "_id",
            as: "request",
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "messages",
            foreignField: "_id",
            as: "messages",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $unwind: "$driver",
        },
        {
          $unwind: "$request",
        },
      ]);

      if (!chatSession) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // Check if user exists in the chat session
      const userExists = chatSession.user._id.equals(user._id);
      const driverExists = chatSession.driver._id.equals(user._id);
      if (!userExists && !driverExists) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Send response to client
      return res.status(200).json({
        message: "🎉 Chat session retrieved successfully!!",
        data: chatSession,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error,
      });
    }
  });
}

module.exports = {
  method: "get",
  route: "/chat_session/:id",
  controller: [verifyUser || verifyDriver, getChatSessionById],
};
