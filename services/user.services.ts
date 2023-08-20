import { createUser, getUser } from "../repository/user.repository";
import { IUser } from "../dto/schema/Schemas.js";
import { createSession } from "../repository/jwt.repository";
import { signJWT } from "../config/jwt.config";
import { SessionDTO } from "../dto/request/user.dto";
import { CreateUserDTO } from "../dto/request/user.dto";
import bcrypt from "bcrypt";

export type SessionPass = {
  accessToken: string;
  refreshToken: string;
  session: SessionDTO;
};

export const createSessionHandler = async (email: string, password: string) => {
  const {data,status}: any = await getUser(email);

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



export const signUpHandler = async (
  body: CreateUserDTO
): Promise<any> => {
  try {
    const {data, status} = await getUser(body.email);
    if (data) {
      return { data: 'User Already Exists', status: 400 };
    } else {
      const { data, status } = await createUser(body);
      return {data, status};
    }
  } catch (error: any) {
    return { data: error.message, status: 500 };
  }
};
