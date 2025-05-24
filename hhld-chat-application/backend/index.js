import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { addMsgsToConversation } from "./controllers/msgs.controller.js";
import ChatRouter from "./routes/msgs.route.js";
import cors from "cors";
import { subscribe, publish } from "./redis/msgsPubSub.js";

// load the variables from .env file
dotenv.config();

// load PORT from .env or else use 3000
const PORT = process.env.PORT || 3000;

// creation of express application
const app = express();

app.use(cors());

// express handles the HTTP requests when we do app.listen(PORT).
// app.listen(PORT): internally creates the http server and binds to given PORT.

// To handle incoming websocket request, We need our own server that can be passed to SOCKET.IO.
// Therefore, we wrap Express app into an actual HTTP server.
const httpServer = http.createServer(app);

// new Server(httpServer): create Socket.IO server and
// attaches it to the existing httpServer instance.

// It tells Socket.IO to hook into that HTTP server and listen for special Upgrade requests (headers: conn-upgrade)
// 1. Intercept WebSocket upgrade requests.
// 2. Handle io.on('connection', ...) events.
// 3. Share the same port as your Express API.
const io = new Server(httpServer, {
  // Cross-Orgin-Resource-Sharing
  cors: {
    allowedHeaders: ["*"],
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
  },
});

const userSocketMap = {};

// accepting the incoming websocket connection
io.on("connection", (socket) => {
  console.log("Client connected");

  const username = socket.handshake.query.username;

  console.log("username:", username);

  userSocketMap[username] = socket;

  const channelName = `chat_${username}`;

  // listen to any messages on the channel from different server conns.
  subscribe(channelName, (msg) => {
    socket.emit("chat msg", JSON.parse(msg));
  });

  // receiving the messages on existing websocket conn sent on the event: 'chat msg'
  socket.on("chat msg", (msg) => {
    console.log("Received msg:" + msg.text);
    console.log("sender:" + msg.sender);
    console.log("receiver:" + msg.receiver);

    const receiverSocket = userSocketMap[msg.receiver];

    if (receiverSocket) {
      receiverSocket.emit("chat msg", msg);
    } else {
      // if current socket not in map, then publish to redis

      const channelName = `chat_${msg.receiver}`;

      publish(channelName, JSON.parse(msg));
    }

    addMsgsToConversation([msg.sender, msg.receiver], msg);

    // broadcasting/send the message for all the conn clients with the event 'chat msg' except the current socket conn.
    // socket.broadcast.emit("chat msg", msg);
  });

  // websocket disconnect event
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/msgs", ChatRouter);

app.get("/", (req, res) => {
  res.send("Welcome to HHLD");
});

// Ensure listening on custom HTTP server that we created,
// instead of default express app HTTP server.
httpServer.listen(PORT, (req, res) => {
  connectToMongoDB();
  console.log(`server running at http://localhost:${PORT}`);
});
