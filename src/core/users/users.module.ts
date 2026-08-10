import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserMapper } from './user.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, UserMapper],
  exports: [UsersService, UserMapper],
})
export class UsersModule {}
