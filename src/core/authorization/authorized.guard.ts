import {
  type ExecutionContext,
  type CanActivate,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UNAUTHORIZED } from '@sorokchat/contracts';
import { type Request, type Response } from 'express';

class AuthorizedGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    if (!request['user']) {
      response.header('WWW-Authenticate', 'Bearer');
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}

export const Authorized = () => UseGuards(AuthorizedGuard);
