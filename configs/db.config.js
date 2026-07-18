const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  require("../models/user.model.js");
  console.log("MongoDB connection established");
} catch (error) {
  console.error("Error establishing MongoDB connection:", error);
}
