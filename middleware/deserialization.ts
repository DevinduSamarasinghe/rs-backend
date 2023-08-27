import {Response,NextFunction} from "express"
import dotenv from "dotenv";
import { FormattedRequest } from "../dto/request/Request";
import { verifyJWT, signJWT } from "../config/jwt.config";
import UserServices, { UserServicesInstance } from "../services/user.services";
import SessionRepository, {SessionRepositoryInstance} from "../repository/users/jwt.repository";
dotenv.config({path: '../.env'});

export const deserealizeUser = (req:FormattedRequest, res:Response, next:NextFunction)=>{

    const {accessToken, refreshToken} = req.cookies;
    const sessionRepository:SessionRepositoryInstance = SessionRepository();
    //it will be passed to unauthorized if no access token is present
    if(!accessToken){
        return next();
    }

    //checking if the payload is valid and is expired 
    const {payload, expired} = verifyJWT(accessToken);
    
    //for a valid access token 
    if(payload){
        //@ts-ignore
        req.user = payload;
        return next();
    }

    //expired but valid access token
    const {payload: refresh} = expired && refreshToken ? verifyJWT(refreshToken) : {payload: null};

    if(!refresh){
        return next();
    }

    //@ts-ignore
    const session = sessionRepository.getSession(refresh.sessionId);
    if(!session){
        return next();
    }

    const newAccessToken = signJWT(session, "10s");
    res.cookie("accessToken", newAccessToken, {maxAge: 3000000, httpOnly: true, sameSite:"none",secure: true });
    //@ts-ignore
    req.user = verifyJWT(newAccessToken).payload;
    return next();
}
