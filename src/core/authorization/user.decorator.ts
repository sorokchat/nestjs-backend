import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../users/user.model';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: keyof UserModel | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as UserModel;
    return data ? user[data] : user;
  },
);
