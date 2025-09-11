import { User } from './user.interface';

export interface RequestWithUser {
  user: User;
  secure?: boolean;
  headers: { authorization?: string };
  get: (header: string) => string;
}

export interface RequestWithOptionalUser {
  user?: User;
  secure?: boolean;
  headers: { authorization?: string };
  get: (header: string) => string;
}
