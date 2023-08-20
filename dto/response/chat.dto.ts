import { FetchUserDTO } from "./user.dto";

export type AccessChatResponseDTO = {
  _id: string;
  chatName: string;
  users: [FetchUserDTO];
  createdAt: Date;
  updatedAt: Date;
  latestMessage: any;
};
