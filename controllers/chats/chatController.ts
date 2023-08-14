import User from "../../models/user.model";
import Chat from "../../models/chatModel";
import Message from "../../models/messageModel";
import { Response } from "express";
import { FormattedRequest } from "../../dto/Request";
import { retrieveChat } from "../../services/chat.services";

export const accessChat = async (req: FormattedRequest, res: Response) => {
  const { userId } = req.body;
  const loggedUser = req.user;
  const { status, data } = await retrieveChat(userId, loggedUser!);
  res.status(status).json(data);
};

export const fetchChat = async (req: FormattedRequest, res: Response) => {
  console.log("REQ USER AT FETCH: ", req.user!._id);
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user!._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results: any) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName email",
        });
        res.status(200).json(results);
      });
  } catch (error: any) {
    res.status(400).json("Failed to fetch chat:" + error.message);
  }
};
