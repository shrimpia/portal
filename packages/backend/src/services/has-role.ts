import type { MisskeyUser } from '../types/user';

export const hasRole = (user: MisskeyUser, roleId: string): boolean => {
  return user.roles.some(role => role.id === roleId);
};
