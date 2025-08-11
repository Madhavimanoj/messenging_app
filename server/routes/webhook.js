const express = require("express");
const router = express.Router();
const { processPayload } = require("../controllers/messageController");
const Message = require("../models/Message");

// ✅ GET /webhook/messages
router.get("/messages", async (req, res) => {
  try {
    const allMessages = await Message.find();
    if (!allMessages || allMessages.length === 0) {
      return res.status(200).json([]);
    }

    const grouped = {};

    allMessages.forEach((msg) => {
      if (!grouped[msg.wa_id]) {
        grouped[msg.wa_id] = {
          wa_id: msg.wa_id,
          name: msg.name,
          number: msg.number,
          messages: [],
        };
      }
      grouped[msg.wa_id].messages.push(msg);
    });

    res.status(200).json(Object.values(grouped));
  } catch (error) {
    console.error("❌ GET /messages error:", error);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// ✅ POST /webhook/receive
router.post("/receive", processPayload);

module.exports = router;