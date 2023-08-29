import Message from "../models/messageModel";
import Chat from "../models/chatModel";
import User from "../models/user.model";


export interface MessageRepositoryInstance {
  sendMessageRepository: (newMessage: any, chatId: string) => Promise<any>;
  fetchMessageRepository: (chatId: string) => Promise<any>;
}

let instance:MessageRepositoryInstance | null = null; 

/**
 * 
 * @returns Message Repository instance
 */
function MessageRepository() {

  if(instance){
    return instance;
  }

  /**
   * 
   * @param newMessage 
   * @param chatId 
   * @returns Repository function to create messags in the database
   */
  const sendMessageRepository = async (newMessage: any, chatId: string):Promise<any> => {
    try {
      let message: any = await Message.create(newMessage);
      message = await message.populate("sender", "-password");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "-password",
      });
      message = await Message.populate(message, {
        path: "chat.latestMessage",
        select: "content sender",
      });
      message = await User.populate(message, {
        path: "chat.latestMessage.sender",
        select: "firstName lastName email",
      });

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
      return message;
    } catch (error: any) {
      throw new Error("Error in SendMessageRepository: " + error.message);
    }
  };

  /**
   * 
   * @param chatId 
   * @returns fetches all the messages relevant to the chatID
   */
  const fetchMessageRepository = async (chatId: string):Promise<any> => {
    try {
      const messages = await Message.find({ chat: chatId }).populate(
        "sender",
        "firstName lastName pic email"
      );
      return messages;
    } catch (error: any) {
      throw new Error("Error in FetchMessageRepository: " + error.message);
    }
  };

  const messageRepository =  { sendMessageRepository, fetchMessageRepository };
  instance = messageRepository;
  return messageRepository;
}

export default MessageRepository;
