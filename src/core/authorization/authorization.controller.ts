import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Get,
} from '@nestjs/common';
import { type Response } from 'express';
import { AuthorizationService } from './authorization.service';
import { LoginDto, NewUserDto } from 'src/libs/contracts';
import {
  type AuthorizedPayload,
  type GetUserPayload,
} from '@sorokchat/contracts';
import { AUTHORIZATION_API } from './authorization.api';
import { User } from './user.decorator';
import { UserModel } from '../users/user.model';

@Controller(AUTHORIZATION_API.AUTHORIZATION)
export class AuthorizationController {
  constructor(private readonly service: AuthorizationService) {}

  @Post(AUTHORIZATION_API.REGISTER)
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() payload: NewUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    return await this.service.register(payload, response);
  }

  @Post(AUTHORIZATION_API.LOGIN)
  @HttpCode(HttpStatus.CREATED)
  public async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    return await this.service.login(payload, response);
  }

  @Get(AUTHORIZATION_API.PROFILE)
  @HttpCode(HttpStatus.OK)
  public profile(@User() user: UserModel): GetUserPayload {
    return user;
  }

  @Delete(AUTHORIZATION_API.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) response: Response): void {
    this.service.logout(response);
  }
}
