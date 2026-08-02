import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [TypeOrmModule.forFeature([ChatEntity])],
})
export class ChatsModule { }
