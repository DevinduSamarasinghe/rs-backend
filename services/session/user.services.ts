import { IUser } from "../../dto/schema/Schemas.js";
import { CreateUserDTO } from "../../dto/request/user.dto";
import { createSession, createUser,getUser } from "../../repository/users";
import { FormattedRequest } from "../../dto/request/Request";
import { signJWT } from "../../config/jwt.config";
import { CreateUserResponseDTO, SearchUserResponseDTO, SessionPass } from "../../dto/response/user.dto";
import bcrypt from "bcrypt";
import User from "../../models/user.model";

function userServices(){
  const createSessionHandler = async (email: string, password: string) => {
    const data:IUser | null= await getUser(email);
    if(data){
      const isMatch = bcrypt.compareSync(password, data!.password);
       if (!isMatch) {
        throw new Error("Invalid Credentials");
      }
    }
    const session = createSession(
      data!._id,
      data!.firstName,
      data!.lastName,
      data!.email,
      data!.role
    );
  
    const refreshPayload = {
      sessionId: session.sessionId,
    };
  
    const accessToken = signJWT(session, "30m");
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
      
      const data:IUser | null = await getUser(body.email);
      if (data) {
        throw new Error("User already exists");
      } else {
        const data:CreateUserResponseDTO = await createUser(body);
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

  return {createSessionHandler, signUpHandler, getUsersHandler};
}

export default userServices;

