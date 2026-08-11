import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsMapper } from './chats.mapper';
import { NewChatDto } from 'src/libs/contracts';
import { ChatModel } from './chat.model';
import { UserModel } from '../users/user.model';
import { ChatRole } from './chat-role';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly repository: Repository<ChatEntity>,
    private readonly mapper: ChatsMapper,
  ) {}

  public async create(
    admin: UserModel,
    payload: NewChatDto,
  ): Promise<ChatModel> {
    const created: ChatEntity = this.repository.create({
      name: payload.name,
      description: payload.description,
      members: [{ user: { id: admin.id! }, role: ChatRole.ADMIN }],
    });
    const saved = await this.repository.save(created);
    const chatWithMembers = await this.repository.findOne({
      where: { id: saved.id },
      relations: {
        members: {
          chat: true,
          user: true,
        },
      },
    });
    return this.mapper.toModel(chatWithMembers!);
  }
}
