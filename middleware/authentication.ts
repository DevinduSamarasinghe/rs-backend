import { NextFunction, Response } from "express";
import { FormattedRequest } from "../dto/request/Request";

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns Checks if the user is authenticated, if not the user is not allowed to access the resource
 */
export const authenticate = (req: FormattedRequest, res: Response, next: NextFunction) => {
    if(!req.user){
        return res.status(401).json({message: "Unauthorized"});
    }
    return next();
}