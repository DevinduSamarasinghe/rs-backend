import { Request, Response } from "express";
import { FormattedRequest } from "../../dto/request/Request";
import { SessionPass } from "../../dto/response/user.dto";
import { signUpHandler, createSessionHandler, getUsersHandler } from "../../services/session";
import { invalidateSession } from "../../repository/users";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });


const userController = ()=>{


  const signUp = async (req: Request, res: Response) => {
    try {
      const data = await signUpHandler(req.body);
      return res.status(201).json({ data });

    } catch (error: any) {
      return res.status(400).json(error.message);

    }
  };


  const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const token: SessionPass | null | any = await createSessionHandler(email,password);
      res.cookie("accessToken", token?.accessToken, { httpOnly: true, sameSite:"none", secure: true });
      res.cookie("refreshToken", token?.refreshToken, {httpOnly: true, sameSite:"none",maxAge: 3.154e10, secure: true }); //7days

      return res.status(201).json(token?.session);

    } catch (error: any) {
      return res.status(400).json(error.message);

    }
  };


  const getAllusers = async (req: FormattedRequest, res: Response) => {
    try {
      const users = await getUsersHandler(req);
      res.send(users);

    }catch (error: any) {
      res.status(400).json(error.message);

    }
  };
  

  const deleteSessionHandler = (req: FormattedRequest, res: Response) => {
    try{
      res.cookie("accessToken", "", { maxAge: 0, httpOnly: true, sameSite:"none",secure: true });
      res.cookie("refreshToken", "", { maxAge: 0, httpOnly: true , sameSite:"none",secure: true });
    
      const session = invalidateSession(req.user!.sessionId);
      return res.send(session);

    }catch(error:any){
      res.status(400).json(error.message);

    }

  };


  const getCurrentUser = async (req: FormattedRequest, res: Response) => {
    try {
      //@ts-ignore
      return res.send(req.user!);

    } catch (error: any) {
      res.status(400).json(error.message);

    }
  };
  

  return { signUp, loginUser, getAllusers, deleteSessionHandler, getCurrentUser };
}

export default userController;



