import { Injectable } from '@nestjs/common';
import { ChatEntity } from './chat.entity';
import { ChatModel } from './chat.model';
import { MembersMapper } from './members.mapper';
import { GetChatPayload } from '@sorokchat/contracts';

@Injectable()
export class ChatsMapper {
  constructor(private readonly membersMapper: MembersMapper) {}

  public toEntity(model: ChatModel): ChatEntity {
    return {
      id: model.id!,
      name: model.name,
      description: model.description ?? undefined,
      members: model.members.map((member) =>
        this.membersMapper.toEntity(member),
      ),
    };
  }

  public toModel(entity: ChatEntity): ChatModel {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description || null,
      members: entity.members.map((member) =>
        this.membersMapper.toModel(member),
      ),
    };
  }

  public toGet(model: ChatModel): GetChatPayload {
    return {
      id: model.id!,
      name: model.name,
      description: model.description ?? undefined,
      members: model.members.map((member) => this.membersMapper.toGet(member)),
    };
  }
}
