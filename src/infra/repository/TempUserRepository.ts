import { Email } from '../../domain/user/Email';
import { ITempUserRepository } from '../../domain/tempUser/ITempUserRepository';
import { TempUser } from '../../domain/tempUser/TempUser';
import { TempUserModel } from '../db/tempUserModel';

export class TempUserRepository implements ITempUserRepository {
  save = async (tempUser: TempUser) => {

    await TempUserModel.create({
      email: tempUser.email.encryptedValue,
      url_token: tempUser.urlToken.value,
      expired_at: tempUser.expiredAt.value,
    });
  };

  findByEmail = async (email: Email) => {
    const tempUserData = await TempUserModel.findByPk(email.encryptedValue);

    if (!tempUserData) {
      return null;
    }

    const tempUser = TempUser.reconstruct({
      emailEncryptedValue: tempUserData.email,
      urlTokenValue: tempUserData.url_token,
      expiredAtValue: tempUserData.expired_at,
    });

    return tempUser;
  };
}
