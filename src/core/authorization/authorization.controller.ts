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
import {
  AUTHORIZATION_CONTROLLER,
  AUTHORIZATION_ROUTES,
} from './authorization.api';
import { CurrentUser } from '../users/current-user.decorator';
import { UserModel } from '../users/user.model';
import { Anonymous } from './anonymous.decorator';
import { Authenticated } from './authenticated.decorator';

@Controller(AUTHORIZATION_CONTROLLER)
export class AuthorizationController {
  constructor(private readonly service: AuthorizationService) { }

  @Post(AUTHORIZATION_ROUTES.REGISTER)
  @Anonymous()
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() payload: NewUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    return await this.service.register(payload, response);
  }

  @Post(AUTHORIZATION_ROUTES.LOGIN)
  @Anonymous()
  @HttpCode(HttpStatus.CREATED)
  public async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    return await this.service.login(payload, response);
  }

  @Get(AUTHORIZATION_ROUTES.PROFILE)
  @Authenticated()
  @HttpCode(HttpStatus.OK)
  public profile(@CurrentUser() user: UserModel): GetUserPayload {
    return user;
  }

  @Delete(AUTHORIZATION_ROUTES.LOGOUT)
  @Authenticated()
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) response: Response): void {
    this.service.logout(response);
  }
}
