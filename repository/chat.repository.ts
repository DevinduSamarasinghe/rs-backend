import User from '../models/user.model'
import Chat from '../models/chatModel'
import Message from '../models/messageModel'

import { FormattedRequest } from '../dto/request/Request'
import { FetchChatResponseDTO } from '../dto/response/chat.dto'

export interface ChatRepositoryInstance {
  accessChatRepository: (loggedUser: FormattedRequest['user'],userId: string) => Promise<any>
  fetchChatRepository: (req: FormattedRequest) => Promise<FetchChatResponseDTO>
}

let instance: ChatRepositoryInstance | null = null;

/**
 * 
 * @returns Chat Repository instance
 */
function ChatRepository () {

  if (instance) {
    return instance
  }

  /**
   * 
   * @param loggedUser 
   * @param userId 
   * @returns Full Chat Information including, users, last message and chat name
   */
  const accessChatRepository = async (loggedUser: FormattedRequest['user'], userId: string) => {
    try {
      let isChat: any = await Chat.find({
        $and: [
          { users: { $elemMatch: { $eq: loggedUser!._id } } },
          { users: { $elemMatch: { $eq: userId } } }
        ]
      })
        .populate('users', '-password')
        .populate('latestMessage')

      isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: '-password'
      })
      if (isChat!.length > 0) {
        return isChat[0]
      } else {
        try {
          const user = await User.findById(userId).select('firstName lastName')
          let chatData = {
            chatName: `Chat between ${loggedUser!.firstName} ${
              loggedUser!.lastName
            } and ${user!.firstName} ${user!.lastName}`,
            users: [loggedUser!._id, userId]
          }
          const createdChat = await Chat.create(chatData)
          const fullChat = await Chat.findOne({ _id: createdChat!._id })
            .populate('users', '-password')
            .populate('latestMessage')
          return fullChat
        } catch (error: any) {
          throw new Error('Error in Repository: ' + error.message)
        }
      }
    } catch (error: any) {
      return {
        status: 400,
        data: 'Failed to create or fetch chat:' + error.message
      }
    }
  }


  /**
   * 
   * @param req 
   * @returns all chats relevant to the user 
   */
  const fetchChatRepository = async (req: FormattedRequest):Promise<FetchChatResponseDTO> => {
    try {
      const chats: FetchChatResponseDTO = await Chat.find({
        users: { $elemMatch: { $eq: req.user!._id } }
      })
        .populate('users', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })
        .then(async (results: any) => {
          results = await User.populate(results, {
            path: 'latestMessage.sender',
            select: 'firstName lastName email'
          })
          return results
        })

      return chats
    } catch (error: any) {
      throw new Error('Repository error: ' + error.message)
    }
  }

  const chatRepositoryInstance = { accessChatRepository, fetchChatRepository }
  instance = chatRepositoryInstance;
  return chatRepositoryInstance;
}

export default ChatRepository;
