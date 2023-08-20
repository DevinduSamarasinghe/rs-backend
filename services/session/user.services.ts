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
    const { data }: { data: IUser | any } = await getUser(email);
    const isMatch = bcrypt.compareSync(password, data.password);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
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
  
    const accessToken = signJWT(session, "5s");
    const refreshToken = signJWT(refreshPayload, "7d");
  
    const sessionPass: SessionPass = {
      accessToken,
      refreshToken,
      session,
    };
  
    return sessionPass;
  };

  const signUpHandler = async (body: CreateUserDTO): Promise<CreateUserResponseDTO | any> => {
    try {
      const { data }:{data: IUser} = await getUser(body.email);
      if (data) {
        return { data: "User Already Exists", status: 400 };
      } else {
        const { data, status } = await createUser(body);
        return { data, status };
      }
    } catch (error: any) {
      return { data: error.message, status: 500 };
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

