import { Email } from '../user/Email';
import { UrlToken } from '../shared/UrlToken';
import { ExpiredAt } from '../shared/ExpiredAt';
import { RepeatedTimes } from '../shared/RepeatedTimes';

// 仮登録ユーザー
export class TempUser {
  private constructor(
    public readonly email: Email,
    public readonly urlToken: UrlToken,
    public expiredAt: ExpiredAt,
    public repeatedTimes: RepeatedTimes
  ) {}

  static readonly create = (email: Email) => {
    const urlToken = UrlToken.create();
    const expiredAt = ExpiredAt.create();
    const repeatedTimes = RepeatedTimes.create();
    return new TempUser(email, urlToken, expiredAt, repeatedTimes);
  };

  static readonly reconstruct = (argsObj: {
    emailHashedValue: string;
    emailEncryptedValue: string;
    urlTokenValue: string;
    expiredAtValue: string;
    repeatedTimesValue: number;
  }) => {
    const email = Email.reconstruct(argsObj.emailHashedValue, argsObj.emailEncryptedValue);
    const url_token = UrlToken.reconstruct(argsObj.urlTokenValue);
    const expiredAt = ExpiredAt.reconstruct(argsObj.expiredAtValue);
    const repeatedTimes = RepeatedTimes.reconstruct(argsObj.repeatedTimesValue);
    return new TempUser(email, url_token, expiredAt, repeatedTimes);
  };

  readonly extendDeadLine = () => {
    this.expiredAt = this.expiredAt.extend();
  };

  readonly repeatReceivingMail = () => {
    this.repeatedTimes = this.repeatedTimes.increment();
  };

  readonly canRepeatReceivingMail = () => !this.repeatedTimes.isMax();

  readonly isExpired = () => this.expiredAt.isPast();
}
