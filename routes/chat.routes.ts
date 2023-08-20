import express from "express";
import { authenticate } from "../middleware/authentication";
import { accessChat, fetchChat } from "../controllers/chats";

function chatRoutes(){
  const router = express.Router();
  router.post("/", authenticate, accessChat);
  router.get("/", authenticate, fetchChat);

  return router;
};

export default chatRoutes;
