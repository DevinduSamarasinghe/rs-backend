import { FormattedRequest } from "../../dto/request/Request"
import { sendMessageRepository, fetchMessageRepository } from "../../repository/messages"

function messageServices(){
    const sendMessageHandler = async(req: FormattedRequest)=>{
        try{
            const {content, chatId} = req.body;
            if(!content || !chatId){
                throw new Error("Invalid data passed into request");
            }
        
            let newMessage = {
                sender: req.user!._id,
                content: content,
                chat: chatId
            };
        
            const message = await sendMessageRepository(newMessage, chatId);
            return message;
        }catch(error:any){
            throw new Error("Error in SendMessageHandler: " + error.message);
        }
    }

    const allMessagesHandler = async(req:FormattedRequest)=>{
        const {chatId} = req.params;
        const messages = await fetchMessageRepository(chatId);
        return messages;
    }

    return {sendMessageHandler, allMessagesHandler};
}

export default messageServices;


