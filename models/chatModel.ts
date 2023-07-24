import mongoose from "mongoose";
import { IChat } from "../types/Schemas";

const ChatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
},{
    timestamps: true
})

const Chat = mongoose.model<IChat>('Chat',ChatSchema);
export default Chat;