import express from "express";
import { authenticate } from "../middleware/authentication";
import { accessChat, fetchChat } from "../controllers/chats/chatController";

const router = express.Router();
router.post('/',authenticate,accessChat);
router.get('/',authenticate,fetchChat);

export default router;