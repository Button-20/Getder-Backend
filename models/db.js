const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).finally(() => console.log("MongoDB connection established"));
  require("./user.model.js");
} catch (error) {
  console.error("Error establishing MongoDB connection:", error);
}
