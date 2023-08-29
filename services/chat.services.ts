import { FormattedRequest } from "../dto/request/Request";
import { JwtPayload } from "jsonwebtoken";
import ChatRepository, { ChatRepositoryInstance } from "../repository/chat.repository";
import { FetchChatResponseDTO } from "../dto/response/chat.dto";

export interface ChatServiceInstance {
    accessChatHandler: (userId: string, loggedUser: JwtPayload) => Promise<any>;
    fetchChatHandler: (req: FormattedRequest) => Promise<FetchChatResponseDTO>;
}

//instance of the ChatService
let instance: ChatServiceInstance |  null = null;

/**
 * 
 * @returns Chat Service instance
 */
export default function ChatServices() {

    if(instance){
        return instance;
    }

    //function access of ChatRepository
    const chatRepository: ChatRepositoryInstance = ChatRepository();

    /**
     * 
     * @param userId 
     * @param loggedUser 
     * @returns Handles the chat access repository
     */
    const accessChatHandler = async (userId: string, loggedUser: JwtPayload) => {

        if (!userId) {
            throw new Error("User ID not provided");
        }
        const data = await chatRepository.accessChatRepository(loggedUser!, userId);
        return data;
    };

    /**
     * 
     * @param req 
     * @returns handles the fetch chat repository for the logged user
     */
    const fetchChatHandler = async (req: FormattedRequest) => {
        const chat = await chatRepository.fetchChatRepository(req);
        return chat;
    };
    
    const chatServiceInstance = {accessChatHandler, fetchChatHandler};
    instance = chatServiceInstance;

    return chatServiceInstance;
}

