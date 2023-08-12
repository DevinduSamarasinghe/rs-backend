import User from "../models/user.model";
import Chat from "../models/chatModel";
import Message from "../models/messageModel";

import { IRequest } from "../dto/Request";

export const accessChatRepository = async (
  loggedUser: IRequest["user"],
  userId: string
) => {
  try {
    let isChat: any = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: loggedUser!._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "-password",
    });
    if (isChat!.length > 0) {
      return { status: 200, data: isChat[0] };
    } else {
      try {
        const user = await User.findById(userId).select("firstName lastName");

        let chatData = {
          chatName: `Chat between ${loggedUser!.firstName} ${
            loggedUser!.lastName
          } and ${user!.firstName} ${user!.lastName}`,
          users: [loggedUser!._id, userId],
        };
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat!._id })
          .populate("users", "-password")
          .populate("latestMessage");
        return { status: 200, data: fullChat };
      } catch (error: any) {
        return {
          status: 400,
          data: "Failed to create or fetch chat:" + error.message,
        };
      }
    }
  } catch (error: any) {
    return {
      status: 400,
      data: "Failed to create or fetch chat:" + error.message,
    };
  }
};
