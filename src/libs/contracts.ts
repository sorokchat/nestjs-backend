import { createZodDto } from 'nestjs-zod';
import {
  NewUserSchema,
  LoginSchema,
  NewChatSchema,
  UpdateChatSchema,
} from '@sorokchat/contracts';

export class RegisterDto extends createZodDto(NewUserSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
export class NewChatDto extends createZodDto(NewChatSchema) {}
export class UpdateChatDto extends createZodDto(UpdateChatSchema) {}
