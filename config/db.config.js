const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.info(`\x1b[94mMongoDB Connected: ${conn.connection.host}\x1b[0m`);

    return conn.connection.readyState;
  } catch (err) {
    console.error("\x1b[91M" + err + "\x1b[0m");
    process.exit(1);
  }
};

module.exports = connectDB;
