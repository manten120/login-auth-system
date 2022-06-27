import { Email } from '../user/Email';
import { TempUser } from './TempUser';

// 仮登録ユーザーのリポジトリ
export interface ITempUserRepository {
  save: (tempUser: TempUser) => Promise<void>;
  findByEmail: (email: Email) => Promise<TempUser | null>;
}
