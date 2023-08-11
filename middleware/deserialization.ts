import {Response,NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { IRequest } from "../dto/Request";
import { verifyJWT, signJWT } from "../config/jwt.config";
import { getSession } from "../repository/jwt.repository";
dotenv.config({path: '../.env'});

export const deserealizeUser = (req:IRequest, res:Response, next:NextFunction)=>{
    const {accessToken, refreshToken} = req.cookies;

    console.log("Access Token at deserialization: ", accessToken);
    console.log("Refresh Token at deserialization: ", refreshToken);

    if(!accessToken){
        return next();
    }

    console.log("Access Token post access Error: ", accessToken);
    const {payload, expired} = verifyJWT(accessToken);
    console.log("Payload at deserial:",payload);
    //for a valid access token 
    if(payload){

        //@ts-ignore
        req.user = payload;
        console.log("Req User at valid access token deserialize:",req.user);
        return next();
    }

    //expired by valid access token 
    const {payload: refresh} = expired && refreshToken ? verifyJWT(refreshToken): {payload: null};
    console.log("Refresh is:", refresh)
    if(!refresh){
        return next();
    }

    //@ts-ignore
    
    const session = getSession(refresh.sessionId);
    console.log(session);
    const newAccessToken = signJWT(session!, '5s');

    res.cookie('accessToken',newAccessToken,{
        maxAge: 300000,
        httpOnly: true
    });

    //@ts-ignore
    req.user = verifyJWT(newAccessToken).payload;

    return next();
}
