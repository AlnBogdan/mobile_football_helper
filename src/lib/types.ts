
export type UserRole = 'admin' | 'coach' | 'user';

export interface AppUser {
  id: string;
  email?: string;
  role: UserRole;
  username?: string;
}