import express, { Express} from "express";
import { connectDb } from "../config/db";
import cors from "cors";
import { userRoutes, chatRoutes, messageRoutes } from "../routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { deserealizeUser } from "../middleware/deserialization";
dotenv.config({ path: ".env" });
import { configureSocket } from "../config/socket.config/socketConfig";

const app: Express = express();
const PORT =  process.env.NODE_ENV !== "test" ? 8080  || process.env.PORT : 8081;

const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_PROD_URL : process.env.FRONTEND_URL,
  credentials: true,
};

export function main() {
  
  console.log("Provided Cors: ", corsOptions.origin);
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
    console.log(`Server Running on PORT: ${PORT} in ${process.env.NODE_ENV} mode`);
  });

  //socket configuration
  configureSocket(server);
  return {server, app};
}

if(process.env.NODE_ENV !== "test"){
  main();
}
