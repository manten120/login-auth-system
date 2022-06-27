import { Email } from "./Email";
import { User } from "./User";

export interface IUserRepository {
  save: (user: User) => Promise<void>;
  findByEmail: (email: Email) => Promise<User|null>;
}