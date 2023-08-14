import mongoose from "mongoose";
import User from "../../models/user.model";
import { Request, Response } from "express";
import { FormattedRequest } from "../../dto/Request";
import {
  SessionPass,
  SignUpHandler,
  createSessionHandler,
  signUpHandler,
} from "../../services/user.services";

import { SessionDTO } from "../../dto/user.dto";
import dotenv from "dotenv";
import { invalidateSession } from "../../repository/jwt.repository";
dotenv.config({ path: "../.env" });


/**
 * 
 * @param req 
 * @param res 
 * @returns SignUp Controller
 * 
 */

export const signUp = async (req: Request, res: Response) => {
  try {
    const { data, status } = await signUpHandler(req.body);
    return res.status(status).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns loginUser controller
 */

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log(email, password);
  try {
    const token: SessionPass | null | any = await createSessionHandler(email, password);

    res.cookie("accessToken", token?.accessToken, { httpOnly: true });
    res.cookie("refreshToken", token?.refreshToken, {
      httpOnly: true,
      maxAge: 3.154e10,
    }); //7days
    return res.status(201).json(token?.session);
  } catch (error:any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * 
 * @param req 
 * @param res gets all Users 
 */

export const getAllusers = async (req: FormattedRequest, res: Response) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } }, //this searches patterns in both name and email according to the search query keyword we have
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    if (req.user) {
      const users = await User.find(keyword).find({
        _id: { $ne: req.user._id },
      }); //$ne is used to find all the users except the current user
      res.send(users);
    }
  } catch (error: any) {
    res.status(500).json(`Server Error: ${error.message}`);
  }
};

/**
 * 
 * @param req 
 * @param res 
 * @returns Delete Session Handler works as a logout feature
 */

export const deleteSessionHandler = (req: FormattedRequest, res: Response) => {
  res.cookie("accessToken", "", { maxAge: 0, httpOnly: true });
  res.cookie("refreshToken", "", { maxAge: 0, httpOnly: true });

  const session = invalidateSession(req.user!.sessionId);
  return res.send(session);
};

/**
 * 
 * @param req 
 * @param res 
 * @returns Returns the current Logged in user
 */

export const getCurrentUser = async (req: FormattedRequest, res: Response) => {
  try {
    //@ts-ignore
    return res.send(req.user!);
  } catch (error: any) {
    res.status(500).json(`Server Error: ${error.message}`);
  }
};
