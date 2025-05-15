export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  AUDITOR = 'AUDITOR',
}

export interface User {
  userId: string;
  email: string;
  role: UserRole;
} 