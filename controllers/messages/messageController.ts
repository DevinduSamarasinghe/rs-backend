import { FormattedRequest } from "../../dto/request/Request";
import { allMessagesHandler, sendMessageHandler } from "../../services/messages";

function messageController(){
    const allMessages = async(req:FormattedRequest, res:any)=>{
        try{
            const messages = await allMessagesHandler(req);
            res.status(200).json(messages);
        }catch(error:any){
            res.status(400).json("Failed to fetch messages", error.message);
        }
    }

    const sendMessage = async(req:FormattedRequest, res:any)=>{
        try{
            const message = await sendMessageHandler(req);
            res.status(200).json(message);
        }catch(error:any){
            res.status(400).json(error.message);
        }   
    }

    return {sendMessage, allMessages};
}

export default messageController;