import { Response } from 'express'
import { FormattedRequest } from '../../dto/request/Request'
import ChatServices, { ChatServiceInstance } from '../../services/chat.services'

function chatController () {
  const chatService: ChatServiceInstance = ChatServices()

  const accessChat = async (req: FormattedRequest, res: Response) => {
    try {
      const { userId } = req.body
      const data = await chatService.accessChatHandler(userId, req.user!)
      res.status(200).json(data)
    } catch (error: any) {
      res.status(400).json(error.message)
    }
  }

  const fetchChat = async (req: FormattedRequest, res: Response) => {
    try {
      const chats = await chatService.fetchChatHandler(req)
      res.status(200).json(chats)
    } catch (error: any) {
      res.status(400).json(error.message)
    }
  }

  return { accessChat, fetchChat }
}

export default chatController
