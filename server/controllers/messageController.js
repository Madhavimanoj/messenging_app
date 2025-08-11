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

      // Emit immediately
      if (io) io.emit("new_message", newMsg);

      // Simulate delivery after 1 second
      setTimeout(() => {
        Message.findByIdAndUpdate(
          newMsg._id,
          { status: "delivered" },
          { new: true }
        )
          .then((updatedMsg) => {
            if (io && updatedMsg) io.emit("status_updated", updatedMsg);
          })
          .catch((err) => console.error("Delivery update error:", err));
      }, 1000);

      return res.status(200).json({ success: true, message: "Message stored" });

    } else if (data.type === "status") {
      const updated = await Message.findOneAndUpdate(
        { meta_msg_id: data.meta_msg_id },
        { status: data.status },
        { new: true }
      );

      if (updated) {
        if (io) io.emit("status_updated", updated);
        return res.status(200).json({ success: true, message: "Status updated" });
      } else {
        return res.status(404).json({ success: false, message: "Message not found" });
      }

    } else {
      return res.status(400).json({ success: false, message: "Unknown type" });
    }

  } catch (err) {
    console.error("❌ Server error in processPayload:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};