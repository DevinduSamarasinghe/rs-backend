import { Server } from "socket.io";
import { IncomingMessage, ServerResponse } from "http";
import http from "http";
import decryptMessage from "./decrypt";

export function configureSocket(
  server: http.Server<typeof IncomingMessage, typeof ServerResponse>
) {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on("setup", (userData) => {
      console.log("UserData at socket:", userData);
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room: ", room);
    });

    //message returns
    socket.on("new message", (newMessageReceived) => {
      //decrypt message 
      const decryptedMessage = decryptMessage(newMessageReceived);
      var chat = decryptedMessage.chat;
      console.log("Selected Chat: ", newMessageReceived.chat);
      console.log("New message received: ", newMessageReceived.content);
      if (!chat.users) return console.log("Chat.users not defined");

      //Type of user
      chat.users.forEach((user: any) => {
        if (user._id === decryptedMessage.sender._id) return;
        console.log(user._id);
        socket.in(user._id).emit("Message received", decryptedMessage);
        console.log("Message sent to: ", user._id);
      });
    });
  });
}
