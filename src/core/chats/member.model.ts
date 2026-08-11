import { chatRoleHirerarchy } from 'src/utils';
import { UserModel } from '../users/user.model';
import { ChatRole } from './chat-role';

export class MemberModel {
  constructor(
    public id: number | null,
    public chatId: number,
    public user: UserModel,
    public role: ChatRole,
  ) {}

  public isAdmin(): boolean {
    return chatRoleHirerarchy.hasNeededRole(this.role, ChatRole.ADMIN);
  }

  public isMember(): boolean {
    return chatRoleHirerarchy.hasNeededRole(this.role, ChatRole.MEMBER);
  }
}
