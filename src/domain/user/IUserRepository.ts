import { Email } from './Email';
import { User } from './User';

export interface IUserRepository {
  insert: (user: User) => Promise<void>;
  updatePassword: (user: User) => Promise<void>;
  findByEmail: (email: Email) => Promise<User | null>;
}
