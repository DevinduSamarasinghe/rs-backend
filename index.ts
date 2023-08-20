import express, { Express, Request, Response, urlencoded } from "express";
import { connectDb } from "./config/db";
import cors from "cors";
import { userRoutes, chatRoutes, messageRoutes } from "./routes";
import MessageRouter from "./routes/messages.routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { deserealizeUser } from "./middleware/deserialization";
dotenv.config({ path: ".env" });
import { configureSocket } from "./config/socket.config/socketConfig";

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
  app.use("/users", userRoutes());
  app.use("/chats", chatRoutes());
  app.use("/messages", messageRoutes());

  //db connectivity
  connectDb();

  //server rendering
  const server = app.listen(PORT, () => {
    console.log(`Server Running on PORT: ${PORT}`);
  });

  //socket configuration
  configureSocket(server);
})();
