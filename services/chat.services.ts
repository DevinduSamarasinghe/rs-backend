import { FormattedRequest } from "../dto/request/Request";
import { JwtPayload } from "jsonwebtoken";
import ChatRepository, { ChatRepositoryInstance } from "../repository/chat.repository";
import { FetchChatResponseDTO } from "../dto/response/chat.dto";

export interface ChatServiceInstance {
    accessChatHandler: (userId: string, loggedUser: JwtPayload) => Promise<any>;
    fetchChatHandler: (req: FormattedRequest) => Promise<FetchChatResponseDTO>;
}

let instance: ChatServiceInstance |  null = null;

export default function ChatServices() {

    if(instance){
        return instance;
    }

    const chatRepository: ChatRepositoryInstance = ChatRepository();

    const accessChatHandler = async (userId: string, loggedUser: JwtPayload) => {

        if (!userId) {
            throw new Error("User ID not provided");
        }
        const data = await chatRepository.accessChatRepository(loggedUser!, userId);
        return data;
    };

    const fetchChatHandler = async (req: FormattedRequest) => {
        const chat = await chatRepository.fetchChatRepository(req);
        return chat;
    };
    
    const chatServiceInstance = {accessChatHandler, fetchChatHandler};
    instance = chatServiceInstance;

    return chatServiceInstance;
}

