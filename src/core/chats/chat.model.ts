import { MemberModel } from './member.model';

export class ChatModel {
  constructor(
    public id: number | null,
    public name: string,
    public description: string | null,
    public members: MemberModel[],
  ) {}

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
}
