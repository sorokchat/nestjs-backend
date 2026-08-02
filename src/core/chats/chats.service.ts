import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { Repository } from 'typeorm';
import { NewChatDto, UpdateChatDto } from 'src/libs/contracts';
import { ChatModel } from './chat.model';
import { CHAT_NOT_FOUND } from './chat.messages';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly repository: Repository<ChatEntity>,
  ) { }

  public async create(payload: NewChatDto): Promise<ChatModel> {
    return await this.repository.save(this.repository.create(payload));
  }

  public async getById(id: number): Promise<ChatModel> {
    const chat = await this.repository.findOneBy({ id });
    if (!chat) throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    return chat;
  }

  public async update(id: number, payload: UpdateChatDto): Promise<ChatModel> {
    const exists = await this.repository.existsBy({ id });
    if (!exists) throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.repository.update(id, payload);
    return await this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const exists = await this.repository.existsBy({ id });
    if (!exists) throw new HttpException(CHAT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
