import { Server } from "socket.io";
import { IncomingMessage, ServerResponse } from "http";
import http from "http";
import decryptMessage from "./decrypt";
import { SessionDTO } from "../../dto/request/user.dto";
import { IMessage } from "../../dto/schema/Schemas";

export function configureSocket(
  server: http.Server<typeof IncomingMessage, typeof ServerResponse>
) {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_PROD_URL : process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });

    //message returns
    socket.on("new message", (newMessageReceived: IMessage) => {
      //decrypt message 
      const decryptedMessage = decryptMessage(newMessageReceived);
      var chat = decryptedMessage.chat;
      if (!chat.users) return console.log("Chat.users not defined");

      //Type of user
      chat.users.forEach((user: SessionDTO) => {
        if (user._id === decryptedMessage.sender._id) return;
        socket.in(user._id).emit("Message received", decryptedMessage);
      });
    });
  });
}
