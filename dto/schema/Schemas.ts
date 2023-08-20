import { Document } from "mongoose";

export interface IUser extends Document { 
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    pic: string,
}

export interface IChat extends Document {
    chatName: string,
    users: IUser['_id'][],
    latestMessage: IMessage['_id'],
}

export interface IMessage extends Document {
    sender: IUser['_id'],
    content: string,
    chat: IChat['_id']
}

