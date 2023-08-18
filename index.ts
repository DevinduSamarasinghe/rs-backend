import express, { Express, Request, Response, urlencoded } from "express";
import { connectDb } from "./config/db";
import cors from "cors";
import UserRouter from "./routes/user.routes";
import ChatRouter from "./routes/chat.routes";
import MessageRouter from "./routes/messages.routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { deserealizeUser } from "./middleware/deserialization";
import { Server } from "socket.io";
dotenv.config({ path: ".env" });

const app: Express = express();
const PORT = 8080 || process.env.PORT;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
};

(function main() {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));

  //decoding and refresh transaction of tokens
  app.use(deserealizeUser);

  //Routes
  app.use("/users", UserRouter);
  app.use("/chats", ChatRouter);
  app.use("/messages", MessageRouter);

  //db connectivity
  connectDb();

  //server rendering
  const server = app.listen(PORT, () => {
    console.log(`Server Running on PORT: ${PORT}`);
  });

  //socket.io server configuration
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on("setup", (userData) => {
      console.log("UserData:", userData);
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room: ", room);
    });

    //message returns
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
      console.log("Chat is: ", newMessageReceived.chat);

      if (!chat.users) return console.log("Chat.users not defined");

      //Type of user
      chat.users.forEach((user: any) => {
        if (user._id === newMessageReceived.sender._id) return;
        console.log(user._id);
        socket.in(user._id).emit("Message received", newMessageReceived);
        console.log("Message sent to: ", user._id);
      });
    });
  });
})();
