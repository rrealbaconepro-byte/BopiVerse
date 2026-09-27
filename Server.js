const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{origin:"*"}
});

app.use(cors());
app.use(express.json());

let users = [];
let messages = [];

// Server status
app.get("/status",(req,res)=>{
  res.json({online:true});
});

// Signup
app.post("/signup",(req,res)=>{
  const {name,password,email} = req.body;

  if(users.find(u=>u.name===name))
    return res.status(400).json({error:"Name exists"});

  users.push({
    name,password,email,
    bio:"",
    avatar:""
  });

  res.json({success:true});
});

// Login
app.post("/login",(req,res)=>{
  const {name,password}=req.body;

  const user = users.find(
    u=>u.name===name && u.password===password
  );

  if(!user)
    return res.status(401).json({error:"Wrong login"});

  res.json(user);
});

// Socket.IO
io.on("connection",(socket)=>{

  socket.emit("history",messages);

  socket.on("chat",msg=>{
    messages.push(msg);
    io.emit("chat",msg);
  });

  socket.on("disconnect",()=>{});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
  console.log("BopiVerse Server Running");
});
