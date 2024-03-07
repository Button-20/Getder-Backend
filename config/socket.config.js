const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const connectedUsers = {};
const User = require("../models/user.model");
const Driver = require("../models/driver.model");

let io;
let socketConnection;

function socketConfig(server, PORT) {
  io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  
  console.log("Socket config started on PORT:", PORT);
  io.on("connection", handleConnection);
}

async function handleConnection(socket) {
  console.log("Socket connection established");
  socketConnection = socket;

  socket.on("join", async (data) => {
    try {
      console.log("User joined:", data);
      let { _id, exp } = jwt.verify(data.token, process.env.JWT_SECRET);

      // Check if token is expired
      if (Date.now() > exp * 1000) {
        socket.emit("error", { message: "Token expired" });
        return;
      }
      
      // Check if user or driver exists and join the appropriate room
      const user = await User.findOne({ _id });
      const driver = await Driver.findOne({ _id });

      if (!user && !driver) {
        socket.emit("error", { message: "User not found" });
        return;
      }

      if (user) {
        joinRoom("users");
      }

      if (driver) {
        joinRoom("drivers");
      }

      user &&
        (connectedUsers[_id] = socket.id) &&
        (user.online = true) &&
        (await user.save());
      driver &&
        (connectedUsers[_id] = socket.id) &&
        (driver.online = true) &&
        (await driver.save());
      joinRoom(_id);
      console.log("User joined:", _id);
    } catch (error) {
      console.error("Error during user join:", error);
      socket.emit("error", { message: "Internal server error" });
    }
  });

  socket.on("disconnect", handleDisconnect);
}

async function handleDisconnect(socket) {
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
        socketConnection.emit("error", { message: "Internal server error" });
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
  socketConnection.broadcast.to(connectedUsers[userId]).emit(event, data);
}

function joinRoom(roomId) {
  socketConnection.join(roomId);
}

const socketService = {
  socketConfig,
  emit,
  emitToUser,
  emitToRoom,
  emitToAllExceptUser,
  io,
  joinRoom,
};

module.exports = socketService;
