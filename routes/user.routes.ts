import express,{Router} from "express"
import { getAllusers, loginUser, signUp } from "../controllers/user.controller";
import { authenticate} from "../middleware/authenticate";

const router:Router = express.Router();


router.get('/',authenticate,getAllusers);
router.post('/login',loginUser);
router.post('/register',signUp);

export default router;





