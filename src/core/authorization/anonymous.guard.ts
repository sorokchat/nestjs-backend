import {
  HttpException,
  HttpStatus,
  UseGuards,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { ACCESS_DENIED } from '@sorokchat/contracts';
import { Request } from 'express';

class AnonymousGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (request['user']) {
      throw new HttpException(ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}

export const Anonymous = () => UseGuards(AnonymousGuard);
