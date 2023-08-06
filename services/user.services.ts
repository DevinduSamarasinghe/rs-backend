import { createUser, getUser } from "../repository/user.repository";
import { IUser } from "../dto/Schemas.js";
import { SessionDTO, createSession } from "../repository/jwt.repository";
import { signJWT } from "../config/jwt.config";
import { CreateUserDTO } from "../dto/user.dto";
import bcrypt from "bcrypt";

export type SessionPass = {
    accessToken: string,
    refreshToken: string,
    session: SessionDTO
}

export const createSessionHandler = async(email:string, password:string)=>{

        let user:any= await getUser(email);

        const isMatch = bcrypt.compareSync(password, user.password);
        if(!isMatch){
            const error = "Invalid Credentials"
            throw new Error(error);
        }
            const session = createSession(user!._id, user!.firstName, user!.lastName,user!.email, user!.role);
            const refreshPayload = {
                sessionId: session.sessionId
            }
            const accessToken = signJWT(session, "5s");
            const refreshToken = signJWT(refreshPayload, "7d");

            const sessionPass:SessionPass = {
                accessToken,
                refreshToken,
                session
            }

            return sessionPass;
        
}

export const signUpHandler = async(body: CreateUserDTO):Promise<IUser | string | undefined>=>{
    try{    
        
        //checking if the user exists

        console.log("Body in SignUp,",body);
        let user:any = await getUser(body.email);
        
        if(user){
            return "User exists";
        }else{
            user = createUser(body);
            return user;
        }

    }catch(error:any){
        return error.message;
    }
}