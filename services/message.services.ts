import { FormattedRequest } from "../dto/request/Request"
import MessageRepository, { MessageRepositoryInstance } from "../repository/message.repository";

export interface MessageServiceInstance {
    sendMessageHandler: (req: FormattedRequest) => Promise<any>;
    allMessagesHandler: (req: FormattedRequest) => Promise<any>;
}

let instance: MessageServiceInstance | null = null;

/**
 * 
 * @returns Message Service instance
 */
function MessageServices(){

    if(instance){
        return instance;
    }

    const messageRepository:MessageRepositoryInstance = MessageRepository();

    /**
     * 
     * @param req 
     * @returns returns the message sent with relevant logic
     */
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
        
            const message = await messageRepository.sendMessageRepository(newMessage, chatId);
            return message;
        }catch(error:any){
            throw new Error("Error in SendMessageHandler: " + error.message);
        }
    }

    /**
     * 
     * @param req ChatID from the logged user
     * @returns retuns all messages via the repository
     */
    const allMessagesHandler = async(req:FormattedRequest)=>{
        const {chatId} = req.params;
        const messages = await messageRepository.fetchMessageRepository(chatId);
        return messages;
    }

    return {sendMessageHandler, allMessagesHandler};
}

export default MessageServices;


