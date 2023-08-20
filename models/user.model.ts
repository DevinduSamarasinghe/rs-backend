import mongoose, {Schema}from "mongoose";
import { IUser } from "../dto/schema/Schemas";

const UserSchema:Schema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{
    timestamps: true
});

const User  = mongoose.model<IUser>('User',UserSchema);
export default User;