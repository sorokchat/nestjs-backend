export const ChatRole = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
} as const;

export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];
