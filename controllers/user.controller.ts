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
        console.log("Called");
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
    try{

        const {email, password} = req.body;

        //check if all the fields are there
        if(!email || !password){
            return res.status(400).json("Please enter all the fields");
        }
        
        //fetching user
        let user:IUser | null = await User.findOne({email: email});

        if(user){
            //creating a token payload
            const payload = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                pic: user.pic
            };
            
            //checking if passwords match
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                 res.send(200).json({user: user, accessToken: generateToken(payload)})
            }else{
                res.send(400).json("Invalid Password, Please try again");
            }
        }else{
            //if no user found by this email
            res.status(400).json("No user found under the provided email. Please try again");
        }

    }catch(error){
        res.status(500).json(`Internal server error: ${error}`)
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



