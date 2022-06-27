import { Email } from '../user/Email';
import { TempUser } from './TempUser';

// 仮登録ユーザーのリポジトリ
export interface ITempUserRepository {
  insert: (tempUser: TempUser) => Promise<void>;
  update: (tempUser: TempUser) => Promise<void>;
  findByEmail: (email: Email) => Promise<TempUser | null>;
}
