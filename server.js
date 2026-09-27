const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve files from the repo root
app.use(express.static(__dirname));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Status API
app.get("/status", (req, res) => {
  res.json({ online: true });
});

// Chat
io.on("connection", (socket) => {
  socket.on("chat", (msg) => io.emit("chat", msg));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`BopiVerse running on port ${PORT}`);
});
