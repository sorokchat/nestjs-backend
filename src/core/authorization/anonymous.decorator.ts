import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AUTHORIZED } from './authorization.messages';

class AnonymousGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request['user']) {
      throw new HttpException(AUTHORIZED, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}

export const Anonymous = () => UseGuards(AnonymousGuard);
