import User from "../../models/user.model";
import Chat from "../../models/chatModel";
import Message from "../../models/messageModel";
import { FormattedRequest } from "../../dto/request/Request";

export const sendMessage = async(req:FormattedRequest, res:any)=>{
    const {content,chatId} = req.body;

    if(!content || !chatId){
        return res.sendStatus(400).send("Invalid data passed into request");
    }

    var newMessage = {
        sender: req.user!._id,
        content: content,
        chat: chatId
    };

    try{
        var message:any = await Message.create(newMessage);
        message = await message.populate("sender", "-password");
        message = await message.populate("chat");
        message = await User.populate(message, {path: "chat.users", select: "-password"});
        message = await Message.populate(message, {path: "chat.latestMessage",select:"content sender"});
        message = await User.populate(message, {path: "chat.latestMessage.sender", select: "firstName lastName email"})

        await Chat.findByIdAndUpdate(chatId, {latestMessage: message});
        res.json(message);
        
    }catch(error:any){
        res.status(400).json("Failed to send message", error.message)
    }   
}

export const allMessages = async(req:FormattedRequest, res:any)=>{

    const {chatId} = req.params;
    try{
        const messages = await Message.find({chat: chatId}).populate('sender','firstName lastName pic email');
        res.status(200).json(messages);
    }catch(error:any){
        res.status(400).json("Failed to fetch messages", error.message);
    }
}