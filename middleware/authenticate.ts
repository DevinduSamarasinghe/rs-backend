import { Request,Response,NextFunction,ErrorRequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { decode } from "punycode";
dotenv.config({path: '../.env'});

export interface IRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = async(req:IRequest,res:Response,next:NextFunction)=>{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try{
            token = req.headers.authorization.split(' ')[1];
            
            //decode the token Id
            const decoded= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
            if(typeof decoded == "object"){
                req.user =  User.findById(decoded.object._id).select("-password");
                console.log(req.user);
                next();    
            }
        }catch(error){
            res.status(401);
            throw new Error("Not authorized, token failed");
        }

        if(!token){
            res.status(401);
            throw new Error('Not authorized, No Token');
        }
    }

}