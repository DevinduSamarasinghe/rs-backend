import User from "../models/user.model";
import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import {Request,Response} from "express";
import { IChat } from "../dto/Schemas";
import { IRequest } from "../dto/Request";

export const accessChat = async(req:IRequest, res: Response)=>{
    
    
    const {userId} = req.body;
    
    //validation
    if(!userId){
        console.log('No UserID provided');
        res.sendStatus(400);
    }

    //check if chat already exists and populating the chat with message and user data
    let isChat:any= await Chat.find({
        $and: [
            {users: {$elemMatch: {$eq: req.user!._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ],
    }).populate("users","-password")
    .populate("latestMessage");

    //latestMessage.sender is a User therefore User data will be populated to the applied path
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "-password"
    });

    //if chat exists then the response will be the chat
    if(isChat!.length > 0){
        res.send(isChat[0]);
    }else{
        try{
            //retrieving the user data of the receving end
            const user = await User.findById(userId).select("firstName lastName"); 

            var chatData = {
                chatName: `Chat between ${req.user!.firstName} ${req.user!.lastName} and ${user!.firstName} ${user!.lastName}`,
                users: [req.user!._id, userId]
            };
            const createdChat = await Chat.create(chatData);
            const FulLChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password").populate("latestMessage");
            res.status(200).json(FulLChat);

        }catch(error:any){
            res.status(400).json("Failed to create or fetch chat:" + error.message);
        }
    }   
}

export const fetchChat = async(req:IRequest, res:Response) =>{

    console.log("REQ USER AT FETCH: " , req.user!._id);
    try{
        await Chat.find({users: {$elemMatch: {$eq: req.user!._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async(results:any)=>{
            results= await User.populate(results, {
                path: "latestMessage.sender",
                select: "firstName lastName email"
            });
            res.status(200).json(results);
        })
    }catch(error:any){
        res.status(400).json("Failed to fetch chat:" + error.message);
    }
}

