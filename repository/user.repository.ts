import mongoose from "mongoose";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { IUser } from "../dto/Schemas";
import { CreateUserDTO } from "../dto/user.dto";
import dotenv from "dotenv";
dotenv.config({path: "../../.env"});


export const getUser = async(email: string)=>{
    try{
        let user = await User.findOne({email});
        return user;
    }catch(error:any){
        return error.message;
    }
}

export const createUser = async(body:CreateUserDTO):Promise< IUser | null>=>{
    try{
        const {firstName, lastName, email, password, role} = body;
        const newUser = {
            firstName, 
            lastName, 
            email,
            password, 
            role
        }
        const salt = bcrypt.genSaltSync(10);
        newUser.password = bcrypt.hashSync(password, salt);
        const user = new User(newUser) as IUser | null;
        await user?.save();
        return user;
    }catch(error:any){
        return error.message;
    }

}


