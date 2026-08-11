import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsMapper } from './chats.mapper';
import { NewChatDto, UpdateChatDto } from 'src/libs/contracts';
import { ChatModel } from './chat.model';
import { UserModel } from '../users/user.model';
import { ChatRole } from './chat-role';
import { ACCESS_DENIED, CHAT_NOT_FOUND } from '@sorokchat/contracts';

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

  public async myChats(userId: number): Promise<ChatModel[]> {
    const chats = await this.repository.find({
      where: { members: { user: { id: userId } } },
      relations: { members: { chat: true, user: true } },
    });
    return chats
      .map((chat) => this.mapper.toModel(chat))
      .filter((chat) => chat.hasMember(userId));
  }

  public async update(
    chatId: number,
    userId: number,
    payload: UpdateChatDto,
  ): Promise<void> {
    const foundChat = await this.repository.findOne({
      where: { id: chatId, members: { user: { id: userId } } },
      relations: { members: { user: true, chat: true } },
    });
    if (!foundChat)
      throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    const chat = this.mapper.toModel(foundChat);
    if (!chat.hasAdmin(userId))
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    if (payload.name) chat.name = payload.name;
    if (payload.description) chat.description = payload.description;
    await this.repository.save(this.mapper.toEntity(chat));
  }
}
