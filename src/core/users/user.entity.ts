import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public login: string;

  @Column()
  public password: string;

  @Column()
  public displayName: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  public role: Role;

  public constructor(
    id: number | null,
    login: string,
    password: string,
    displayName: string,
    role: Role,
  ) {
    this.id = id ?? undefined;
    this.login = login;
    this.password = password;
    this.displayName = displayName;
    this.role = role;
  }

  public static create(data: Omit<UserEntity, 'id'>): UserEntity {
    return new UserEntity(
      null,
      data.login,
      data.password,
      data.displayName,
      data.role,
    );
  }
}
