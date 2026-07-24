import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserModel } from './user.model';
import { NewUserPaylod } from './new-user.payload';
import {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
} from './users-messages.constants';
import { hash } from 'argon2';
import { UpdateUserPayload } from './update-user.payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public async create(payload: NewUserPaylod): Promise<UserModel> {
    if (await this.repository.existsBy({ login: payload.login })) {
      throw new HttpException(USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }
    payload.displayName ??= payload.login;
    payload.password = await hash(payload.password);
    const createdUser = this.repository.create(payload);
    return await this.repository.save(createdUser);
  }

  public async getById(id: number): Promise<UserModel> {
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    return user;
  }

  public async getByLogin(login: string): Promise<UserModel> {
    const user = await this.repository.findOneBy({ login });
    if (!user) throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    return user;
  }

  public async update(
    id: number,
    payload: UpdateUserPayload,
  ): Promise<UserModel> {
    const hasUser = await this.repository.existsBy({ id });
    if (!hasUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (payload.password) {
      payload.password = await hash(payload.password);
    }
    await this.repository.update(id, payload);
    return await this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const hasUser = await this.repository.existsBy({ id });
    if (!hasUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.repository.delete(id);
  }
}
