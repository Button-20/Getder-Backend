require("dotenv").config();
require("./models/db.js");

const helmet = require("helmet");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Import all routes
const routes = require("./router/route.js");
app.use("/api", routes);

// Start server on port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
