import { Email } from '../user/Email';
import { UrlToken } from './UrlToken';
import { ExpiredAt } from './ExpiredAt';

// 仮登録ユーザー
export class TempUser {
  private constructor(
    public readonly email: Email,
    public readonly urlToken: UrlToken,
    public readonly expiredAt: ExpiredAt
  ) {}

  static readonly create = (email: Email) => {
    const urlToken = UrlToken.create();
    const expiredAt = ExpiredAt.create();
    return new TempUser(email, urlToken, expiredAt);
  };

  static readonly reconstruct = (argsObj: {
    emailEncryptedValue: string;
    urlTokenValue: string;
    expiredAtValue: string;
  }) => {
    const email = Email.reconstruct(argsObj.emailEncryptedValue);
    const url_token = UrlToken.reconstruct(argsObj.urlTokenValue);
    const expiredAt = ExpiredAt.reconstruct(argsObj.expiredAtValue);
    return new TempUser(email, url_token, expiredAt);
  };
}
