import {
  LoginSchema,
  NewUserSchema,
  UpdateUserSchema,
} from '@sorokchat/contracts';
import { createZodDto } from 'nestjs-zod';

export class NewUserDto extends createZodDto(NewUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
