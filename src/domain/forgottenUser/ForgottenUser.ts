import { UrlToken } from '../tempUser/UrlToken';
import { User } from '../user/User';
import { UserId } from '../user/UserId';
import { Email } from '../user/Email';
import { RepeatedTimes } from '../shared/RepeatedTimes';
import { ExpiredAt } from '../shared/ExpiredAt';

// パスワード変更中のユーザー
export class ForgottenUser {
  private constructor(
    public readonly urlToken: UrlToken,
    public readonly userId: UserId,
    public readonly email: Email,
    public repeatedTimes: RepeatedTimes,
    public expiredAt: ExpiredAt
  ) {}

  static readonly create = (user: User) => {
    const urlToken = UrlToken.create();
    const repeatedTimes = RepeatedTimes.create();
    const expiredAt = ExpiredAt.create();
    return new ForgottenUser(urlToken, user.id, user.email, repeatedTimes, expiredAt);
  };

  static readonly reconstruct = (argsObj: {
    urlTokenValue: string;
    userIdValue: string;
    emailHashedValue: string;
    emailEncryptedValue: string;
    repeatedTimesValue: number;
    expiredAtValue: string;
  }) => {
    const urlToken = UrlToken.reconstruct(argsObj.urlTokenValue);
    const userId = UserId.reconstruct(argsObj.userIdValue);
    const email = Email.reconstruct(argsObj.emailHashedValue, argsObj.emailEncryptedValue)
    const repeatedTimes = RepeatedTimes.reconstruct(argsObj.repeatedTimesValue);
    const expiredAt = ExpiredAt.reconstruct(argsObj.expiredAtValue);
    return new ForgottenUser(urlToken, userId, email, repeatedTimes, expiredAt);
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
