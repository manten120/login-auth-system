import { Email } from '../../domain/user/Email';
import { ITempUserRepository } from '../../domain/tempUser/ITempUserRepository';
import { TempUser } from '../../domain/tempUser/TempUser';
import { TempUserModel } from '../db/TempUserModel';

export class TempUserRepository implements ITempUserRepository {
  save = async (tempUser: TempUser) => {
    await TempUserModel.create({
      email: tempUser.email.encryptedValue,
      url_token: tempUser.urlToken.value,
      expired_at: tempUser.expiredAt.value,
      repeated_times: tempUser.repeatedTimes.value,
    });
  };

  update = async (tempUser: TempUser) => {
    await TempUserModel.update(
      {
        expired_at: tempUser.expiredAt.value,
        repeated_times: tempUser.repeatedTimes.value,
      },
      { where: { email: tempUser.email.encryptedValue } }
    );
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
      repeatedTimesValue: tempUserData.repeated_times,
    });

    return tempUser;
  };
}
