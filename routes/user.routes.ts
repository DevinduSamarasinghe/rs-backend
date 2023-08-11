import express,{Router} from "express"
import { getAllusers, loginUser, signUp, getCurrentUser } from "../controllers/sessions/user.controller";
import { authenticate } from "../middleware/authentication";

const router:Router = express.Router();

router.get('/',authenticate,getAllusers);
router.get("/current",authenticate,getCurrentUser);
router.post('/login',loginUser);
router.post('/register',signUp);


export default router;





