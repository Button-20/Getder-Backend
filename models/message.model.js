const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User" || 'Driver'
    },
    message: {
      type: String,
      required: true,
    },
    chat_session: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ChatSession",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
