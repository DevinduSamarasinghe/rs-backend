import mongoose, {Schema,Document} from "mongoose";
import { IMessage } from "../dto/schema/Schemas";

const MessageSchema:Schema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        trim: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    }
},{
    timestamps: true
})

const Message = mongoose.model<IMessage>('Message',MessageSchema);
export default Message;
