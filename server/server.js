require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

// Attach io to app
app.set("io", io);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(err));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("typing", (wa_id) => {
    socket.broadcast.emit("user_typing", wa_id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});
