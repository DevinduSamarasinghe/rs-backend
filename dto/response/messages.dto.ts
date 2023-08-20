import { FetchUserDTO } from "./user.dto";
import { AccessChatResponseDTO } from "./chat.dto";

export type SendMessageResponseDTO = {
    sender: FetchUserDTO,
    content: string,
    chat: AccessChatResponseDTO['_id'],
    latestMessage: SendMessageResponseDTO,
    _id: string,
    createdAt: Date,
    updatedAt: Date,
}

export type FetchMessagesResponseDTO = {
    _id: string,
    sender: FetchUserDTO,
    content: string,
    chat: AccessChatResponseDTO['_id'],
    createdAt: Date,
    updatedAt: Date,
}
