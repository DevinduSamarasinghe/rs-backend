import { FormattedRequest } from "../../dto/request/Request";
import MessageServices, {MessageServiceInstance} from "../../services/message.services";
function messageController(){

    const messageServices:MessageServiceInstance = MessageServices();

    const allMessages = async(req:FormattedRequest, res:any)=>{
        try{

            const messages = await messageServices.allMessagesHandler(req);
            res.status(200).json(messages);

        }catch(error:any){

            res.status(400).json("Failed to fetch messages", error.message);

        }
    }

    const sendMessage = async(req:FormattedRequest, res:any)=>{
        try{

            const message = await messageServices.sendMessageHandler(req);
            res.status(200).json(message);

        }catch(error:any){

            res.status(400).json(error.message);

        }   
    }

    return {sendMessage, allMessages};
}

export default messageController;