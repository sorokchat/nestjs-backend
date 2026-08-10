import { type Role } from './role';

export class UserModel {
  constructor(
    public id: number | null,
    public login: string,
    public password: string,
    public displayName: string,
    public role: Role,
  ) {}
}
