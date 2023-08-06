import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: '../.env'});

export const generateToken = (object:JwtPayload) =>{
    return jwt.sign({object},process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '24h'
    })
}

