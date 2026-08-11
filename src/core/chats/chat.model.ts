import { MemberModel } from './member.model';

export class ChatModel {
  constructor(
    public id: number | null,
    public name: string,
    public description: string | null,
    public members: MemberModel[],
  ) {}
}
