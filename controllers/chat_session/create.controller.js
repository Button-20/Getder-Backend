const ChatSession = require("../../models/chat_session.model");
const verifyUser = require("../../middleware/verifyUser.module");

async function create(req, res) {
  try {
    const { driver, request, messages } = req.body;

    if (!driver || !user || !request || !messages)
      return res.status(400).json({ message: "😒 Invalid request!!" });

    // Create chat session
    const chat_session = new ChatSession({
      driver,
      user: req.user._id,
      request,
    });

    // Create chat session
    await chat_session.save();

    // Send response to client
    return res.status(200).json({
      message: "🎉 Chat session created successfully!!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

module.exports = {
  method: "post",
  route: "/chat_session",
  controller: [verifyUser, create],
};
