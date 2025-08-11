require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

//  Allow multiple origins (local + deployed)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
];

// Debug log
console.log("Allowed origins:", allowedOrigins);

//  Express CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

// Health check route
app.get("/", (req, res) => {
  res.send(" Backend is running");
});

// Routes
const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

//  Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(" MongoDB error:", err));

io.on("connection", (socket) => {
  console.log(" A user connected");

  socket.on("typing", (wa_id) => {
    socket.broadcast.emit("user_typing", wa_id);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected");
  });
});