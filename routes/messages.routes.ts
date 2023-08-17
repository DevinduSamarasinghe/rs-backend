import express, {Router} from "express"
import { allMessages, sendMessage } from "../controllers/messages/messageController";
import { authenticate } from "../middleware/authentication";

const router:Router = express.Router();
router.post('/',authenticate,sendMessage);
router.get('/:chatId',authenticate,allMessages)

export default router;