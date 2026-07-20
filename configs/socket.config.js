const socket = require("socket.io");
const connectedUsers = {};
const User = require("../models/user.model");
const Driver = require("../models/driver.model");
const Order = require("../models/orders.model");
const googleMaps = require("../services/googleMaps.service");

let io;
let userSocket;

function socketConfig(server) {
  io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connection established");

    userSocket = socket;

    socket.on("join", async (data) => {
      console.log("User joined:", data._id);
      // Riders live in Users, drivers in Drivers — both join a room by their id
      const user =
        (await User.findOne({ _id: data._id })) ||
        (await Driver.findOne({ _id: data._id }));
      if (!user)
        return socket.emit("error", {
          message: "User not found",
        });

      user.online = true;
      await user.save();
      connectedUsers[data._id] = socket.id;
      socket.join(data._id);
      console.log("User joined:", data._id);
    });

    socket.on("accept_order", async (data) => {
      try {
        console.log("accept_order received:", data);
        const order = await Order.findById(data.orderId);
        const driver = await Driver.findById(data.driverId);
        if (!order || !driver)
          return console.log(
            "accept_order dropped — order:", !!order, "driver:", !!driver,
          );

        const v = driver.vehicle_info ?? {};
        const riderRoom = order.user.toString();

        // Real ETA: driving time from the driver's current position to the
        // pickup. Falls back to 5 min if coords are missing or the call fails.
        let eta = 5;
        try {
          if (data.lat != null && data.lng != null && order.pickup_location) {
            const dm = await googleMaps.distanceMatrix(
              `${data.lat},${data.lng}`,
              order.pickup_location,
            );
            eta = Math.max(1, Math.round(dm.durationSeconds / 60));
          }
        } catch (e) {
          console.error("eta calc failed:", e.message);
        }

        console.log(
          "emitting driver_offer to room:", riderRoom,
          "— sockets in room:", io.sockets.adapter.rooms.get(riderRoom)?.size ?? 0,
        );
        io.to(riderRoom).emit("driver_offer", {
          id: driver._id.toString(),
          driverName: `${driver.firstname} ${driver.lastname?.[0] ?? ""}.`.trim(),
          // ponytail: rating still hardcoded until a rating system exists
          rating: 5.0,
          carModel: `${v.make ?? ""} ${v.model ?? ""}`.trim() || "Vehicle",
          plate: v.plate ?? "",
          phone: driver.phone,
          offeredPrice: Number(data.price ?? order.suggested_price),
          eta,
        });
      } catch (err) {
        console.error("accept_order failed:", err);
      }
    });

    // Driver came online — replay the latest still-pending order so they
    // don't miss a search that started before they went online
    socket.on("driver_online", async () => {
      try {
        const cutoff = new Date(Date.now() - 10 * 60 * 1000);
        const order = await Order.findOne({
          status: "pending",
          createdAt: { $gte: cutoff },
        }).sort({ createdAt: -1 });
        if (order) socket.emit("new_order", order);
      } catch (err) {
        console.error("driver_online failed:", err);
      }
    });

    // Rider cancelled the search — stop showing this order to drivers
    socket.on("cancel_order", async (data) => {
      if (!data.orderId) return;
      await Order.findByIdAndUpdate(data.orderId, { status: "cancelled" }).catch(
        () => {},
      );
    });

    // Live driver position — rebroadcast so the rider in a ride can track it
    // ponytail: broadcast to everyone; scope to the ride's rider when scale matters
    socket.on("driver_location", (data) => {
      socket.broadcast.emit("driver_location", data);
    });

    // Ride lifecycle updates (arrived / in_progress / completed) → rider's room
    socket.on("ride_status", (data) => {
      if (data.userId) io.to(data.userId.toString()).emit("ride_status", data);
    });

    // WebRTC voice-call signaling (offer / answer / candidate / end / reject)
    // — pure relay to the recipient's room
    socket.on("call_signal", (data) => {
      if (data.to) io.to(data.to.toString()).emit("call_signal", data);
    });

    // In-ride chat — relay to the recipient's room
    // ponytail: ephemeral, no persistence — add a Conversations collection when history matters
    socket.on("chat_message", (data) => {
      if (data.to) io.to(data.to.toString()).emit("chat_message", data);
    });

    // Rider's answer to a driver's offer — relay to the driver's room,
    // enriched with the rider's details so the driver knows who to pick up
    socket.on("accept_offer", async (data) => {
      // Mark the order taken so it stops replaying to newly-online drivers
      if (data.orderId)
        await Order.findByIdAndUpdate(data.orderId, {
          status: "accepted",
        }).catch(() => {});
      let rider = null;
      try {
        const user = data.userId ? await User.findById(data.userId) : null;
        if (user)
          rider = {
            name: `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim(),
            phone: user.phone ?? "",
            profile_picture: user.profile_picture ?? "",
          };
      } catch (err) {
        console.error("accept_offer rider lookup failed:", err);
      }
      io.to(data.driverId).emit("offer_accepted", { ...data, rider });
    });

    socket.on("decline_offer", (data) => {
      io.to(data.driverId).emit("offer_declined", data);
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected");

      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          let user =
            (await User.findOne({ _id: userId })) ||
            (await Driver.findOne({ _id: userId }));
          if (!user)
            return socket.emit("error", {
              message: "User not found",
            });

          user.online = false;
          await user.save();
          break;
        }
      }
    });
  });
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
  userSocket.broadcast.to(connectedUsers[userId]).emit(event, data);
}

module.exports = {
  socketConfig,
  emit,
  emitToUser,
  emitToRoom,
  emitToAllExceptUser,
};
