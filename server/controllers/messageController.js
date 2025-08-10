const Message = require("../models/Message");

exports.processPayload = async (req, res) => {
  const data = req.body;
  const io = req.app.get("io");

  try {
    if (data.type === "message") {
      const newMsg = new Message({
  wa_id: data.wa_id,
  name: data.name,
  number: data.number,
  message: data.message,
  timestamp: new Date(data.timestamp),
  status: "sent",
  meta_msg_id: data.meta_msg_id,
  direction: data.direction || "outgoing", 
});


      await newMsg.save();
      setTimeout(async () => {
        newMsg.status = "delivered";
        await newMsg.save();

        if (io) io.emit("status_updated", newMsg);
      }, 1000);

      if (io) io.emit("new_message", newMsg);

      res.status(200).json({ success: true, message: "Message stored" });

    } else if (data.type === "status") {
      const updated = await Message.findOneAndUpdate(
        { meta_msg_id: data.meta_msg_id },
        { status: data.status },
        { new: true }
      );

      if (updated) {
        if (io) io.emit("status_updated", updated);
        res.status(200).json({ success: true, message: "Status updated" });
      } else {
        res.status(404).json({ success: false, message: "Message not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "Unknown type" });
    }
  } catch (err) {
    console.error(" Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
