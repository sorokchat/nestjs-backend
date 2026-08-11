import { ChatRole } from 'src/core/chats/chat-role';
import { RoleHirerarchy } from './role.hierarchy';

export const chatRoleHirerarchy = new RoleHirerarchy(
  new Map([
    [ChatRole.MEMBER, []],
    [ChatRole.ADMIN, [ChatRole.MEMBER]],
  ]),
);
