import { NewUserSchema, UpdateUserSchema } from '@sorokchat/contracts';
import { createZodDto } from 'nestjs-zod';

export class NewUserDto extends createZodDto(NewUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
