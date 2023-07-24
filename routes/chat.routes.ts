import express from "express";
import { authenticate } from "../middleware/authenticate";
import { accessChat, fetchChat } from "../controllers/chatController";

const router = express.Router();
router.post('/',authenticate,accessChat);
router.get('/',authenticate,fetchChat);

export default router;