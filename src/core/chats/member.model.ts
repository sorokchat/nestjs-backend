import { UserModel } from '../users/user.model';
import { ChatRole } from './chat-role';

export class MemberModel {
  constructor(
    public id: number | null,
    public chatId: number,
    public user: UserModel,
    public role: ChatRole,
  ) {}
}
