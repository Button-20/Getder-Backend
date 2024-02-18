require("dotenv").config();
require("./models/db.js");

const helmet = require("helmet");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Import all routes
const routes = require("./router/route.js");
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("You are in the wrong place. Please go to /api/v1");
})

// Start server on port
let server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io
require("./config/socket.config.js").socketConfig(server, PORT);
