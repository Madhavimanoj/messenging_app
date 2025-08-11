const express = require("express");
const router = express.Router();
const { processPayload } = require("../controllers/messageController");
const Message = require("../models/Message");

// Optional: Add rate limiting if needed
// const rateLimit = require("express-rate-limit");
// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 100,
//   message: "Too many requests from this IP, please try again later.",
// });
// router.use(limiter);

// ✅ GET /webhook/messages
router.get("/messages", async (req, res) => {
  try {
    const allMessages = await Message.find();

    if (!allMessages || allMessages.length === 0) {
      return res.status(200).json([]);
    }

    const grouped = {};

    allMessages.forEach((msg) => {
      if (!msg.wa_id) return; // Defensive check

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
router.post("/receive", async (req, res, next) => {
  try {
    console.log("📩 Incoming webhook payload:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Empty payload received" });
    }

    await processPayload(req, res, next);
  } catch (error) {
    console.error("❌ POST /receive error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

module.exports = router;