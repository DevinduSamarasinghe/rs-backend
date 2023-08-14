import {Response,NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";
import { FormattedRequest } from "../dto/Request";
import { verifyJWT, signJWT } from "../config/jwt.config";
import { getSession } from "../repository/jwt.repository";
dotenv.config({path: '../.env'});

export const deserealizeUser = (req:FormattedRequest, res:Response, next:NextFunction)=>{

    const {accessToken, refreshToken} = req.cookies;
    console.log("Access Token: ", accessToken);
    console.log("Refresh Token: ", refreshToken);

    if(!accessToken){
        return next();
    }

    const {payload, expired} = verifyJWT(accessToken);

    //for a valid access token 
    if(payload){
        //@ts-ignore
        req.user = payload;

        //@ts-ignore
        console.log(req.user);
        return next();
    }


    //expired but valid access token
    const {payload: refresh} = expired && refreshToken ? verifyJWT(refreshToken) : {payload: null};

    console.log("Refresh is: ",refresh);
    if(!refresh){
        return next();
    }

    //@ts-ignore
    const session = getSession(refresh.sessionId);
    console.log("Session is: ",session);
    if(!session){
        return next();
    }

    const newAccessToken = signJWT(session, "5s");
    res.cookie("accessToken", newAccessToken, {maxAge: 3000000, httpOnly: true});
    //@ts-ignore
    req.user = verifyJWT(newAccessToken).payload;
    return next();
}
