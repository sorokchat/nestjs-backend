import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UNAUTHORIZED } from './authorization.messages';
import { Request } from 'express';

class AuthenticatedGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request['user']) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}

export const Authenticated = () => UseGuards(AuthenticatedGuard);
