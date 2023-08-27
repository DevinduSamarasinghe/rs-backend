import User from "../models/user.model";
import bcrypt from "bcrypt";
import { IUser } from "../dto/schema/Schemas";
import { CreateUserDTO } from "../dto/request/user.dto";
import dotenv from "dotenv";
import { FetchUserDTO } from "../dto/response/user.dto";
dotenv.config({path: "../../.env"});

export interface UserRespositoryInstance {
    getUser: (email: string)=>Promise<FetchUserDTO | null>;
    createUser: (body: CreateUserDTO)=>Promise<CreateUserDTO | any>;
}

let instance:UserRespositoryInstance | null = null;

function UserRepository(){

    if(instance){
        return instance;
    }

    const getUser = async(email: string):Promise<FetchUserDTO | null>=>{
        try{
            const user:FetchUserDTO | null = await User.findOne({email});
            if(user){
                return user;
            }else{
                return null;
            }
        }catch(error:any){
            throw new Error("Error in Repository: " + error.message);
        }
    }

    const createUser = async(body:CreateUserDTO):Promise<CreateUserDTO | any>=>{
        try{
            const {firstName, lastName, email, password, role} = body;
            const newUser = {
                firstName, 
                lastName, 
                email,
                password, 
                role
            }
            const salt = bcrypt.genSaltSync(10);
            newUser.password = bcrypt.hashSync(password, salt);
            const user = new User(newUser) as IUser | null;
            await user?.save();
            return user;
    
        }catch(error:any){
            return {status: 500, data:error.message}
        }
    }

    const userRepository = {getUser, createUser};
    instance = userRepository;
    return instance;
}

export default UserRepository;



