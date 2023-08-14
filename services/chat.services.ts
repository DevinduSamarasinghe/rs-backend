import { Request, Response } from "express"
import { accessChatRepository } from "../repository/chat.repository";
import { JwtPayload } from "jsonwebtoken";

export const retrieveChat = async (userId: string, loggedUser: JwtPayload) => {
        //validation
        if(!userId){
            return {status: 400, data: "No UserID provided"};
        }
        const {status, data} = await accessChatRepository(loggedUser!, userId);
        return {status, data};


}