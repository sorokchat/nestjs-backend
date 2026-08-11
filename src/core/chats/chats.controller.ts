import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import {
  CHATS_CONTROLLER,
  CHATS_ROUTES,
  GetChatPayload,
} from '@sorokchat/contracts';
import { NewChatDto, UpdateChatDto } from 'src/libs/contracts';
import { ChatsMapper } from './chats.mapper';
import { Authorized } from '../authorization/authorized.guard';
import { CurrentUser } from '../authorization/current-user.decorator';
import { UserModel } from '../users/user.model';
import { type Response } from 'express';

@Controller(CHATS_CONTROLLER)
export class ChatsController {
  constructor(
    private readonly service: ChatsService,
    private readonly mapper: ChatsMapper,
  ) {}

  @Authorized()
  @Post(CHATS_ROUTES.CREATE)
  public async create(
    @CurrentUser() user: UserModel,
    @Body() payload: NewChatDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GetChatPayload> {
    const chat = await this.service.create(user, payload);
    const location = `${CHATS_CONTROLLER}/by-id/${chat.id}`;
    response.status(HttpStatus.CREATED).location(location);
    return this.mapper.toGet(chat);
  }

  @Authorized()
  @HttpCode(HttpStatus.OK)
  @Get(CHATS_ROUTES.GET_MY)
  public async getMe(
    @CurrentUser('id') userId: number,
  ): Promise<GetChatPayload[]> {
    const chats = await this.service.myChats(userId);
    return chats.map((chat) => this.mapper.toGet(chat));
  }

  @Authorized()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(CHATS_ROUTES.UPDATE)
  public async update(
    @Param('id', ParseIntPipe) chatId: number,
    @CurrentUser('id') userId: number,
    @Body() payload: UpdateChatDto,
  ): Promise<void> {
    return await this.service.update(chatId, userId, payload);
  }

  @Authorized()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(CHATS_ROUTES.DELETE)
  public async delete(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) chatId: number,
  ): Promise<void> {
    return await this.service.delete(chatId, userId);
  }

  @Authorized()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(CHATS_ROUTES.ADD_MEMBER)
  public async addMember(
    @CurrentUser('id') adminId: number,
    @Param('id') chatId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    return await this.service.addMember(adminId, chatId, userId);
  }

  @Authorized()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(CHATS_ROUTES.REMOVE_MEMBER)
  public async removeMember(
    @CurrentUser('id') adminId: number,
    @Param('id', ParseIntPipe) chatId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this.service.removeMember(adminId, chatId, userId);
  }
}
