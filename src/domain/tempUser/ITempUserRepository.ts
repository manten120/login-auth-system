import { Email } from '../user/Email';
import { TempUser } from './TempUser';
import { UrlToken } from '../tempUser/UrlToken';

// 仮登録ユーザーのリポジトリ
export interface ITempUserRepository {
  insert: (tempUser: TempUser) => Promise<void>;
  update: (tempUser: TempUser) => Promise<void>;
  findByEmail: (email: Email) => Promise<TempUser | null>;
  findByToken: (token: UrlToken) => Promise<TempUser | null>;
}
