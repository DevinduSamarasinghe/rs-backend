import { SessionDTO } from "../dto/request/user.dto";

export interface SessionRepositoryInstance  {
  createSession: (id: string,firstName: string,lastName: string,email: string,role: string) => SessionDTO;
  getSession: (sessionId: string) => SessionDTO | null;
  invalidateSession: (sessionId: string) => void;
}

let instance: SessionRepositoryInstance | null = null;

function SessionRepository() {

  if(instance){
    return instance;
  }

  const sessions: Record<string, SessionDTO> = {};

  const createSession = (
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string
  ) => {
    const sessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const session = {
      sessionId,
      _id: id,
      firstName,
      lastName,
      email,
      role,
      valid: true,
    };

    sessions[sessionId] = session;
    return session;
  };

  const getSession = (sessionId: string) => {
    const session = sessions[sessionId];
    return session && session.valid ? session : null;
  };

  const invalidateSession = (sessionId: string) => {
    const session = sessions[sessionId];
    if (session) {
      sessions[sessionId].valid = false;
    }
  };

  const jwtRepository =  { createSession, getSession, invalidateSession}
  instance = jwtRepository;
  return jwtRepository;
}

export default SessionRepository;