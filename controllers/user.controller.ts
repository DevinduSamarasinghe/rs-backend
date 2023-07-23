import mongoose from "mongoose";
import User,{IUser,} from "../models/user.model";
import {Request,Response} from "express";
import dotenv from "dotenv";
dotenv.config({path: '../.env'});
import bcrypt from "bcrypt";

import { IRequest } from "../middleware/authenticate";

import { generateToken } from "../config/generateToken";
import { JwtPayload } from "jsonwebtoken";


export const signUp = async(req:Request,res:Response) => {
    try{
        const body = req.body;

        //checking if all the information have been given
        if(!body.firstName || !body.lastName || !body.email || !body.password){
            return res.status(400).json("Please enter all the valid information");
        }

        //checking if the user exists
        let user: IUser | null = await User.findOne({email: body.email});
        if(user){
            return res.status(400).json({message: "User exists"});
        }else{
           const {firstName, lastName, email, password, role, pic} = body;
            const newUser = {
                firstName, 
                lastName,
                email,
                password,
                role,
                pic
            }

            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(password, salt);
            user = new User(newUser) as IUser | null;
            user?.save();

           if(user){
            const payload = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                pic: user.pic
            };

            return res.status(201).json({user: user, accessToken: generateToken(payload)});
           }else{
            return res.status(400).json("Failed to Sign Up");
           }
        }
    }catch(error){
        res.send(`Error in catch statement: ${error}`);
    }
}

export const loginUser = async(req:Request,res:Response)=>{
    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User doesn't exist. Please check your Email."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Incorrect Password. Please try again"});
        }

        const payload = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            pic: user.pic
        }

        if(user){
             res.status(201).json({user: user, accessToken: generateToken(payload)});
        }else{
            res.status(400).json({error: "Failed to Login"}); 
        }

    }catch(error){
        res.send(`Internal Server Error :${error}`);
    }
}

export const getAllusers = async(req:IRequest,res:Response) =>{
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
}



