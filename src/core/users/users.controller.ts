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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './user.model';
import { NewUserDto, UpdateUserDto } from 'src/libs/contracts';
import { USERS_API } from './user.api';
import { ApiTags } from '@nestjs/swagger';

@Controller(USERS_API.USERS)
@ApiTags('Користувачі')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() payload: NewUserDto): Promise<UserModel> {
    return await this.service.create(payload);
  }

  @Get(USERS_API.BY_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserModel> {
    return await this.service.getById(id);
  }

  @Get(USERS_API.BY_LOGIN)
  @HttpCode(HttpStatus.OK)
  public async getByLogin(@Param('login') login: string): Promise<UserModel> {
    return await this.service.getByLogin(login);
  }

  @Put(USERS_API.BY_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.service.update(id, payload);
  }

  @Delete(USERS_API.BY_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    return await this.service.delete(id);
  }
}
