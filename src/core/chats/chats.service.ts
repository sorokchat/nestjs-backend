import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsMapper } from './chats.mapper';
import { NewChatDto, UpdateChatDto } from 'src/libs/contracts';
import { ChatModel } from './chat.model';
import { UserModel } from '../users/user.model';
import { ChatRole } from './chat-role';
import {
  ACCESS_DENIED,
  CAN_NOT_REMOVE_LAST_ADMIN,
  CHAT_NOT_FOUND,
  MEMBER_EXISTS,
  USER_NOT_MEMBER,
} from '@sorokchat/contracts';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly repository: Repository<ChatEntity>,
    private readonly mapper: ChatsMapper,
    private readonly usersService: UsersService,
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

  public async delete(chatId: number, userId: number): Promise<void> {
    const foundChat = await this.repository.findOne({
      where: { id: chatId },
      relations: { members: { user: true, chat: true } },
    });
    if (!foundChat)
      throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    const chat = this.mapper.toModel(foundChat);
    if (!chat.hasAdmin(userId))
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    await this.repository.delete(chat.id!);
  }

  public async addMember(
    adminId: number,
    chatId: number,
    userId: number,
  ): Promise<void> {
    const foundChat = await this.repository.findOne({
      where: { id: chatId },
      relations: { members: { user: true, chat: true } },
    });
    if (!foundChat)
      throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    const chat = this.mapper.toModel(foundChat);
    if (adminId === userId || chat.hasMember(userId))
      throw new HttpException(MEMBER_EXISTS, HttpStatus.CONFLICT);
    if (!chat.hasAdmin(adminId))
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    const user = await this.usersService.getBy({ id: userId });
    chat.addMember(user);
    await this.repository.save(this.mapper.toEntity(chat));
  }

  public async removeMember(
    adminId: number,
    chatId: number,
    userId: number,
  ): Promise<void> {
    const found = await this.repository.findOne({
      where: { id: chatId },
      relations: { members: { user: true, chat: true } },
    });
    if (!found) throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    const chat = this.mapper.toModel(found);
    if (!chat.hasAdmin(adminId))
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    if (!chat.hasMember(userId))
      throw new HttpException(USER_NOT_MEMBER, HttpStatus.NOT_FOUND);
    const adminCount = chat.members.filter((member) => member.isAdmin()).length;
    if (chat.hasAdmin(userId) && adminCount <= 1)
      throw new HttpException(
        CAN_NOT_REMOVE_LAST_ADMIN,
        HttpStatus.BAD_REQUEST,
      );
    chat.removeMember(userId);
    await this.repository.save(this.mapper.toEntity(chat));
  }

  public async leave(chatId: number, userId: number): Promise<void> {
    const foundChat = await this.repository.findOne({
      where: { id: chatId },
      relations: { members: { user: true, chat: true } },
    });
    if (!foundChat)
      throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    const chat = this.mapper.toModel(foundChat);
    const adminCount = chat.members.filter((member) => member.isAdmin()).length;
    if (chat.hasAdmin(userId) && adminCount <= 1)
      throw new HttpException(
        CAN_NOT_REMOVE_LAST_ADMIN,
        HttpStatus.BAD_REQUEST,
      );
    chat.removeMember(userId);
    await this.repository.save(this.mapper.toEntity(chat));
  }

  public async grant(
    chatId: number,
    adminId: number,
    userId: number,
    role: ChatRole,
  ): Promise<void> {
    const foundChat = await this.repository.findOne({
      where: { id: chatId },
      relations: { members: { user: true, chat: true } },
    });
    if (!foundChat)
      throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    const chat = this.mapper.toModel(foundChat);
    if (!chat.hasAdmin(adminId))
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    const member = chat.members.find((item) => item.user.id === userId);
    if (!member)
      throw new HttpException(USER_NOT_MEMBER, HttpStatus.BAD_REQUEST);
    member.role = role;
    await this.repository.save(this.mapper.toEntity(chat));
  }
}
