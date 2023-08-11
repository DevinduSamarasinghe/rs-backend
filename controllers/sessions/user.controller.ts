import mongoose from "mongoose";
import User from "../../models/user.model";
import {Request,Response} from "express";
import { IRequest } from "../../dto/Request";
import { SessionPass, createSessionHandler, signUpHandler } from "../../services/user.services";
import { IUser } from "../../dto/Schemas";

import dotenv from "dotenv";
import { SessionDTO, invalidateSession } from "../../repository/jwt.repository";
dotenv.config({path: '../.env'});

export const signUp = async(req:Request, res:Response)=>{
    try{
        const body = req.body;
        const user: IUser | string | null | undefined= await signUpHandler(body);
        if(user){
            if(typeof user === "string"){
                return res.status(400).json({message: user});
            }else{
                return res.status(201).json({message: "User Created Successfully", user});
            }
            
        }
    }catch(error:any){
        res.status(500).json(`Server Error: ${error.message}`);
    }
}

export const loginUser = async(req:Request, res:Response)=>{

    const {email, password} = req.body;

    console.log(email, password);
    try{
        const token:SessionPass=  await createSessionHandler(email,password); 

        console.log("Token:", token);
        res.cookie("accessToken", token.accessToken, {httpOnly: true});      
        res.cookie("refreshToken", token.refreshToken, {httpOnly: true,maxAge: 3.154e10});   //7days
        return res.status(201).json(token.session)

    }catch(error){
        return res.status(400).json({message: "Failed to Login"});
    }
}

export const getAllusers = async(req:IRequest,res:Response) =>{
    try{
        const keyword = req.query.search ? {
            $or: [  
                {firstName: {$regex: req.query.search, $options: 'i'}},  //this searches patterns in both name and email according to the search query keyword we have
                {email: {$regex: req.query.search, $options: 'i'}},
                
            ],
        }: {};
        if(req.user){
            const users = await User.find(keyword).find({_id: {$ne: req.user._id}})//$ne is used to find all the users except the current user
            res.send(users);
        }    
    }catch(error:any){
        res.status(500).json(`Server Error: ${error.message}`);
    }
}

export const deleteSessionHandler = (req:IRequest, res: Response)=>{
    res.cookie("accessToken","",{maxAge: 0, httpOnly:true})
    res.cookie("refreshToken","",{maxAge: 0, httpOnly:true})

    const session = invalidateSession(req.user!.sessionId);
    return res.send(session);
}

export const getCurrentUser = async(req:IRequest,res:Response) =>{
    try{
        //@ts-ignore
        console.log("res.locals.user?",res.locals.user);
        return res.send(res.locals.user);
    }catch(error:any){
        res.status(500).json(`Server Error: ${error.message}`);
    }
}



