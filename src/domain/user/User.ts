import { Email } from './Email';
import { Password } from './Password';
import { UserId } from './UserId';
import { UserName } from './UserName';
import { TempUser } from '../tempUser/TempUser';

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly name: UserName,
    public readonly email: Email,
    public readonly password: Password
  ) {}

  static readonly create = (userNameValue: string, tempUser: TempUser, passwordValue: string) => {
    const id = UserId.create();
    const name = UserName.create(userNameValue);
    const { email } = tempUser;
    const password = Password.create(passwordValue);
    return new User(id, name, email, password);
  };

  static readonly reconstruct = (argsObj: {
    userIdValue: string;
    userNameValue: string;
    encryptedEmailValue: string;
    hashedPasswordValue: string;
  }) => {
    const id = UserId.reconstruct(argsObj.userIdValue);
    const name = UserName.reconstruct(argsObj.userNameValue);
    const email = Email.reconstruct(argsObj.encryptedEmailValue);
    const password = Password.reconstruct(argsObj.hashedPasswordValue);
    return new User(id, name, email, password);
  };
}
