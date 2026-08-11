import { Role } from 'src/core/users/role';
import { RoleHirerarchy } from './role.hierarchy';

export const userRolesHirerarchy = new RoleHirerarchy(
  new Map([
    [Role.USER, []],
    [Role.ADMIN, [Role.USER]],
  ]),
);
