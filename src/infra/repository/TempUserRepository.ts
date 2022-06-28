import { Email } from '../../domain/user/Email';
import { ITempUserRepository } from '../../domain/tempUser/ITempUserRepository';
import { TempUser } from '../../domain/tempUser/TempUser';
import { TempUserModel } from '../db/TempUserModel';
import { UrlToken } from '../../domain/tempUser/UrlToken';

export class TempUserRepository implements ITempUserRepository {
  insert = async (tempUser: TempUser) => {
    await TempUserModel.create({
      hashed_email: tempUser.email.hashedValue,
      encrypted_email: tempUser.email.encryptedValue,
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
      { where: { hashed_email: tempUser.email.hashedValue } }
    );
  };

  findByEmail = async (email: Email) => {
    const tempUserData = await TempUserModel.findByPk(email.hashedValue);

    if (!tempUserData) {
      return null;
    }

    const tempUser = TempUser.reconstruct({
      emailHashedValue: tempUserData.hashed_email,
      emailEncryptedValue: tempUserData.encrypted_email,
      urlTokenValue: tempUserData.url_token,
      expiredAtValue: tempUserData.expired_at,
      repeatedTimesValue: tempUserData.repeated_times,
    });

    return tempUser;
  };

  findByUrlToken = async (urlToken: UrlToken) => {
    const tempUserData = await TempUserModel.findOne({ where: { url_token: urlToken.value } });

    if (!tempUserData) {
      return null;
    }

    const tempUser = TempUser.reconstruct({
      emailHashedValue: tempUserData.hashed_email,
      emailEncryptedValue: tempUserData.encrypted_email,
      urlTokenValue: tempUserData.url_token,
      expiredAtValue: tempUserData.expired_at,
      repeatedTimesValue: tempUserData.repeated_times,
    });

    return tempUser;
  };

  delete = async (tempUser: TempUser) => {
    TempUserModel.destroy({where: { hashed_email: tempUser.email.hashedValue }});
  }
}
