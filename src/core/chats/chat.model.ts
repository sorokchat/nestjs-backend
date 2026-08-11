import { UserModel } from '../users/user.model';
import { ChatRole } from './chat-role';
import { MemberModel } from './member.model';

export class ChatModel {
  constructor(
    public id: number | null,
    public name: string,
    public description: string | null,
    public members: MemberModel[],
  ) { }

  public hasMember(userId: number): boolean {
    return this.members.some(
      (member) => member.user.id === userId && member.isMember(),
    );
  }

  public hasAdmin(userId: number): boolean {
    return this.members.some(
      (member) => member.user.id === userId && member.isAdmin(),
    );
  }

  public addMember(user: UserModel): void {
    this.members.push({
      chatId: this.id!,
      role: ChatRole.MEMBER,
      user,
    } as MemberModel);
  }

  public removeMember(userId: number): void {
    this.members = this.members.filter((member) => member.user.id !== userId);
  }
}
