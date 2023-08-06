import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: '../.env'});

export const signJWT = (payload: JwtPayload, expiresIn: string | number ) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn });
}

export const verifyJWT = (token: string)=>{
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        return {payload: decoded, expired: false};
    }catch(error:any){
        return error.message;
    }
}

