import { Injectable } from '@nestjs/common';
import { MemberModel } from './member.model';
import { MemberEntity } from './member.entity';
import { UserEntity } from '../users/user.entity';
import { ChatEntity } from './chat.entity';
import { UserMapper } from '../users/user.mapper';
import { type GetMemberPayload } from '@sorokchat/contracts';

@Injectable()
export class MembersMapper {
  constructor(private readonly userMapper: UserMapper) {}

  public toEntity(model: MemberModel): MemberEntity {
    const chat = new ChatEntity();
    const user = new UserEntity();
    chat.id = model.chatId;
    user.id = model.user.id!;
    return {
      id: model.id!,
      user,
      chat,
      role: model.role,
    };
  }

  public toModel(entity: MemberEntity): MemberModel {
    return new MemberModel(
      entity.id,
      entity.chat.id,
      this.userMapper.toModel(entity.user),
      entity.role,
    );
  }

  public toGet(model: MemberModel): GetMemberPayload {
    return {
      userId: model.user.id!,
      login: model.user.login,
      displayName: model.user.displayName,
      role: model.role,
    };
  }
}
