import mongoose from "mongoose";
import User from "../../models/user.model";
import {Request,Response} from "express";
import { IRequest } from "../../dto/Request";
import { SessionPass, createSessionHandler, signUpHandler } from "../../services/user.services";
import { IUser } from "../../dto/Schemas";

import dotenv from "dotenv";
import { SessionDTO } from "../../repository/jwt.repository";
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
    try{
        const token:SessionPass=  await createSessionHandler(email,password); 
        res.cookie("accessToken", token.accessToken, {httpOnly: true, maxAge: 5*60*1000});  //5mins     
        res.cookie("refreshToken", token.refreshToken, {httpOnly: true,maxAge: 7*24*60*60*1000});   //7days
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



