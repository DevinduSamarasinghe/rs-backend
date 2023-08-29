import express, { Router } from "express";
import { getAllusers, getCurrentUser, loginUser, signUp, deleteSessionHandler } from "../controllers/sessions";
import { authenticate } from "../middleware/authentication";

/**
 * @returns User Router
 */
function userRoutes(){
  const router: Router = express.Router();
  router.get("/", authenticate, getAllusers);
  router.get("/current", authenticate, getCurrentUser);
  router.post("/login", loginUser);
  router.post("/register", signUp);
  router.post("/delete", authenticate, deleteSessionHandler);

  return router;
};

export default userRoutes;
