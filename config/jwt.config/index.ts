import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({path: '../.env'});

export function signJWT(payload: JwtPayload, expiresIn: string | number){
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET!, {expiresIn});
}

//JWT authentication process 
export function verifyJWT(token: string){
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!); 
        return {payload: decoded, expired: false}
    }catch(error:any){
        return {payload: null, expired: error.message.includes("jwt expired")};
    }
}

