import { IUser } from "../dto/schema/Schemas";
import { CreateUserDTO } from "../dto/request/user.dto";
import UserRepository, {UserRespositoryInstance} from "../repository/users/user.repository";
import SessionRepository, {SessionRepositoryInstance} from "../repository/users/jwt.repository";
import { FormattedRequest } from "../dto/request/Request";
import { signJWT } from "../config/jwt.config";
import { CreateUserResponseDTO, FetchUserDTO, SearchUserResponseDTO, SessionPass } from "../dto/response/user.dto";
import bcrypt from "bcrypt";
import User from "../models/user.model";

export interface UserServicesInstance {
  createSessionHandler: (email: string, password: string) => Promise<SessionPass>;
  signUpHandler: (body: CreateUserDTO) => Promise<CreateUserResponseDTO | any>;
  getUsersHandler: (req: FormattedRequest) => Promise<SearchUserResponseDTO['data'] | undefined>;
}

let instance: UserServicesInstance | null = null;

function UserServices(){

  if(instance){
    return instance;
  }

  const userRepository:UserRespositoryInstance = UserRepository();
  const sessionRepository:SessionRepositoryInstance = SessionRepository();

  const createSessionHandler = async (email: string, password: string) => {
   
    const data:FetchUserDTO | null= await userRepository.getUser(email);
    if(data){
      const isMatch = bcrypt.compareSync(password, data?.password as string);
       if (!isMatch) {
        throw new Error("Invalid Credentials");
      }
    }
    const session = sessionRepository.createSession(
      data!._id,
      data!.firstName,
      data!.lastName,
      data!.email,
      data!.role
    );
  
    const refreshPayload = {
      sessionId: session.sessionId,
    };
  
    const accessToken = signJWT(session, "10s");
    const refreshToken = signJWT(refreshPayload, "7d");
  
    const sessionPass: SessionPass = {
      accessToken,
      refreshToken,
      session,
    };
  
    return sessionPass;
  };

  const signUpHandler = async (body: CreateUserDTO): Promise<CreateUserResponseDTO | any> => {

      if(!body.firstName || !body.lastName || !body.email || !body.password || !body.role){
        throw new Error("All fields have not been filled");
      }
      
      const data:FetchUserDTO | null = await userRepository.getUser(body.email);
      if (data) {
        throw new Error("User already exists");
      } else {
        const data:CreateUserResponseDTO = await userRepository.createUser(body);
        return data;
      }
  };

  const getUsersHandler = async (req: FormattedRequest):Promise<SearchUserResponseDTO['data'] | undefined> => {
    const keyword = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    if (req.user) {
      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
      return users;
    }
  };

  const userServices =  {createSessionHandler, signUpHandler, getUsersHandler};
  instance = userServices;
  return userServices;
}

export default UserServices;

