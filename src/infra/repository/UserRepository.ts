import { Email } from '../../domain/user/Email';
import { IUserRepository } from '../../domain/user/IUserRepository';
import { User } from '../../domain/user/User';
import { UserModel } from '../db/useModel';

export class UserRepository implements IUserRepository {
  insert = async (user: User) => {
    await UserModel.create({
      id: user.id.value,
      name: user.name.value,
      email: user.email.encryptedValue,
      password: user.password.hashedValue,
    });
  };

  findByEmail = async (email: Email) => {
    const userData = await UserModel.findByPk(email.encryptedValue);
    console.log({ userData });
    if (!userData) {
      return null;
    }

    const user = User.reconstruct({
      userIdValue: userData.id,
      userNameValue: userData.name,
      encryptedEmailValue: userData.email,
      hashedPasswordValue: userData.password,
    });

    return user;
  };
}
