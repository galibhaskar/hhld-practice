import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

// load the variables from .env file
dotenv.config();

// load PORT from .env or else use 3000
const PORT = process.env.PORT || 3000;

// creation of express application
const app = express();

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
    origin: "*",
  },
});

// accepting the incoming websocket connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // receiving the messages on existing websocket conn sent on the event: 'chat msg'
  socket.on("chat msg", (msg) => {
    console.log("Received msg:" + msg);

    // broadcasting/send the message for all the conn clients with the event 'chat msg' except the current socket conn.
    socket.broadcast.emit("chat msg", msg);
  });

  // websocket disconnect event
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to HHLD");
});

// Ensure listening on custom HTTP server that we created,
// instead of default express app HTTP server.
httpServer.listen(PORT, (req, res) => {
  console.log(`server running at http://localhost:${PORT}`);
});
