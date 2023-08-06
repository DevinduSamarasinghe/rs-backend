import {Response,NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { IRequest } from "../dto/Request";
import { verifyJWT } from "../config/jwt.config";
dotenv.config({path: '../.env'});

export const deserealizeUser = (req:IRequest, res:Response, next:NextFunction)=>{
    const {accessToken, refreshToken} = req.cookies;

    console.log("Access Token: ", accessToken);
    console.log("Refresh Token: ", refreshToken);

    if(!accessToken){
        return next();
    }

    const {payload, expired} = verifyJWT(accessToken);

    //for a valid access token 
    if(payload){
        req.user = payload;
        console.log(req.user);
        return next();
    }

    //expired by valid access token 
    const {payload: refresh} = expired && refreshToken ? verifyJWT(refreshToken): {payload: null};

    console.log("Refresh is: ", refresh);


    if(!refresh){
        return next();
    }
}
