import { IUserRepository } from '../../domain/user/IUserRepository';
import { User } from '../../domain/user/User';
import { Email } from '../../domain/user/Email';
import { UserModel } from '../db/UserModel';

export class UserRepository implements IUserRepository {
  insert = async (user: User) => {
    await UserModel.create({
      id: user.id.value,
      name: user.name.value,
      hashed_email: user.email.hashedValue,
      encrypted_email: user.email.encryptedValue,
      password: user.password.hashedValue,
    });
  };

  updatePassword = async (user: User) => {
    await UserModel.update(
      {
        password: user.password.hashedValue,
      },
      { where: { id: user.id.value } }
    );
  };

  findByEmail = async (email: Email) => {
    const userData = await UserModel.findOne({ where: { hashed_email: email.hashedValue } });

    if (!userData) {
      return null;
    }

    const user = User.reconstruct({
      userIdValue: userData.id,
      userNameValue: userData.name,
      hashedEmailValue: userData.hashed_email,
      encryptedEmailValue: userData.encrypted_email,
      hashedPasswordValue: userData.password,
    });

    return user;
  };
}
