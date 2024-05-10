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

function handleConnection(socket) {
  try {
    socketConnection = socket;

    socket.on("join", async ({ token, location }) => {
      try {
        let { _id, exp } = jwt.verify(token, process.env.JWT_SECRET);

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

        connectedUsers[_id] = socket.id;

        if (user) {
          user.online = true;
          user.locationHistory.push({
            lat: location?.coords.latitude,
            lng: location?.coords.longitude,
            description: location?.description,
          });
          await user.save();
        }

        if (driver) {
          driver.online = true;
          driver.locationHistory.push({
            lat: location?.coords.latitude,
            lng: location?.coords.longitude,
            description: location?.description,
          });
          await driver.save();
        }
        console.log("Socket connection established");
        console.log(connectedUsers);
      } catch (error) {
        console.error("Error during user join:", error);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    socket.on("disconnect", handleDisconnect);
  } catch (error) {
    console.log(error);
  }
}
async function handleDisconnect(socket) {
  const userId = Object.keys(connectedUsers).find(
    (key) => connectedUsers[key] === socket.id
  );

  if (!userId) return;

  try {
    delete connectedUsers[userId];
    const user = await User.findByIdAndUpdate(userId, { online: false }, {
      new: true,
    });

    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    socketConnection.emit("error", { message: "Internal server error" });
  }
}

function emit(event, data) {
  io.emit(event, data);
}

function emitToUser(userId, event, data, userType) {
  console.log(connectedUsers[userId], userType);
  socketConnection.to(connectedUsers[userId]).emit(event, data);
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
  emitToAllExceptUser,
  io,
  joinRoom,
};

module.exports = socketService;
