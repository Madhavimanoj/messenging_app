const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  number: String,
  message: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  meta_msg_id: String,
  direction: {
    type: String,
    enum: ["incoming", "outgoing"], 
    required: true,
  },
  profile_pic: { type: String, default: "https://via.placeholder.com/40" },

  
});

module.exports = mongoose.model("Message", MessageSchema);
