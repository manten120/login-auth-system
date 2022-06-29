import { Email } from './Email';
import { Password } from './Password';
import { UserId } from './UserId';
import { UserName } from './UserName';

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly name: UserName,
    public readonly email: Email,
    public readonly password: Password
  ) {}

  static readonly create = (userName: UserName, tempUserEmail: Email, password: Password) => {
    const id = UserId.create();
    const email = Email.create(tempUserEmail.plainValue());
    return new User(id, userName, email, password);
  };

  static readonly reconstruct = (argsObj: {
    userIdValue: string;
    userNameValue: string;
    hashedEmailValue: string;
    encryptedEmailValue: string;
    hashedPasswordValue: string;
  }) => {
    const id = UserId.reconstruct(argsObj.userIdValue);
    const name = UserName.reconstruct(argsObj.userNameValue);
    const email = Email.reconstruct(argsObj.hashedEmailValue, argsObj.encryptedEmailValue);
    const password = Password.reconstruct(argsObj.hashedPasswordValue);
    return new User(id, name, email, password);
  };

  readonly canLogin = (email: Email, password: Password) => this.email.equals(email) && this.password.equals(password);
}
