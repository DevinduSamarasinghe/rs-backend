import { CreateUserDTO } from "../dto/user.dto";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { IUser } from "../dto/Schemas";

export type SessionDTO = {
    sessionId: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    role:string,
    valid: boolean
}
export const sessions: Record<string,SessionDTO> = {};

export const createSession = (id:string, firstName:string, lastName:string, email:string, role:string)=>{

    const sessionId = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
    const session = {
        sessionId,
        userId: id,
        firstName,
        lastName,
        email,
        role,
        valid: true
    }

    sessions[sessionId] = session;
    return session;
}

export const getSession = (sessionId: string)=>{
    const session = sessions[sessionId];
    return session && session.valid ? session : null;
}

export const invalidateSession = (sessionId: string) =>{
    const session = sessions[sessionId];
    if(session){
        sessions[sessionId].valid = false;
    }
}
