require("dotenv").config();
require("./configs/db.config.js");

const helmet = require("helmet");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Import all routes
const routes = require("./router/index.js");
app.use("/api", routes);

// Start server on port
let server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io
const io = require("./configs/socket.config.js").socketConfig(server);
