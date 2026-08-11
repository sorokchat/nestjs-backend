import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import {
  CHATS_CONTROLLER,
  CHATS_ROUTES,
  GetChatPayload,
} from '@sorokchat/contracts';
import { NewChatDto } from 'src/libs/contracts';
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
}
