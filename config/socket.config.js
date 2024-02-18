const socketio = require("socket.io");
const connectedUsers = {};
const User = require("../models/user.model");

let io;
let socket;

function socketConfig(server, PORT) {
  console.log("Socket config started on PORT: ", PORT);
  io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", handleConnection);
}

async function handleConnection(socket) {
  console.log("Socket connection established");

  socket.on("join", async (data) => {
    try {
      console.log("User joined:", data.userId);
      const user = await User.findOne({ _id: data.userId });

      if (!user) {
        socket.emit("error", { message: "User not found" });
        return;
      }

      user.online = true;
      await user.save();
      socket.join(data.userId);
      console.log("User joined:", data.userId);
    } catch (error) {
      console.error("Error during user join:", error);
      socket.emit("error", { message: "Internal server error" });
    }
  });

  socket.on("disconnect", handleDisconnect);
}

async function handleDisconnect() {
  console.log("Socket disconnected");

  for (const userId in connectedUsers) {
    if (connectedUsers[userId] === socket.id) {
      try {
        delete connectedUsers[userId];
        const user = await User.findOne({ _id: userId });

        if (!user) {
          socket.emit("error", { message: "User not found" });
          return;
        }

        user.online = false;
        await user.save();
        break;
      } catch (error) {
        console.error("Error during user disconnect:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    }
  }
}

function emit(event, data) {
  io.emit(event, data);
}

function emitToUser(userId, event, data) {
  io.to(connectedUsers[userId]).emit(event, data);
}

function emitToRoom(roomId, event, data) {
  io.to(roomId).emit(event, data);
}

function emitToAllExceptUser(userId, event, data) {
  socket.broadcast.to(connectedUsers[userId]).emit(event, data);
}

const socketService = {
  socketConfig,
  emit,
  emitToUser,
  emitToRoom,
  emitToAllExceptUser,
  io,
};

module.exports = socketService;
