import express, { Router } from "express";
import { allMessages, sendMessage } from "../controllers/messages";
import { authenticate } from "../middleware/authentication";

/**
 * 
 * @returns Messages Router
 */
function messageRoutes() {
  const router: Router = express.Router();
  router.post("/", authenticate, sendMessage);
  router.get("/:chatId", authenticate, allMessages);

  return router;
}

export default messageRoutes;
