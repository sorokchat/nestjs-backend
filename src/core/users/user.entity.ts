import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public login!: string;

  @Column()
  public password!: string;

  @Column()
  public displayName!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  public role!: Role;

  public static create(data: Omit<UserEntity, 'id'>): UserEntity {
    return {
      id: undefined!,
      login: data.login,
      password: data.password,
      displayName: data.displayName,
      role: data.role,
    };
  }
}
