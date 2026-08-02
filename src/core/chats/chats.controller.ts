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
  Put,
  Delete,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CHATS_ONTROLLER, CHATS_ROUTES } from './chats.api';
import { NewChatDto, UpdateChatDto } from 'src/libs/contracts';
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

  @Authenticated()
  @Put(CHATS_ROUTES.UPDATE)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateChatDto,
  ): Promise<GetChatPayload> {
    return await this.service.update(id, payload);
  }

  @Authenticated()
  @Delete(CHATS_ROUTES.DELETE)
  @HttpCode(HttpStatus.NOT_FOUND)
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.service.delete(id);
  }
}
