import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { ChatsMapper } from './chats.mapper';
import { MembersMapper } from './members.mapper';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity]), UsersModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsMapper, MembersMapper],
})
export class ChatsModule {}
