import {
  HttpException,
  HttpStatus,
  UseGuards,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { UNAUTHORIZED } from '@sorokchat/contracts';
import { type Request } from 'express';

class AnonymousGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (request['user']) {
      throw new HttpException(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}

export const Anonymous = () => UseGuards(AnonymousGuard);
