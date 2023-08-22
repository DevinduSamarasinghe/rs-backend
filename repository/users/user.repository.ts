import User from "../../models/user.model";
import bcrypt from "bcrypt";
import { IUser } from "../../dto/schema/Schemas";
import { CreateUserDTO } from "../../dto/request/user.dto";
import dotenv from "dotenv";
dotenv.config({path: "../../.env"});

function usersRepository(){
    const getUser = async(email: string)=>{
        try{
            const user = await User.findOne({email});
            if(user){
                return user;
            }else{
                return null;
            }
        }catch(error:any){
            throw new Error("Error in Repository: " + error.message);
        }
    }

    const createUser = async(body:CreateUserDTO):Promise<IUser | any>=>{
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

    return {getUser, createUser};
}

export default usersRepository;



