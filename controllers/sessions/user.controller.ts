import { Request, Response } from "express";
import { FormattedRequest } from "../../dto/request/Request";
import { SessionPass } from "../../dto/response/user.dto";
import { signUpHandler, createSessionHandler, getUsersHandler } from "../../services/session";
import { invalidateSession } from "../../repository/users";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });


const userController = ()=>{

  //SIGNUP CONTROLLER
  const signUp = async (req: Request, res: Response) => {
    try {
      const { data, status } = await signUpHandler(req.body);
      return res.status(status).json({ data });
    } catch (error: any) {
      return res.status(400).json(`Error in SignUp: ${error.message}`);
    }
  };


  //LOGIN CONTROLLER
  const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const token: SessionPass | null | any = await createSessionHandler(email,password);
      res.cookie("accessToken", token?.accessToken, { httpOnly: true });
      res.cookie("refreshToken", token?.refreshToken, {httpOnly: true,maxAge: 3.154e10,}); //7days
      return res.status(201).json(token?.session);
    } catch (error: any) {
      return res.status(400).json(`Error in LoginUser: ${error.message}`);
    }
  };


  //GET ALL USERS CONTROLLER
  const getAllusers = async (req: FormattedRequest, res: Response) => {
    try {
      const users = await getUsersHandler(req);
      res.send(users);
    }catch (error: any) {
      res.status(400).json(`Error with GetAllUsers:  ${error.message}`);
    }
  };
  

  //DELETE SESSION CONTROLLER
  const deleteSessionHandler = (req: FormattedRequest, res: Response) => {
    try{
      res.cookie("accessToken", "", { maxAge: 0, httpOnly: true });
      res.cookie("refreshToken", "", { maxAge: 0, httpOnly: true });
    
      const session = invalidateSession(req.user!.sessionId);
      return res.send(session);
    }catch(error:unknown){
      res.status(400).json(`Error in DeleteSessionHandler: ${error}`);
    }

  };

  //GET CURRENT USER CONTROLLER
  const getCurrentUser = async (req: FormattedRequest, res: Response) => {
    try {
      //@ts-ignore
      return res.send(req.user!);
    } catch (error: any) {
      res.status(400).json(`Error in GetCurrentUser: ${error.message}`);
    }
  };
  

  return { signUp, loginUser, getAllusers, deleteSessionHandler, getCurrentUser };
}

export default userController;



