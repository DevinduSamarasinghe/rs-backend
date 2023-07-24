import {Response,NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { IRequest } from "../types/Request";

dotenv.config({path: '../.env'});


export const authenticate = async(req:IRequest,res:Response,next:NextFunction)=>{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try{
            token = req.headers.authorization.split(' ')[1];
            
            //decode the token Id
            let decoded:any= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
            decoded = decoded;
          
                req.user = await User.findById(decoded.object._id);
                console.log("DECODED: ", decoded.object._id);
                next();    
            
        }catch(error){
            res.status(401).json("Not authorized, token failed");
        }

        if(!token){
            res.status(401).json("Not authorized, no token");
        }
    }

}