import { ForgottenUser } from './ForgottenUser';
import { Email } from '../user/Email';
import { UrlToken } from '../tempUser/UrlToken';

// パスワード変更中のユーザーのリポジトリ
export interface IForgottenUserRepository {
  insert: (tempUser: ForgottenUser) => Promise<void>;
  update: (tempUser: ForgottenUser) => Promise<void>;
  findByEmail: (email: Email) => Promise<ForgottenUser | null>;
  findByUrlToken: (urlToken: UrlToken) => Promise<ForgottenUser | null>;
  delete: (tempUser: ForgottenUser) => Promise<void>;
}