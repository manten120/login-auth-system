import { ForgottenUserModel } from '../db/ForgottenUserModel';
import { IForgottenUserRepository } from '../../domain/forgottenUser/IForgottenUserRepository';
import { ForgottenUser } from '../../domain/forgottenUser/ForgottenUser';
import { Email } from '../../domain/user/Email';
import { UrlToken } from '../../domain/shared/UrlToken';

export class ForgottenUserRepository implements IForgottenUserRepository {
  insert = async (forgottenUser: ForgottenUser) => {
    await ForgottenUserModel.create({
      user_id: forgottenUser.userId.value,
      hashed_email: forgottenUser.email.hashedValue,
      encrypted_email: forgottenUser.email.encryptedValue,
      url_token: forgottenUser.urlToken.value,
      repeated_times: forgottenUser.repeatedTimes.value,
      expired_at: forgottenUser.expiredAt.value,
    });
  };

  update = async (forgottenUser: ForgottenUser) => {
    await ForgottenUserModel.update(
      {
        repeated_times: forgottenUser.repeatedTimes.value,
        expired_at: forgottenUser.expiredAt.value,
      },
      { where: { hashed_email: forgottenUser.email.hashedValue } }
    );
  };

  findByEmail = async (email: Email) => {
    const forgottenUserData = await ForgottenUserModel.findOne({ where: { hashed_email: email.hashedValue } });

    if (!forgottenUserData) {
      return null;
    }

    const forgottenUser = ForgottenUser.reconstruct({
      userIdValue: forgottenUserData.user_id,
      emailHashedValue: forgottenUserData.hashed_email,
      emailEncryptedValue: forgottenUserData.encrypted_email,
      urlTokenValue: forgottenUserData.url_token,
      repeatedTimesValue: forgottenUserData.repeated_times,
      expiredAtValue: forgottenUserData.expired_at,
    });

    return forgottenUser;
  };

  findByUrlToken = async (urlToken: UrlToken) => {
    const forgottenUserData = await ForgottenUserModel.findOne({ where: { url_token: urlToken.value } });

    if (!forgottenUserData) {
      return null;
    }

    const forgottenUser = ForgottenUser.reconstruct({
      userIdValue: forgottenUserData.user_id,
      emailHashedValue: forgottenUserData.hashed_email,
      emailEncryptedValue: forgottenUserData.encrypted_email,
      urlTokenValue: forgottenUserData.url_token,
      expiredAtValue: forgottenUserData.expired_at,
      repeatedTimesValue: forgottenUserData.repeated_times,
    });

    return forgottenUser;
  };

  delete = async (forgottenUser: ForgottenUser) => {
    ForgottenUserModel.destroy({ where: { user_id: forgottenUser.userId.value } });
  };
}
