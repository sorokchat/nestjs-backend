import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import {
  AUTHORIZATION_CONTROLLER,
  AUTHORIZATION_ROUTES,
  type GetUserPayload,
  type AuthorizedPayload,
} from '@sorokchat/contracts';
import { LoginDto, RegisterDto } from 'src/libs/contracts';
import { type Request, type Response } from 'express';
import { Authorized } from './authorized.guard';
import { CurrentUser } from './current-user.decorator';
import { UserModel } from '../users/user.model';
import { UserMapper } from '../users/user.mapper';
import { Anonymous } from './anonymous.guard';

@Controller(AUTHORIZATION_CONTROLLER)
export class AuthorizationController {
  constructor(
    private readonly service: AuthorizationService,
    private readonly mapper: UserMapper,
  ) {}

  @Post(AUTHORIZATION_ROUTES.REGISTER)
  @Anonymous()
  public async register(
    @Body() payload: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    const location = `${AUTHORIZATION_CONTROLLER}${AUTHORIZATION_ROUTES.PROFILE}`;
    response.status(HttpStatus.CREATED).location(location);
    return await this.service.register(payload, response);
  }

  @Post(AUTHORIZATION_ROUTES.LOGIN)
  @HttpCode(HttpStatus.CREATED)
  @Anonymous()
  public async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    return await this.service.login(payload, response);
  }

  @Get(AUTHORIZATION_ROUTES.PROFILE)
  @Authorized()
  public profile(@CurrentUser() user: UserModel): GetUserPayload {
    return this.mapper.toGet(user);
  }

  @Put(AUTHORIZATION_ROUTES.REFRESH_TOKENS)
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthorizedPayload> {
    return await this.service.refreshTokens(request, response);
  }

  @Delete(AUTHORIZATION_ROUTES.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  public logout(@Res({ passthrough: true }) response: Response): void {
    return this.service.logout(response);
  }
}
