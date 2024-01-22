//TODO: Create socket function to send message to client
//TODO: Save message to database and update chat session with id of message
//TODO: Emit message to receiver and sender

const Message = require("../../models/message.model");
const ChatSession = require("../../models/chat_session.model");
const User = require("../../models/user.model");
const Driver = require("../../models/driver.model");
const socketService = require("../../config/socket.config");

socketService.io.on("send-message", async (data) => {
  try {
    const { sender, message, chat_session, receiver } = data;

    // Check if chat session exists
    const chatSession = await ChatSession.findById(chat_session);
    if (!chatSession) {
      throw new Error("Chat session not found");
    }

    // Check if sender exists in either user or driver collection
    const senderUser = await User.findById(sender);
    const senderDriver = await Driver.findById(sender);
    if (!senderUser && !senderDriver) {
      throw new Error("Sender not found");
    }

    // Check if receiver exists in either user or driver collection
    const receiverUser = await User.findById(receiver);
    const receiverDriver = await Driver.findById(receiver);
    if (!receiverUser && !receiverDriver) {
      throw new Error("Receiver not found");
    }

    // Create message
    const newMessage = await Message.create({
      sender,
      message,
      chat_session,
    });

    // Update chat session with new message
    chatSession.messages.push(newMessage._id);
    await chatSession.save();

    // Emit message to receiver
    socketService.emitToUser(receiver, "receive-message", { newMessage });

    // Emit message to sender
    socketService.emitToUser(sender, "receive-message", { newMessage });
  } catch (error) {
    console.log(error);
  }
});

socketService.io.on("typing", async (data) => {
  try {
    const { sender, chat_session, receiver } = data;

    // Check if chat session exists
    const chatSession = await ChatSession.findById(chat_session);
    if (!chatSession) {
      throw new Error("Chat session not found");
    }

    // Check if sender exists in either user or driver collection
    const senderUser = await User.findById(sender);
    const senderDriver = await Driver.findById(sender);
    if (!senderUser && !senderDriver) {
      throw new Error("Sender not found");
    }

    // Check if receiver exists in either user or driver collection
    const receiverUser = await User.findById(receiver);
    const receiverDriver = await Driver.findById(receiver);
    if (!receiverUser && !receiverDriver) {
      throw new Error("Receiver not found");
    }

    // Emit message to receiver
    socketService.emitToUser(receiver, "typing", { sender });

    // Emit message to sender
    socketService.emitToUser(sender, "typing", { sender });
  } catch (error) {
    console.log(error);
  }
});
