import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { RegisterDto } from 'src/libs/contracts';
import { hash } from 'argon2';
import { Role } from './role';
import { DeepPartial } from '@nestjs/swagger';
import { USER_EXIST, USER_NOT_FOUND } from '@sorokchat/contracts';

@Injectable()
export class UsersService {
  constructor(
    private readonly mapper: UserMapper,
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public async create(payload: RegisterDto): Promise<UserModel> {
    if (await this.exists({ login: payload.login })) {
      throw new HttpException(USER_EXIST, HttpStatus.CONFLICT);
    }
    const created: UserEntity = this.repository.create({
      login: payload.login,
      password: await hash(payload.password),
      displayName: payload.displayName || payload.login,
      role: Role.USER,
    });
    const saved = await this.repository.save(created);
    return this.mapper.toModel(saved);
  }

  public async getBy(filter: DeepPartial<UserEntity>): Promise<UserModel> {
    const user = await this.repository.findOneBy(filter);
    if (!user) throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    return this.mapper.toModel(user);
  }

  public async exists(filter: DeepPartial<UserEntity>): Promise<boolean> {
    return await this.repository.existsBy(filter);
  }
}
