import { NextFunction, Response } from "express";
import { IRequest } from "../dto/Request";

export const authenticate = (req: IRequest, res: Response, next: NextFunction) => {
    if(!req.user){
        return res.status(401).json({message: "Unauthorized"});
    }
    return next();
}