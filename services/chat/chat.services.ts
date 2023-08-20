import { FormattedRequest } from "../../dto/request/Request";
import { JwtPayload } from "jsonwebtoken";
import { accessChatRepository, fetchChatRepository } from "../../repository/chat";



function chatServices(){
     const accessChatHandler = async (userId: string, loggedUser: JwtPayload) => {
        //validae user 
            if(!userId){
                throw new Error("User ID not provided ");
            }
            const data  = await accessChatRepository(loggedUser!, userId);
            return data;
    }
    
     const fetchChatHandler = async(req: FormattedRequest)=>{
        const chat = await fetchChatRepository(req);
        return chat;
    }

    return {accessChatHandler, fetchChatHandler};
}

export default chatServices;