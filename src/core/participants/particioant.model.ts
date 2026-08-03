import { ChatRole } from '../authorization/chat-role.enum';
import { ChatModel } from '../chats/chat.model';
import { UserModel } from '../users/user.model';

export class ParticipantModel {
  public id!: number;
  public user!: UserModel;
  public chat!: ChatModel;
  public role!: ChatRole;
}
