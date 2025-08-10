const express = require("express");
const router = express.Router();
const { processPayload } = require("../controllers/messageController");
const Message = require("../models/Message"); 


router.get("/messages", async (req, res) => {
  try {
    const all = await Message.find();
    const grouped = {};

    all.forEach((msg) => {
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

    res.json(Object.values(grouped));
  } catch (e) {
    console.error("GET /messages error:", e);
    res.status(500).json({ error: "Failed to load messages" });
  }
});
router.post("/receive", processPayload);

module.exports = router;
