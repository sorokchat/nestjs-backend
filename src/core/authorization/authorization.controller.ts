import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AuthorizationService } from './authorization.service';
import { LoginDto, NewUserDto } from 'src/libs/contracts';
import { AuthorizedPayload } from '@sorokchat/contracts';
import { AUTHORIZATION_API } from './authorization.api';
import { th } from 'zod/locales';

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

  @Delete(AUTHORIZATION_API.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) response: Response): void {
    this.service.logout(response);
  }
}
