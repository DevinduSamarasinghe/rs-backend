import Message from "../../models/messageModel";
import Chat from "../../models/chatModel";
import User from "../../models/user.model";

function messageRepository() {
  const sendMessageRepository = async (newMessage: any, chatId: string) => {
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

  const fetchMessageRepository = async (chatId: string) => {
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

  return { sendMessageRepository, fetchMessageRepository };
}

export default messageRepository;
