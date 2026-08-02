import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Res,
  Param,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CHATS_ONTROLLER, CHATS_ROUTES } from './chats.api';
import { NewChatDto } from 'src/libs/contracts';
import { type Response } from 'express';
import { GetChatPayload } from '@sorokchat/contracts';
import { Authenticated } from '../authorization/authenticated.decorator';

@Controller(CHATS_ONTROLLER)
export class ChatsController {
  constructor(private readonly service: ChatsService) { }

  @Authenticated()
  @Post(CHATS_ROUTES.NEW_CHAT)
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() payload: NewChatDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GetChatPayload> {
    const chat = await this.service.create(payload);
    response.setHeaders(
      new Map<string, string>([
        ['Location', `${CHATS_ONTROLLER}/by-id/${chat.id}`],
      ]),
    );
    return chat;
  }

  @Authenticated()
  @Get(CHATS_ROUTES.GET_BY_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetChatPayload> {
    return await this.service.getById(id);
  }
}
