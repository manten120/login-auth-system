import { UrlToken } from '../domain/tempUser/UrlToken';
import { IUserRepository } from '../domain/user/IUserRepository';
import { ForgottenUserRepository } from '../infra/repository/ForgottenUserRepository';

type Result = {
  ok: true;
} | {
  ok: false;
  reason: 'forgottenUserNotExist' | 'expired' | 'userNotExist';
}

export class ChangePasswordUseCase {
  constructor(
    private readonly forgottenUserRepository: ForgottenUserRepository,
    private readonly userRepository: IUserRepository
  ) {}

  readonly execute = async (argsObj: {
    urlTokenValue: string;
    passwordPlainValue1: string;
    passwordPlainValue2: string;
  }): Promise<Result> => {
    const urlToken = UrlToken.reconstruct(argsObj.urlTokenValue);
    const forgottenUser = await this.forgottenUserRepository.findByUrlToken(urlToken);

    if (!forgottenUser) {
      return { ok: false, reason: 'forgottenUserNotExist' };
    }

    if (forgottenUser.isExpired()) {
      this.forgottenUserRepository.delete(forgottenUser);
      return { ok: false, reason: 'expired' };
    }

    const user = await this.userRepository.findByEmail(forgottenUser.email);

    if (!user) {
      return { ok: false, reason: 'userNotExist' };
    }

    user.changePassword(argsObj.passwordPlainValue1, argsObj.passwordPlainValue2);

    await this.userRepository.updatePassword(user);
    this.forgottenUserRepository.delete(forgottenUser);

    return { ok: true };
  };
}
