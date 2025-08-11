require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

// ✅ Use frontend URL from env or fallback
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Socket.io CORS config
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Express CORS middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());

// ✅ Routes
const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

// ✅ Attach io to app
app.set("io", io);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("typing", (wa_id) => {
    socket.broadcast.emit("user_typing", wa_id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});