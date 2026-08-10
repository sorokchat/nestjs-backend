import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserModel } from './user.model';
import { type GetUserPayload } from '@sorokchat/contracts';

@Injectable()
export class UserMapper {
  public toEntity(model: UserModel): UserEntity {
    return new UserEntity(
      model.id,
      model.login,
      model.password,
      model.displayName,
      model.role,
    );
  }

  public toModel(entity: UserEntity): UserModel {
    return new UserModel(
      entity.id || null,
      entity.login,
      entity.password,
      entity.displayName,
      entity.role,
    );
  }

  public toGet(model: UserModel): GetUserPayload {
    return {
      id: model.id ?? 0,
      login: model.login,
      displayName: model.displayName,
      role: model.role,
    };
  }
}
