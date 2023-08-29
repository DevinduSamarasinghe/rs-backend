import {Response,NextFunction} from "express"
import dotenv from "dotenv";
import { FormattedRequest } from "../dto/request/Request";
import { verifyJWT, signJWT } from "../config/jwt.config";
import SessionRepository, {SessionRepositoryInstance} from "../repository/jwt.repository";
dotenv.config({path: '../.env'});


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns session token, or access to the resources depending on the status of the access token
 */
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

    //if no refresh token is available. block access
    if(!refresh){
        return next();
    }

    //creates a session if the refresh token is valid
    //@ts-ignore
    const session = sessionRepository.getSession(refresh.sessionId);
    if(!session){
        return next();
    }

    const newAccessToken = signJWT(session, "2h");
    res.cookie("accessToken", newAccessToken, {maxAge: 3000000, httpOnly: true, sameSite:"none",secure: true });
    //@ts-ignore
    req.user = verifyJWT(newAccessToken).payload;
    return next();
}
