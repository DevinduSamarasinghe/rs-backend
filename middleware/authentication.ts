import { NextFunction, Response } from "express";
import { FormattedRequest } from "../dto/Request";

export const authenticate = (req: FormattedRequest, res: Response, next: NextFunction) => {
    if(!req.user){
        return res.status(401).json({message: "Unauthorized"});
    }
    return next();
}