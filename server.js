const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Serve your website files
app.use(express.static(path.join(__dirname, "public")));

// Homepage -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server status API
app.get("/status", (req, res) => {
  res.json({ online: true });
});

let messages = [];

io.on("connection", (socket) => {
  socket.emit("history", messages);

  socket.on("chat", (msg) => {
    messages.push(msg);
    io.emit("chat", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`BopiVerse running on port ${PORT}`);
});
